import Router from "express";
import * as authController from "../controllers/auth.controller.js";

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



export default authRouter;