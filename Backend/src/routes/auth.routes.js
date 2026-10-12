import Router from "express";
import * as authController from "../controllers/auth.controller.js";
import {authUserMiddleware} from "../middlewares/auth.middleware.js";

const authRouter = Router();


/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController);


/**
 * @route POST /api/auth/login
 * @description Login a user with email and password
 * @access Public
 */
authRouter.post("/login", authController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @description Clear token cookie and add the token to the blacklist
 * @access Public
 */
authRouter.get("/logout", authController.logoutUserController);


/**
 * @route GET /api/auth/get-me
 * @description Get the currently logged in user details
 * @access Private
 */
authRouter.get("/get-me", authUserMiddleware, authController.getMeController);


export default authRouter;