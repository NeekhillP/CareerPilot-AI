import assert from 'node:assert/strict'
import {randomUUID} from 'node:crypto'
import {createRequire} from 'node:module'
import dns from 'node:dns'
import axios from 'axios'
import app from '../../Backend/src/app.js'
import userModel from '../../Backend/src/models/user.model.js'
import interviewReportModel from '../../Backend/src/models/interviewReport.model.js'

// This is an opt-in live test. It uses Gemini and removes only its own test records.
const backendRequire = createRequire(new URL('../../Backend/package.json', import.meta.url))
const mongoose = backendRequire('mongoose')
backendRequire('dotenv').config({path: new URL('../../Backend/.env', import.meta.url), quiet: true})
dns.setServers(['8.8.8.8', '1.1.1.1'])

const users = []
let server
let generatedReport

const createResumePdf = () => {
    const lines = [
        'Alex Example - Full Stack Developer',
        'Three years building React and Node.js applications.',
        'Skills: JavaScript, React, Express, MongoDB, Git, REST APIs.',
        'Built an inventory dashboard and added automated API tests.',
        'Worked with designers and reviewed changes with a team.'
    ]
    const stream = 'BT /F1 12 Tf 40 760 Td 18 TL\n' + lines.map((line) => '(' + line + ') Tj T*').join('\n') + '\nET'
    const objects = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
        '<< /Length ' + Buffer.byteLength(stream) + ' >>\nstream\n' + stream + '\nendstream'
    ]
    let pdf = '%PDF-1.4\n'
    const offsets = [0]
    objects.forEach((object, index) => {
        offsets.push(Buffer.byteLength(pdf))
        pdf += (index + 1) + ' 0 obj\n' + object + '\nendobj\n'
    })
    const xref = Buffer.byteLength(pdf)
    pdf += 'xref\n0 6\n0000000000 65535 f \n'
    pdf += offsets.slice(1).map((offset) => String(offset).padStart(10, '0') + ' 00000 n \n').join('')
    return Buffer.from(pdf + 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF')
}

try {
    assert.ok(process.env.MONGO_URI, 'MONGO_URI is required')
    assert.ok(process.env.GOOGLE_GENAI_API_KEY, 'GOOGLE_GENAI_API_KEY is required')
    assert.ok(process.env.JWT_SECRET, 'JWT_SECRET is required')
    await mongoose.connect(process.env.MONGO_URI, {serverSelectionTimeoutMS: 15000})
    server = app.listen(0, '127.0.0.1')
    await new Promise((resolve) => server.once('listening', resolve))
    const baseURL = 'http://127.0.0.1:' + server.address().port

    const register = async () => {
        const suffix = randomUUID()
        const account = {username: 'flow-' + suffix, email: suffix + '@example.invalid', password: randomUUID()}
        const response = await fetch(baseURL + '/api/auth/register', {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(account)
        })
        assert.equal(response.status, 201, 'Test account registration failed')
        const body = await response.json()
        users.push({_id: body.user.id, email: account.email})
        return {account, cookie: response.headers.getSetCookie()[0].split(';')[0], id: body.user.id}
    }

    assert.equal((await fetch(baseURL + '/api/interviews')).status, 401)
    const owner = await register()
    const login = await fetch(baseURL + '/api/auth/login', {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(owner.account)
    })
    assert.equal(login.status, 200)
    const cookie = login.headers.getSetCookie()[0].split(';')[0]

    // Exercise the same API functions that the Home form and interview hook use.
    const createApi = axios.create
    axios.create = (options) => createApi({...options, baseURL: baseURL + '/api/interviews', headers: {Cookie: cookie}, timeout: 120000})
    let api
    try {
        api = await import('../src/features/Interview/services/interview.api.js')
    } finally {
        axios.create = createApi
    }

    const inputs = {
        resumeFile: new File([createResumePdf()], 'resume.pdf', {type: 'application/pdf'}),
        selfDescription: 'I build full-stack applications and want to improve my backend design and testing skills.',
        jobDescription: 'Full Stack Developer: build React interfaces and Node.js/Express APIs, use MongoDB, write automated tests, and collaborate with a product team. Redis experience is preferred.'
    }

    console.log('Generating a live report from a PDF, self-description, and job description...')
    const started = Date.now()
    const response = await api.generateInterviewReport(inputs)
    generatedReport = response.data
    assert.ok(generatedReport._id)
    assert.ok(generatedReport.title)
    assert.equal(generatedReport.user, owner.id)
    assert.equal(generatedReport.selfDescription, inputs.selfDescription)
    assert.equal(generatedReport.jobDescription, inputs.jobDescription)
    assert.ok(generatedReport.resume.includes('Alex Example'))
    assert.ok(generatedReport.matchScore >= 0 && generatedReport.matchScore <= 100)
    for(const field of ['technicalQuestions', 'behavioralQuestions', 'preparationPlan']) assert.ok(generatedReport[field].length > 0)
    for(const day of generatedReport.preparationPlan) assert.ok(day.tasks.length > 0 && day.tasks.every((task) => typeof task === 'string'))

    const fetched = await api.getInterviewReportById(generatedReport._id)
    assert.deepEqual(fetched.data, generatedReport)
    const list = await api.getAllInterviewReports()
    assert.ok(list.data.some((report) => report._id === generatedReport._id))
    assert.equal(list.data[0].resume, undefined)
    assert.equal(list.data[0].technicalQuestions, undefined)
    await assert.rejects(api.getInterviewReportById('invalid-id'), (error) => error.response?.status === 400)

    const otherUser = await register()
    const forbidden = await fetch(baseURL + '/api/interviews/report/' + generatedReport._id, {headers: {Cookie: otherUser.cookie}})
    assert.equal(forbidden.status, 404, 'Another user must not be able to read the report')

    console.log(JSON.stringify({
        result: 'PASS', elapsedMs: Date.now() - started, matchScore: generatedReport.matchScore,
        technicalQuestions: generatedReport.technicalQuestions.length,
        behavioralQuestions: generatedReport.behavioralQuestions.length,
        preparationDays: generatedReport.preparationPlan.length,
        savedAndFetched: true, reportListing: true, ownershipEnforced: true
    }, null, 2))
} catch(error) {
    let message = error.response?.data?.message || error.message
    for(const key of ['MONGO_URI', 'GOOGLE_GENAI_API_KEY', 'JWT_SECRET']) {
        if(process.env[key]) message = String(message).split(process.env[key]).join('[REDACTED]')
    }
    console.error('FAIL:', message)
    process.exitCode = 1
} finally {
    if(users.length){
        await interviewReportModel.deleteMany({user: {$in: users.map((user) => user._id)}})
        await userModel.deleteMany({$or: users})
        console.log('Temporary test accounts and reports removed.')
    }
    if(server) await new Promise((resolve) => server.close(resolve))
    await mongoose.disconnect()
}
