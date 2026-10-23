import {PDFParse} from 'pdf-parse';
import {generateInterviewReport, generateResumePdf} from '../services/ai.service.js';
import interviewReportModel from '../models/interviewReport.model.js';
import mongoose from 'mongoose';



/**
 * @description Generate a new interview report based on user input
 */
export async function generateInterviewReportController(req, res){
    const {selfDescription = '', jobDescription} = req.body;

    if(!req.file?.buffer?.length){
        return res.status(400).json({message: 'Please upload a PDF resume.'});
    }

    if(typeof jobDescription !== 'string' || !jobDescription.trim()){
        return res.status(400).json({message: 'Please enter a job description.'});
    }

    if(typeof selfDescription !== 'string'){
        return res.status(400).json({message: 'Self-description must be text.'});
    }

    let parser;
    let resume;

    try{
        parser = new PDFParse({data: req.file.buffer});
        resume = (await parser.getText()).text.trim();
    } catch {
        return res.status(400).json({message: 'This PDF could not be read. Please upload another resume.'});
    } finally {
        await parser?.destroy();
    }

    if(!resume){
        return res.status(400).json({message: 'Your PDF has no readable text. Please upload a text-based PDF.'});
    }

    let interviewReportByAI;

    try{
        interviewReportByAI = await generateInterviewReport({resume, selfDescription, jobDescription});
    } catch(error){
        if(error.status === 429){
            return res.status(429).json({message: 'The report request limit was reached. Please try again later.'});
        }

        if(error.status === 503){
            return res.status(503).json({message: 'The AI service is temporarily busy. Please try again shortly.'});
        }

        return res.status(502).json({message: 'We could not generate your report. Please try again.'});
    }

    const interviewReport = await interviewReportModel.create({
        user: req.user._id,
        resume,
        selfDescription,
        jobDescription,
        ...interviewReportByAI
    })

    res.status(201).json({
        message: 'Interview report generated successfully',
        data: interviewReport
    })
}

/**
 * @description Get a specific interview report by ID
 */
export async function getInterviewReportByIdController(req, res){
    const {interviewId} = req.params;

    if(!mongoose.isObjectIdOrHexString(interviewId)){
        return res.status(400).json({message: 'Invalid interview report ID.'});
    }

    const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user._id});

    if(!interviewReport){
        return res.status(404).json({
            message: 'Interview report not found'
        })
    }

    res.status(200).json({
        message: 'Interview report fetched successfully',
        data: interviewReport
    })
}

/**
 * @description Get all interview reports for the current user
 */
export async function getAllInterviewReportsController(req, res){
    const interviewReports = await interviewReportModel.find({user: req.user._id})
    .sort({createdAt: -1})
    .select('title matchScore createdAt updatedAt');

    res.status(200).json({
        message: 'Interview reports fetched successfully',
        data: interviewReports
    })
}

/**
 * @description Generate a PDF of the resume from the interview report
 */
export async function generateResumePdfController(req, res){
    const {interviewId} = req.params;

    if(!mongoose.isObjectIdOrHexString(interviewId)){
        return res.status(400).json({message: 'Invalid interview report ID.'});
    }

    const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user._id});

    if(!interviewReport){
        return res.status(404).json({
            message: 'Interview report not found'
        })
    }

    const {resume, selfDescription, jobDescription} = interviewReport;

    const pdfBuffer = await generateResumePdf({resume, selfDescription, jobDescription});

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume_${interviewId}.pdf"`,
        'Content-Length': pdfBuffer.length,
    })
    res.status(200).send(pdfBuffer);
}
