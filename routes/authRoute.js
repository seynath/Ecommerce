const express = require("express");
const {
  createUser,
  loginUser,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
} = require("../controllers/userCtrl");
//othanadi userCtrl.js ekee createuser kiyana func eke witrai aran thiyenne.
const router = express.Router();
const {authMiddleware,isAdmin} = require("../middlewares/authMiddleware");

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/password",authMiddleware, updatePassword);
router.post("/login", loginUser);
router.get("/logout",logout);
router.get("/all-users", getallUser);
router.get("/refresh", handleRefreshToken); //If the order is causing issues, and you want to prioritize the "/refresh" route, you can keep the second code set but make sure to place the "/refresh" route at the beginning of the router before any routes with parameters like "/:id."
router.get("/:id",authMiddleware,isAdmin,getaUser);
router.delete("/:id", deleteaUser);
router.put("/edit-user",authMiddleware, updatedUser);
router.put("/block-user/:id",authMiddleware,isAdmin, blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin, unblockUser);

module.exports = router;
