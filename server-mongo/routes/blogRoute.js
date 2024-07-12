const express = require("express");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const {createBlog, updateBlog,getAllBlogs,getBlog, deleteBlog, liketheBlog,disliketheBlog,uploadImages} = require("../controllers/blogCtrl");
const {uploadPhoto, blogImgResize} = require("../middlewares/uploadImage");
const router = express.Router();


router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images",2),blogImgResize, uploadImages);
router.put("/likes", authMiddleware,liketheBlog);
router.put("/dislikes", authMiddleware,disliketheBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);



router.get("/",  getAllBlogs);
router.get("/:id",  getBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);
module.exports = router;