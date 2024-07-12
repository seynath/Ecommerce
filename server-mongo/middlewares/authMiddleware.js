const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization;
  if (token && token.startsWith('Bearer')) {
    try {
      const decode = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
      const user = await User.findById(decode.id).select('-password');
      req.user = user;
      next();
    } catch (error) {
      throw new Error('Not Authorized, Token Failed');
    }
  } else {
    throw new Error('Not Authorized, No Token');
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const {email} = req.user;
  const adminUser = await User.findOne({email:email});
  if(adminUser.role !== 'admin'){
    throw new Error('Not Authorized, Admin Only');
  } else{
    next();
  }});

module.exports = {authMiddleware, isAdmin};