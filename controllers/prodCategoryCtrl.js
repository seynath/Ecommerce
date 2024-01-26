const PCategory = require('../models/prodCategoryModel');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
  

  try {
    const newCategory = await PCategory.create(req.body);
    res.json(newCategory);
  } catch (error) {
    // Handle the error appropriately, e.g., send a 500 Internal Server Error response
    res.status(500).json({ error: 'Unsaved Category' });
  }
});


module.exports = {createCategory};