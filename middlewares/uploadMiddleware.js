const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Fungsi untuk memastikan folder ada, jika tidak ada maka buat
const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
};

// Storage untuk Profile Picture
const profilePictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/profile_pictures';
        ensureDirectoryExistence(uploadPath); // Pastikan folder ada
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, uniqueSuffix); // Nama file unik menggunakan timestamp
    }
});

// Storage untuk Receipt (Bukti Pembayaran)
const receiptStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/receipts';
        ensureDirectoryExistence(uploadPath); // Pastikan folder ada
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueSuffix); // Nama file unik menggunakan timestamp dan angka acak
    }
});

// Storage untuk YukAngkut Photo
const yukAngkutStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/yukangkut';
        ensureDirectoryExistence(uploadPath); // Pastikan folder ada
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, uniqueSuffix); // Nama file unik menggunakan timestamp
    }
});

// Storage untuk YukBuang Photo
const yukBuangStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/yukbuang';
        ensureDirectoryExistence(uploadPath); // Pastikan folder ada
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueSuffix); // Nama file unik menggunakan timestamp dan angka acak
    }
});

// Filter untuk file hanya gambar
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Hanya file gambar yang diperbolehkan
    } else {
        cb(new Error('Invalid file type. Only images are allowed!'), false); // Jika bukan gambar
    }
};

// Multer middleware untuk Profile Picture
const uploadProfilePicture = multer({
    storage: profilePictureStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Maksimal 5MB per file
});

// Multer middleware untuk Receipt (Bukti Pembayaran)
const uploadReceipt = multer({
    storage: receiptStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Maksimal 5MB per file
});

// Multer middleware untuk YukAngkut Photo
const uploadYukAngkutPhoto = multer({
    storage: yukAngkutStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Maksimal 5MB per file
});

// Multer middleware untuk YukBuang Photo
const uploadYukBuangPhoto = multer({
    storage: yukBuangStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Maksimal 5MB per file
});

module.exports = { 
    uploadProfilePicture, 
    uploadReceipt, 
    uploadYukAngkutPhoto, 
    uploadYukBuangPhoto 
};