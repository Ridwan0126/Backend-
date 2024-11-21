const express = require('express');
const userController = require('../../controllers/user/userController');
const authMiddleware = require('../../middlewares/authMiddleware'); 
const { uploadProfilePicture } = require('../../middlewares/uploadMiddleware'); // Import only uploadProfilePicture
const router = express.Router();

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/profile/upload', authMiddleware, uploadProfilePicture.single('profileImage'), userController.uploadProfileImage);
router.delete('/profile/image', authMiddleware, userController.deleteProfileImage);
router.get('/admins', authMiddleware, userController.getAdmins); 
router.post('/admins', authMiddleware, userController.addAdmin); 
router.delete('/admins/:id', userController.deleteAdmin);
router.put('/admins/:id', authMiddleware, userController.updateAdmin);

module.exports = router;