const express = require('express');
const userController = require('../../controllers/user/userController');
const authMiddleware = require('../../middlewares/authMiddleware'); 
const { uploadProfilePicture } = require('../../middlewares/uploadMiddleware'); // Import only uploadProfilePicture
const router = express.Router();

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/profile/upload', authMiddleware, uploadProfilePicture.single('profileImage'), userController.uploadProfileImage);
router.delete('/profile/image', authMiddleware, userController.deleteProfileImage);
router.get('/users', authMiddleware, userController.getUsers); 
router.post('/users', authMiddleware, userController.addUsers); 
router.delete('/users/:id', userController.deleteUsers);
router.put('/users/:id', authMiddleware, userController.updateUsers);

module.exports = router;