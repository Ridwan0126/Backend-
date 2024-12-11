const db = require('../../config/db');

const Blog = {
  // Mendapatkan semua blog tanpa limit dan offset
  getAllBlogs: async () => {
    const query = 'SELECT * FROM blogs';  // Tanpa LIMIT dan OFFSET
    try {
      const [results] = await db.execute(query);
      return results;
    } catch (err) {
      throw err;
    }
  },

  // Get a blog by ID
  getBlogById: async (id) => {
    const query = 'SELECT * FROM blogs WHERE id = ?';
    try {
      const [results] = await db.execute(query, [id]);
      if (results.length === 0) {
        return null; // Handle not found
      }
      return results[0];
    } catch (err) {
      throw err;
    }
  },

  // Create a new blog
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

  // Update an existing blog
  updateBlog: async (id, blogData) => {
    const { judul, isiBlog, penulis, tanggalPublikasi, banner, status } = blogData;
    const query = 'UPDATE blogs SET judul = ?, isiBlog = ?, penulis = ?, tanggalPublikasi = ?, banner = ?, status = ? WHERE id = ?';
    try {
      const [results] = await db.execute(query, [judul, isiBlog, penulis, tanggalPublikasi, banner, status, id]);
      if (results.affectedRows === 0) {
        return null; // No rows were updated, handle not found
      }
      return { id, ...blogData };
    } catch (err) {
      throw err;
    }
  },

  // Update an existing blog by ID (allowing partial update)
updateBlogById: async (id, blogData) => {
    const { judul, isiBlog, penulis, tanggalPublikasi, banner, status } = blogData;
  
    // Menyiapkan query untuk update hanya kolom yang diterima
    const query = 'UPDATE blogs SET judul = ?, isiBlog = ?, penulis = ?, tanggalPublikasi = ?, banner = ?, status = ? WHERE id = ?';
    
    try {
      const [results] = await db.execute(query, [judul, isiBlog, penulis, tanggalPublikasi, banner, status, id]);
  
      // Memeriksa jika tidak ada baris yang di-update
      if (results.affectedRows === 0) {
        return null; // Jika tidak ada perubahan, blog dengan ID tidak ditemukan
      }
  
      return { id, ...blogData };  // Kembalikan data blog yang di-update
    } catch (err) {
      throw err;  // Tangani error jika terjadi kesalahan dalam eksekusi query
    }
  },  
  

  // Update the status of a blog
  updateStatus: async (id, status) => {
    const query = 'UPDATE blogs SET status = ? WHERE id = ?';
    try {
      const [results] = await db.execute(query, [status, id]);
      if (results.affectedRows === 0) {
        return null; // No rows were updated, handle not found
      }
      return { id, status };
    } catch (err) {
      throw err;
    }
  },

  // Delete a blog
  deleteBlog: async (id) => {
    const query = 'DELETE FROM blogs WHERE id = ?';
    try {
      const [results] = await db.execute(query, [id]);
      if (results.affectedRows === 0) {
        return null; // Handle not found
      }
      return { message: 'Blog deleted successfully' };
    } catch (err) {
      throw err;
    }
  },

  // Update the banner image of a blog
  updateBlogBannerById: async (id, { banner }) => {
    const query = 'UPDATE blogs SET banner = ? WHERE id = ?';
    try {
      const [results] = await db.execute(query, [banner, id]);
      if (results.affectedRows === 0) {
        return null; // No rows were updated, handle not found
      }
      return { id, banner };
    } catch (err) {
      throw err;
    }
  }
};

module.exports = Blog;