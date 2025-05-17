// middleware/auth.js - Middleware untuk autentikasi JWT

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware untuk memverifikasi token JWT
exports.protect = async (req, res, next) => {
    let token;

    // Cek header Authorization
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Ambil token dari header
            token = req.headers.authorization.split(' ')[1];

            // Verifikasi token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Dapatkan data user dari token dan simpan di req.user
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({
                message: 'Token tidak valid'
            });
        }
    }

    if (!token) {
        res.status(401).json({
            message: 'Akses ditolak, token tidak tersedia'
        });
    }
};