const express = require("express");
const {
  createSize,
  updateSize,
  deleteSize,
  getSize,
  getallSize,
} = require("../controllers/sizeCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createSize);
router.put("/", authMiddleware, isAdmin, updateSize);
router.delete("/:id", authMiddleware, isAdmin, deleteSize);
router.get("/:id", getSize);
router.get("/", getallSize);

module.exports = router;
