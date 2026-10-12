import userModel from "../models/user.model.js";
import blackListTokenModel from "../models/blacklist.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


/**
 * @name registerUserController
 * @description Controller to handle user registration
 * @access Public
 */
export async function registerUserController(req, res){
    try{

        const { username, email, password } = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })

        if(existingUser) {
            return res.status(400).json({ message: "Username or email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({
            id: newUser._id,
        }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        })

        res.cookie("token", token)

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            },
            token
        });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @name loginUserController
 * @description Controller to handle user login
 * @access Public
 */
export async function loginUserController(req, res){
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }
    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

/**
 * @name logoutUserController
 * @description Controller to handle user logout
 * @access Public
 */
export async function logoutUserController(req, res){
    const { token } = req.cookies;

    if(token){
        await blackListTokenModel.create({
            token
        })

        res.clearCookie("token");

        res.status(200).json({
            message: "User logged out successfully"
        })
    } 
}


/**
 * @name getMeController
 * @description Controller to get the currently logged in user details
 * @access Private
 */
export async function getMeController(req, res){
    const user = req.user;

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}