const express = require("express");
const {
  createEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
  changeEnquiryStatus,
} = require("../controllers/enqCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", createEnquiry);
// router.put("/:id", authMiddleware, isAdmin, updateEnquiry);
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry);
router.post("/change-status", changeEnquiryStatus);
router.get("/:orderId", getEnquiry);
router.get("/", getallEnquiry);

module.exports = router;
