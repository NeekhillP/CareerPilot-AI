import Router from "express";
import {authUserMiddleware} from "../middlewares/auth.middleware.js";
import * as interviewController from "../controllers/interview.controller.js";
import upload from "../middlewares/file.middleware.js";

const interviewRouter = Router();


/**
 * @route POST /api/interviews
 * @description Generate new interview report based on user input
 * @access Private
 */
interviewRouter.post('/', authUserMiddleware, upload.single("resume"), interviewController.generateInterviewReportController);

/**
 * @route GET /api/interviews/report/:id
 * @description Get a specific interview report by ID
 * @access Private
 */
interviewRouter.get('/report/:interviewId', authUserMiddleware, interviewController.getInterviewReportByIdController);


/**
 * @route GET /api/interviews
 * @description Get all interview reports for the current user
 * @access Private
 */
interviewRouter.get('/', authUserMiddleware, interviewController.getAllInterviewReportsController);


/**
 * @route GET /api/interviews/resume/pdf/:interviewId
 * @description Generate a PDF of the resume from the interview report
 * @access Private
 */
interviewRouter.get('/resume/pdf/:interviewId', authUserMiddleware, interviewController.generateResumePdfController);

export default interviewRouter;