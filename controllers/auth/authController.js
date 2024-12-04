const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user/User');

const authController = {
    register: async (req, res) => {
        try {
          const { name, email, password } = req.body;
    
          if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nama, email, dan password harus diisi' });
          }
    
          const existingUser = await User.findByEmail(email);
          if (existingUser) { 
            return res.status(400).json({ message: 'Email sudah terdaftar' });
          }

          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser = {
            name,
            email,
            password: hashedPassword,
            phone: null, 
            address: null,
            gender: 'Laki-laki', 
            role: 'User', 
            status: 'active', 
          };
    
          await User.create(newUser);
    
          res.status(201).json({ message: 'User created successfully' });
    
        } catch (error) {
          console.error('Error during registration:', error);
          res.status(500).json({ message: 'Server error' });
        }
      },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.SECRET_KEY, 
        { expiresIn: '1h' }
      );

      res.status(200).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone, 
          address: user.address,
          gender: user.gender,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  },
};

module.exports = authController;