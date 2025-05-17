// models/User.js - Model untuk data pengguna aplikasi

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    plants: [
        {
            plantName: {
                type: String,
                required: true
            },
            plantType: {
                type: String,
                required: true
            },
            notificationEnabled: {
                type: Boolean,
                default: true
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

// Enkripsi password sebelum menyimpan
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method untuk membandingkan password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('user', UserSchema);