const express = require('express');
const { updateAdminProfile } = require('../controllers/adminController');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware'); // jika menggunakan autentikasi JWT

// Route untuk update profile admin
router.put('/profile', verifyToken, updateAdminProfile);

module.exports = router;