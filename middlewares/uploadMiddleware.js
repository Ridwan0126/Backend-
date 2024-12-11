const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
};

const fileFilter = (req, file, cb) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (validTypes.includes(file.mimetype)) {
        cb(null, true); 
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, or GIF are allowed.'), false); 
    }
};

const upload = (folderName) => {
    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                const uploadPath = `uploads/${folderName}`;
                ensureDirectoryExistence(uploadPath); 
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
                cb(null, uniqueSuffix);
            }
        }),
        fileFilter: fileFilter, 
        limits: { fileSize: 5 * 1024 * 1024 } 
    });
};

const uploadProfilePicture = upload('profile_pictures');
const uploadReceipt = upload('receipts');
const uploadBlogImage = upload('blog');
const uploadYukAngkutPhoto = upload('yukangkut').array('photo', 2); 
const uploadYukBuangPhoto = upload('yukbuang').array('photo', 2);

module.exports = { 
    uploadProfilePicture, 
    uploadReceipt, 
    uploadBlogImage,
    uploadYukAngkutPhoto, 
    uploadYukBuangPhoto
};