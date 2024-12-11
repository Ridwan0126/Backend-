const express = require('express');
const blogController = require('../../controllers/blog/blogController');
const { uploadBlogImage } = require('../../middlewares/uploadMiddleware'); // Pastikan ini diimpor dengan benar
const router = express.Router();


router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/', blogController.createBlog);
router.post('/upload-image', uploadBlogImage.single('image'), blogController.uploadBlogImage);
router.put('/:id', uploadBlogImage.single('image'), blogController.updateBlog);
router.put('/:id', blogController.updateBlog);  
router.put('/:id/status', blogController.updateBlogStatus);  
router.delete('/:id', blogController.deleteBlog);

module.exports = router;