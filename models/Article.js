const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, default: 'Geral' },
    coverImage: { type: String, default: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    views: { type: Number, default: 0 }
});

module.exports = mongoose.model('Article', articleSchema);
