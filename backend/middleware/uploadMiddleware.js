const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';

        // If it's a profile photo, save to 'uploads/profiles'
        if (file.fieldname === 'profile_photo') {
            uploadPath = 'uploads/profiles';
        }
        // If authenticated user is uploading media, put in their folder
        else if (req.userId) {
            uploadPath = path.join('uploads', req.userId.toString());
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Basic filter, can be expanded
    // Allow images, videos, pdfs
    // const allowedTypes = /jpeg|jpg|png|pdf|mp4/;
    // const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    // const mimetype = allowedTypes.test(file.mimetype);

    // Requirement says "Any file type" for media, but let's keep it safe-ish or just allow all?
    // "Images, Videos, PDFs, Any file type" -> Allow all for now as per "Any file type"
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: { fileSize: Infinity }, // No file size limit
    fileFilter: fileFilter
});

module.exports = upload;
