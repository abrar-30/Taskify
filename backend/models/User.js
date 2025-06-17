const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose'); // <-- Add this line

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: { // Added email field
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
    }
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);