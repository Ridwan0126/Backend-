const User = require('../../models/user/User');
const fs = require('fs');
const path = require('path');

const userController = {
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const genderConverted = user.gender === 'Laki-laki' ? 'male' : 'female';

            res.json({
                firstName: user.name.split(' ')[0],
                lastName: user.name.split(' ').slice(1).join(' '),
                email: user.email,
                phone: user.number,
                address: user.address,
                gender: genderConverted,
                role: user.role,
                profileImage: user.profile_image || '/Avatar.svg'
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { firstName, lastName, email, phone, address, gender, profileImage } = req.body;
            const genderInDb = gender === 'male' ? 'Laki-laki' : 'Perempuan';
            const fullName = `${firstName} ${lastName}`;

            const result = await User.updateById(req.userId, {
                name: fullName,
                email,
                number: phone,
                address,
                gender: genderInDb,
                profile_image: profileImage
            });

            if (result.affectedRows > 0) {
                const updatedUser = await User.findById(req.userId);
                res.json({
                    firstName: updatedUser.name.split(' ')[0],
                    lastName: updatedUser.name.split(' ').slice(1).join(' '),
                    email: updatedUser.email,
                    phone: updatedUser.number,
                    address: updatedUser.address,
                    gender: updatedUser.gender === 'Laki-laki' ? 'male' : 'female',
                    role: updatedUser.role,
                    profileImage: updatedUser.profile_image,
                    message: 'Profile updated successfully'
                });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    uploadProfileImage: async (req, res) => {
        try {
            const userId = req.userId;
            const profileImagePath = `/uploads/profile_pictures/${req.file.filename}`;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const result = await User.updateById(userId, {
                profile_image: profileImagePath,
                name: user.name,
                email: user.email,
                number: user.number,
                address: user.address,
                role: user.role,
                status: user.status
            });

            res.json({
                message: 'Profile image uploaded successfully',
                profileImage: profileImagePath
            });
        } catch (error) {
            console.error('Error uploading profile image:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    deleteProfileImage: async (req, res) => {
        try {
            const user = await User.findById(req.userId); 
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.profile_image && user.profile_image !== '/Avatar.svg') {
                const imagePath = path.resolve(__dirname, '..', user.profile_image);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Failed to delete image file:', err);
                    }
                });
            }

            const result = await User.updateById(req.userId, {
                profile_image: null,
                name: user.name,         
                email: user.email,       
                number: user.number,    
                address: user.address,   
                role: user.role,         
                status: user.status      
            });

            res.json({ message: 'Profile image deleted successfully' });
        } catch (error) {
            console.error('Error deleting profile image:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },    

    getUsers: async (req, res) => {
        try {
            const role = req.query.role; // Ambil role dari query string
    
            let users;
            if (role) {
                // Jika ada query role, ambil pengguna berdasarkan role tersebut
                users = await User.findByRole(role);
            } else {
                // Jika tidak ada query role, ambil semua pengguna (baik Admin maupun User)
                users = await User.findAll();  // Memanggil method findAll untuk mengambil semua data pengguna
            }
    
            res.json(users); // Kirimkan data pengguna
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },    

    addUsers: async (req, res) => {
        try {
            const { name, email, number, address, role, status } = req.body;
            const newUser = { name, email, number, address, role, status };
            const result = await User.create(newUser);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error adding user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    deleteUsers: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await User.deleteById(id);
            if (result.affectedRows > 0) {
                res.json({ message: 'User berhasil dihapus' });
            } else {
                res.status(404).json({ message: 'User tidak ditemukan' });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    updateUsers: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email, number, address, role, status } = req.body;
            const result = await User.updateById(id, { name, email, number, address, role, status });
            if (result.affectedRows > 0) {
                res.json({ message: 'User updated successfully' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = userController;