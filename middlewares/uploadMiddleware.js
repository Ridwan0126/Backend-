const multer = require('multer');
const path = require('path');

const profilePictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile_pictures'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const receiptStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/receipts';
        console.log('Saving file to:', uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        console.log('Generated file name:', fileName); 
        cb(null, fileName);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed!'), false);
    }
};

const uploadProfilePicture = multer({ 
    storage: profilePictureStorage, 
    fileFilter 
});

const uploadReceipt = multer({ 
    storage: receiptStorage, 
    fileFilter 
});



module.exports = { uploadProfilePicture, uploadReceipt };