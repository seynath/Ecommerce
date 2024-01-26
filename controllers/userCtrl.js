const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const generateToken = require('../config/jwtToken');
const validateMongoDbId = require('../utils/validateMongodbid');
const generateRefreshToken = require('../config/refreshtoken');
const jwt = require('jsonwebtoken');
const sendEmail = require('../controllers/emailCtrl');
const crypto = require('crypto');






const createUser = asyncHandler(async (req, res) => {
  /**
   * TODO:Get the email from req.body
   */
  const email = req.body.email;
  /**
   * TODO:With the help of email find the user exists or not
   */
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    /**
     * TODO:if user not found user create a new user
     */
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    /**
     * TODO:if user found then thow an error: User already exists
     */
    throw new Error("User Already Exists");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({email:email});
  if(findUser && (await findUser.isPasswordMatched(password))){
    const refreshToken = generateRefreshToken(findUser._id);
    const updateUser = await User.findByIdAndUpdate(findUser._id, {refreshToken:refreshToken}, {new:true});
    res.cookie('refreshToken', refreshToken, {
      httpOnly:true,
      //path:'/api/user/refreshToken',
      maxAge: 3*24*60*60*1000,
    });   
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      isAdmin: findUser?.isAdmin,
      token: generateToken(findUser?._id), //generateToken
    });
  } else{ 
    throw new Error("Invalid Credentials");
  }
});
   
    



    const getallUser = asyncHandler(async (req, res) => {
      try {
        const getUsers = await User.find();
        res.json(getUsers);
      } catch (error) {
        throw new Error(error);
      }
    });

    const getaUser = asyncHandler(async (req, res) => {
      const { id } = req.params;
      validateMongoDbId(id);
     
      try {
        const getaUser = await User.findById(id);
        res.json({
          getaUser,
        });
      } catch (error) {
        throw new Error(error);
      }
    });

    //delete a user

    const deleteaUser = asyncHandler(async (req, res) => {
      const { id } = req.params;
     validateMongoDbId(id);
    
      try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
          deleteaUser,
        });
      } catch (error) {
        throw new Error(error);
      }
    });

    // Update a user

const updatedUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
 validateMongoDbId(id);

  try {
    const blockusr = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User Blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User UnBlocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// const handleRefreshToken = asyncHandler(async (req, res) => {
//   const cookie = req.cookies;
//   if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
//   const refreshToken = cookie.refreshToken;
//   const user = await User.findOne({ refreshToken });
//   if (!user) throw new Error(" No Refresh token present in db or not matched");
//   jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
//     if (err || user.id !== decoded.id) {
//       throw new Error("There is something wrong with refresh token");
//     }
//     const accessToken = generateToken(user?._id);
//     res.json({ accessToken });
//   });
// });
const handleRefreshToken = asyncHandler(async (req, res) => {
  // Extract the 'refreshToken' from cookies in the request
  const cookie = req.cookies;

  // Check if there is a 'refreshToken' in the cookies
  if (!cookie?.refreshToken) {
    // If not, send a 401 Unauthorized response with an error message
    return res.status(401).json({ message: "No Refresh Token in Cookies" });
  }

  // Retrieve the 'refreshToken' from the cookies
  const refreshToken = cookie.refreshToken;

  // Find a user in the database based on the 'refreshToken'
  const user = await User.findOne({ refreshToken });

  // If no user is found or the 'refreshToken' doesn't match, send an error response
  if (!user) {
    return res.status(401).json({ message: "No Refresh token present in db or not matched" });
  }

  // Verify the 'refreshToken' using the JWT_SECRET
  jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
    // If there's an error or the user ID in the token doesn't match the user ID in the database
    if (err || user.id !== decoded.id) {
      // Send an error response
      return res.status(401).json({ message: "There is something wrong with the refresh token" });
    }

    // If verification is successful, generate a new access token
    const accessToken = generateToken(user?._id);

    // Send the new access token in the response
    res.json({ accessToken });
  });
});

// logout functionality

// const logout = asyncHandler(async (req, res) => {
//   const cookie = req.cookies;
//   if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
//   const refreshToken = cookie.refreshToken;
//   const user = await User.findOne({ refreshToken });
//   if (!user) {
//     res.clearCookie("refreshToken", {
//       httpOnly: true,
//       secure: true,
//     });
//     return res.sendStatus(204); // forbidden
//   }
//   await User.findOneAndUpdate(refreshToken, {
//     refreshToken: "",
//   });
//   res.clearCookie("refreshToken", {
//     httpOnly: true,
//     secure: true,
//   });
//   res.sendStatus(204); // forbidden
// });
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // No Content
  }

  // Update the user's refreshToken to an empty string
  // methana thamai case eke thiyennne
  await User.findOneAndUpdate({ refreshToken }, {
    $set: { refreshToken: "" },
  });

  // Clear the refreshToken cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });

  return res.sendStatus(204); // No Content
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error(" Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user); 
});

    module.exports = { createUser, loginUser, getallUser, getaUser, deleteaUser, updatedUser, blockUser, unblockUser, handleRefreshToken, logout , updatePassword, forgotPasswordToken, resetPassword};