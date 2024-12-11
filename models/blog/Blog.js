const db = require('../../config/db');

const Blog = {
  getAllBlogs: async () => {
    const query = 'SELECT * FROM blogs';  
    try {
      const [results] = await db.execute(query);
      return results;
    } catch (err) {
      throw err;
    }
  },

  getBlogById: async (id) => {
    const query = 'SELECT * FROM blogs WHERE id = ?';
    try {
      const [results] = await db.execute(query, [id]);
      if (results.length === 0) {
        return null; 
      }
      return results[0];
    } catch (err) {
      throw err;
    }
  },

  createBlog: async (blogData) => {
    const { judul, isiBlog, penulis, tanggalPublikasi, banner, status } = blogData;
    const query = 'INSERT INTO blogs (judul, isiBlog, penulis, tanggalPublikasi, banner, status) VALUES (?, ?, ?, ?, ?, ?)';
    try {
      const [results] = await db.execute(query, [judul, isiBlog, penulis, tanggalPublikasi, banner, status]);
      return { id: results.insertId, ...blogData };
    } catch (err) {
      throw err;
    }
  },

  updateBlog: async (id, blogData) => {
    const { judul, isiBlog, penulis, tanggalPublikasi, banner, status } = blogData;
    const query = 'UPDATE blogs SET judul = ?, isiBlog = ?, penulis = ?, tanggalPublikasi = ?, banner = ?, status = ? WHERE id = ?';
    try {
      const [results] = await db.execute(query, [judul, isiBlog, penulis, tanggalPublikasi, banner, status, id]);
      if (results.affectedRows === 0) {
        return null; 
      }
      return { id, ...blogData };
    } catch (err) {
      throw err;
    }
  },

updateBlogById: async (id, blogData) => {
    const { judul, isiBlog, penulis, tanggalPublikasi, banner, status } = blogData;
  
    const query = 'UPDATE blogs SET judul = ?, isiBlog = ?, penulis = ?, tanggalPublikasi = ?, banner = ?, status = ? WHERE id = ?';
    
    try {
      const [results] = await db.execute(query, [judul, isiBlog, penulis, tanggalPublikasi, banner, status, id]);
  
      if (results.affectedRows === 0) {
        return null; 
      }
  
      return { id, ...blogData }; 
    } catch (err) {
      throw err; 
    }
  },  

  deleteBlog: async (id) => {
    const query = 'DELETE FROM blogs WHERE id = ?';
    try {
      const [results] = await db.execute(query, [id]);
      if (results.affectedRows === 0) {
        return null; 
      }
      return { message: 'Blog deleted successfully' };
    } catch (err) {
      throw err;
    }
  },

  updateBlogBannerById: async (id, { banner }) => {
    const query = 'UPDATE blogs SET banner = ? WHERE id = ?';
    try {
      const [results] = await db.execute(query, [banner, id]);
      if (results.affectedRows === 0) {
        return null; 
      }
      return { id, banner };
    } catch (err) {
      throw err;
    }
  },

  getPublishedBlogs: async () => {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM blogs WHERE status = ?',
        ['Dipublikasikan']
      ); 
      return rows;
    } catch (err) {
      console.error('Error fetching blogs from database:', err);
      throw err;
    }
  },
};

module.exports = Blog;