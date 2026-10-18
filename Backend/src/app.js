
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import interviewRouter from "./routes/interview.routes.js";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Authentication routes
app.use("/api/auth", authRouter);

// Interview routes
app.use("/api/interviews", interviewRouter);

app.use((error, req, res, next)=>{
    if(res.headersSent) return next(error);

    if(error.code === 'LIMIT_FILE_SIZE'){
        return res.status(413).json({message: 'Your resume must not exceed 3 MB.'});
    }

    if(error.name === 'MulterError'){
        return res.status(400).json({message: 'Please upload one PDF resume no larger than 3 MB.'});
    }

    const status = error.status || 500;
    res.status(status).json({message: status >= 500 ? 'Something went wrong. Please try again.' : error.message});
});

export default app;

