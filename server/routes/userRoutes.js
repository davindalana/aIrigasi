// routes/userRoutes.js - Routes untuk manajemen user

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

/**
 * @desc    Registrasi user baru
 * @route   POST /api/users/register
 * @access  Public
 */
router.post('/register', [
    check('name', 'Nama wajib diisi').not().isEmpty(),
    check('email', 'Masukkan email yang valid').isEmail(),
    check('password', 'Password minimal 6 karakter').isLength({ min: 6 })
], async (req, res) => {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        // Cek apakah user sudah ada
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User dengan email ini sudah terdaftar' });
        }

        // Buat user baru
        user = new User({
            name,
            email,
            password
        });

        // Simpan user ke database
        await user.save();

        // Buat JWT token
        const payload = {
            id: user.id
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        console.error('Error saat registrasi:', error.message);
        res.status(500).json({ message: 'Gagal mendaftarkan user' });
    }
});

/**
 * @desc    Login user
 * @route   POST /api/users/login
 * @access  Public
 */
router.post('/login', [
    check('email', 'Masukkan email yang valid').isEmail(),
    check('password', 'Password diperlukan').exists()
], async (req, res) => {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Cek apakah user ada
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Kredensial tidak valid' });
        }

        // Verifikasi password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Kredensial tidak valid' });
        }

        // Buat JWT token
        const payload = {
            id: user.id
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        console.error('Error saat login:', error.message);
        res.status(500).json({ message: 'Gagal melakukan login' });
    }
});

/**
 * @desc    Mendapatkan profil user
 * @route   GET /api/users/profile
 * @access  Private
 */
router.get('/profile', protect, async (req, res) => {
    try {
        // Ambil user dari database tanpa password
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error saat mengambil profil:', error.message);
        res.status(500).json({ message: 'Gagal mengambil profil user' });
    }
});

/**
 * @desc    Update profil user
 * @route   PUT /api/users/profile
 * @access  Private
 */
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, email } = req.body;

        // Buat objek field untuk diupdate
        const userFields = {};
        if (name) userFields.name = name;
        if (email) userFields.email = email;

        // Update user
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: userFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        console.error('Error saat mengupdate profil:', error.message);
        res.status(500).json({ message: 'Gagal mengupdate profil user' });
    }
});

/**
 * @desc    Menambahkan tanaman baru ke profil user
 * @route   POST /api/users/plants
 * @access  Private
 */
router.post('/plants', [
    protect,
    [
        check('plantName', 'Nama tanaman diperlukan').not().isEmpty(),
        check('plantType', 'Jenis tanaman diperlukan').not().isEmpty()
    ]
], async (req, res) => {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { plantName, plantType, notificationEnabled = true } = req.body;

        // Dapatkan user
        const user = await User.findById(req.user.id);

        // Tambahkan tanaman baru
        user.plants.unshift({
            plantName,
            plantType,
            notificationEnabled
        });

        // Simpan user
        await user.save();

        res.json(user.plants);
    } catch (error) {
        console.error('Error saat menambahkan tanaman:', error.message);
        res.status(500).json({ message: 'Gagal menambahkan tanaman' });
    }
});

/**
 * @desc    Mendapatkan semua tanaman milik user
 * @route   GET /api/users/plants
 * @access  Private
 */
router.get('/plants', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.json(user.plants);
    } catch (error) {
        console.error('Error saat mengambil tanaman:', error.message);
        res.status(500).json({ message: 'Gagal mengambil daftar tanaman' });
    }
});

/**
 * @desc    Menghapus tanaman dari profil user
 * @route   DELETE /api/users/plants/:plant_id
 * @access  Private
 */
router.delete('/plants/:plant_id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Dapatkan index tanaman yang akan dihapus
        const removeIndex = user.plants.map(plant => plant.id).indexOf(req.params.plant_id);

        if (removeIndex === -1) {
            return res.status(404).json({ message: 'Tanaman tidak ditemukan' });
        }

        // Hapus tanaman
        user.plants.splice(removeIndex, 1);

        // Simpan user
        await user.save();

        res.json(user.plants);
    } catch (error) {
        console.error('Error saat menghapus tanaman:', error.message);
        res.status(500).json({ message: 'Gagal menghapus tanaman' });
    }
});

module.exports = router;