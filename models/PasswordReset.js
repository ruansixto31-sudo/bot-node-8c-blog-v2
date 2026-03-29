const mongoose = require('mongoose');

const PasswordResetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    facePhoto: { type: String, required: true }, // Cloudinary URL
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
