const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    music: {
        title: String,
        artist: String,
        previewUrl: String
    },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // Auto-delete after 24h
});

module.exports = mongoose.model('Note', noteSchema);
