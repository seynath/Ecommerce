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
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus
  
} = require("../controllers/userCtrl");
//othanadi userCtrl.js ekee createuser kiyana func eke witrai aran thiyenne.
const router = express.Router();
const {authMiddleware,isAdmin} = require("../middlewares/authMiddleware");

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/password",authMiddleware, updatePassword);
router.put("/order/update-order/:id",authMiddleware,isAdmin, updateOrderStatus);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);

router.post("/cart",authMiddleware,userCart);
router.post("/cart/applycoupon",authMiddleware,applyCoupon);
router.post("/cart/cash-order",authMiddleware,createOrder);
router.get("/logout",logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);

router.get("/all-users", getallUser);
router.get("/get-orders",authMiddleware,getOrders);
router.get("/refresh", handleRefreshToken); //If the order is causing issues, and you want to prioritize the "/refresh" route, you can keep the second code set but make sure to place the "/refresh" route at the beginning of the router before any routes with parameters like "/:id."
router.get("/:id",authMiddleware,isAdmin,getaUser);

router.delete("/empty-cart",authMiddleware,emptyCart);
router.delete("/:id", deleteaUser);

router.put("/edit-user",authMiddleware, updatedUser);
router.put("/save-address",authMiddleware, saveAddress);
router.put("/block-user/:id",authMiddleware,isAdmin, blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin, unblockUser); 

module.exports = router;
