const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware untuk autentikasi
const router = express.Router();

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.get('/admins', authMiddleware, userController.getAdmins); 
router.post('/admins', authMiddleware, userController.addAdmin); 
router.delete('/admins/:id', userController.deleteAdmin);
router.put('/admins', authMiddleware, userController.updateAdmin);

module.exports = router;