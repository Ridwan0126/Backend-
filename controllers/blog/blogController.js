const Blog = require('../../models/blog/Blog');
const db = require('../../config/db');

// Get all blogs
exports.getAllBlogs = async (req, res) => {
    try {
      const blogs = await Blog.getAllBlogs();  // Tidak perlu limit dan offset lagi
      res.status(200).json(blogs);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      res.status(500).json({ message: 'Terjadi kesalahan saat mengambil blog', error: err });
    }
  };
// Get a blog by ID
exports.getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.getBlogById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (err) {
    console.error('Error retrieving blog:', err);
    res.status(500).json({ message: 'Error retrieving blog', error: err });
  }
};

// Create a new blog
exports.createBlog = async (req, res) => {
  const { judul, isiBlog, penulis, tanggalPublikasi, banner, status } = req.body;

  // Validate required fields
  if (!judul || !isiBlog || !penulis || !tanggalPublikasi || !banner || !status) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const blogData = { judul, isiBlog, penulis, tanggalPublikasi, banner, status };
  try {
    const newBlog = await Blog.createBlog(blogData);
    res.status(201).json(newBlog);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ message: 'Error creating blog', error: err });
  }
};

exports.updateBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const existingBlog = await Blog.getBlogById(id);

    if (!existingBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const updatedData = {
        judul: req.body.judul !== undefined ? req.body.judul : existingBlog.judul,
        isiBlog: req.body.isiBlog !== undefined ? req.body.isiBlog : existingBlog.isiBlog,
        penulis: req.body.penulis !== undefined ? req.body.penulis : existingBlog.penulis,
        tanggalPublikasi: req.body.tanggalPublikasi !== undefined ? req.body.tanggalPublikasi : existingBlog.tanggalPublikasi,
        status: req.body.status !== undefined ? req.body.status : existingBlog.status,
        banner: req.file ? `/uploads/blog/${req.file.filename}` : existingBlog.banner,
      };
      
    const result = await Blog.updateBlogById(id, updatedData);

    if (result) {
      res.json({ message: 'Blog updated successfully', updatedData: result });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: 'Error updating blog', error });
  }
};

exports.updateBlogStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  const validStatuses = ['Dipublikasikan', 'Draft']; // Modify with the actual valid statuses
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const updatedBlog = await Blog.updateStatus(id, status);
    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(updatedBlog);
  } catch (err) {
    console.error('Error updating blog status:', err);
    res.status(500).json({ message: 'Error updating blog status', error: err });
  }
};

// In your blogController.js
exports.uploadBlogImage = async (req, res) => {
    const { id } = req.params;
  
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const fileUrl = `/uploads/blog/${req.file.filename}`;
  
    try {
      if (id) {
        // If there's an ID, update the image for an existing blog
        const result = await Blog.updateBlogImageById(id, { image: fileUrl });
  
        if (result.affectedRows > 0) {
          res.json({ message: 'Image uploaded successfully', imageUrl: fileUrl });
        } else {
          res.status(404).json({ message: 'Blog not found' });
        }
      } else {
        // If there's no ID (i.e., creating a new blog), return the image URL without saving to a blog
        res.json({ message: 'Image uploaded successfully', imageUrl: fileUrl });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Error uploading image', error });
    }
  };  

exports.deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Blog.deleteBlog(id);
    if (!response) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully', id });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ message: 'Error deleting blog', error: err });
  }
};