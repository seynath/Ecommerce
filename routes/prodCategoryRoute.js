const express = require("express");
const router = express.Router();
const { createCategory } = require("../controllers/prodCategoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware,isAdmin, createCategory);

module.exports = router;