import {PDFParse} from 'pdf-parse';
import {generateInterviewReport} from '../services/ai.service.js';
import interviewReportModel from '../models/interviewReport.model.js';



/**
 * @description Generate a new interview report based on user input
 */
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

/**
 * @description Get a specific interview report by ID
 */
export async function getInterviewReportByIdController(req, res){
    const {interviewId} = req.params;

    const interviewReport = await interviewReportModel.findById(interviewId);

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
    const interviewReports = (await interviewReportModel.find({user: req.user._id}))
    .sort({createdAt: -1})
    .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

    res.status(200).json({
        message: 'Interview reports fetched successfully',
        data: interviewReports
    })
}