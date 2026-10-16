import {PDFParse} from 'pdf-parse';
import {generateInterviewReport} from '../services/ai.service.js';
import interviewReportModel from '../models/interviewReport.model.js';

export async function generateInterviewReportController(req, res){
    const resumeFIle = req.file

    const parser = new PDFParse({data: resumeFIle.buffer})
    const resumeContent = await parser.getText()
    await parser.destroy()

    const {selfDescription, jobDescription} = req.body;

    const interviewReportByAI = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user._id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAI
    })

    res.status(201).json({
        message: 'Interview report generated successfully',
        data: interviewReport
    })
}