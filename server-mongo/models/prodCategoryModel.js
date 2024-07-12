const mongoose = require('mongoose');

const proCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        indexe: true,
    }, 
  }, { timestamps: true });

module.exports = mongoose.model('PCategory', proCategorySchema);