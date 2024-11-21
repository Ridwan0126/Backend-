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
            const user = await User.findById(req.userId); // Ambil data user saat ini
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Hapus file gambar jika ada
            if (user.profile_image && user.profile_image !== '/Avatar.svg') {
                const imagePath = path.join(__dirname, '..', user.profile_image);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Failed to delete image file:', err);
                    }
                });
            }
    
            // Update profile_image menjadi null, tetapi jaga kolom lain agar tidak null
            const result = await User.updateById(req.userId, {
                profile_image: null,
                name: user.name,         // Tetap gunakan nama saat ini
                email: user.email,       // Tetap gunakan email saat ini
                number: user.number,     // Tetap gunakan nomor saat ini
                address: user.address,   // Tetap gunakan alamat saat ini
                role: user.role,         // Tetap gunakan role saat ini
                status: user.status      // Tetap gunakan status saat ini
            });
    
            res.json({ message: 'Profile image deleted successfully' });
        } catch (error) {
            console.error('Error deleting profile image:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },    

    getAdmins: async (req, res) => {
        try {
            const admins = await User.findByRole('Admin');
            res.json(admins);
        } catch (error) {
            console.error('Error fetching admins:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    addAdmin: async (req, res) => {
        try {
            const { name, email, number, address, role, status } = req.body;
            const newAdmin = { name, email, number, address, role, status };
            const result = await User.create(newAdmin);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error adding admin:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    deleteAdmin: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await User.deleteById(id);
            if (result.affectedRows > 0) {
                res.json({ message: 'Admin berhasil dihapus' });
            } else {
                res.status(404).json({ message: 'Admin tidak ditemukan' });
            }
        } catch (error) {
            console.error('Error deleting admin:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    updateAdmin: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email, number, address, role, status } = req.body;
            const result = await User.updateById(id, { name, email, number, address, role, status });
            if (result.affectedRows > 0) {
                res.json({ message: 'Admin updated successfully' });
            } else {
                res.status(404).json({ message: 'Admin not found' });
            }
        } catch (error) {
            console.error('Error updating admin:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = userController;