const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        indexe: true,
    }, 
  }, { timestamps: true });

module.exports = mongoose.model('PCategory', categorySchema);