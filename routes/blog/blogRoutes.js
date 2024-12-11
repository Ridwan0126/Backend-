const express = require('express');
const blogController = require('../../controllers/blog/blogController');
const { uploadBlogImage } = require('../../middlewares/uploadMiddleware'); 
const router = express.Router();

router.get('/published', blogController.getPublishedBlogs); 
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/', blogController.createBlog);
router.post('/upload-image', uploadBlogImage.single('image'), blogController.uploadBlogImage);
router.put('/:id', uploadBlogImage.single('image'), blogController.updateBlog);
router.put('/:id', blogController.updateBlog);  
router.delete('/:id', blogController.deleteBlog);

module.exports = router;