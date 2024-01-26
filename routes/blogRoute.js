const express = require("express");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const {createBlog, updateBlog,getAllBlogs,getBlog, deleteBlog, liketheBlog,disliketheBlog} = require("../controllers/blogCtrl");
const router = express.Router();


router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/likes", authMiddleware,liketheBlog);
router.put("/dislikes", authMiddleware,disliketheBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);



router.get("/",  getAllBlogs);
router.get("/:id",  getBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);
module.exports = router;