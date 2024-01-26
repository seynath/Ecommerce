const mongoose = require('mongoose');
const validateMongoDbId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID');
  }
};
module.exports = validateMongoDbId;
