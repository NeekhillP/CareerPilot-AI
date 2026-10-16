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


export default interviewRouter;