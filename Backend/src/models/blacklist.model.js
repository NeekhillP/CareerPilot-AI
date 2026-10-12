import mongoose from 'mongoose';


const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required"]
    }
}, {
    timestamps: true
})


const blackListTokenModel = mongoose.model("blacklisttoken", blackListTokenSchema);

export default blackListTokenModel;