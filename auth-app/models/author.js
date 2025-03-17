const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure userId is used
    name: { type: String, required: true },
    description: { type: String, required: true },
    articles: [{ title: String, content: String }],
});

module.exports = mongoose.model('Author', authorSchema);
