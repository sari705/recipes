const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: { type: [String], required: true },
    steps: { type: [String], required: true },
    image_url: { type: String },
    likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    is_public: { type: Boolean, default: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [
        {
            content: { type: String, required: true },
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        },
    ],
    category: { type: String, required: true }, // הוספת שדה קטגוריה
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
