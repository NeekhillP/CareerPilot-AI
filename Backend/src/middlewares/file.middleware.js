import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter(req, file, callback){
        if(!file.originalname.toLowerCase().endsWith('.pdf') || file.mimetype !== 'application/pdf'){
            const error = new Error('Please upload a PDF resume.');
            error.status = 400;
            return callback(error);
        }

        callback(null, true);
    },
    limits: {
        fileSize: 3 * 1024 * 1024, // 3MB
    }
})

export default upload
