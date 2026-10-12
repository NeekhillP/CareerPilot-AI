import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import blackListTokenModel from "../models/blacklist.model.js";

export async function authUserMiddleware(req, res, next){
    try{
        const token = req.cookies.token;

        if(!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const isBlacklisted = await blackListTokenModel.findOne({ token });

        if(isBlacklisted){
            return res.status(401).json({ message: "Token is Invalid" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if(!user){
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;

        next();

    } catch(err){
        return res.status(401).json({ message: "Invalid token" });
    }
}

