const Blog = require('../models/blogModel');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const validateMongoDbId = require('../utils/validateMongodbid.js');
const { cloudinaryUploadImg } = require('../utils/cloudinary');
const fs = require('fs');

//crateBlog controller
const createBlog = asyncHandler(async (req, res) => {
  const newBlog = new Blog(req.body);

  try {
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    // Handle the error appropriately, e.g., send a 500 Internal Server Error response
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try{
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {new: true});
    res.status(200).json(updateBlog);
  }
  catch(error){
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (error) {
    throw new Error(error);
  }
});

const getBlog = asyncHandler(async (req, res) => {
  
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getBlog = await Blog.findById(id)
    .populate("likes")
    .populate("dislikes");
    await Blog.findByIdAndUpdate(
      id,
      { $inc: { numViews: 1 } },
      { new: true}
    )
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try{
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.status(200).json(deleteBlog);
  }
  catch(error){
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



const liketheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);
  // Find the blog which you want to be liked
  const blog = await Blog.findById(blogId);
  // find the login user
  const loginUserId = req?.user?._id;
  // find if the user has liked the blog
  const isLiked = blog?.isLiked;
  // find if the user has disliked the blog
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});


const disliketheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);
  // Find the blog which you want to be liked
  const blog = await Blog.findById(blogId);
  // find the login user
  const loginUserId = req?.user?._id;
  // find if the user has liked the blog
  const isDisLiked = blog?.isDisliked;
  // find if the user has disliked the blog
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

const uploadImages = asyncHandler(async (req, res) => {

  const { id } = req.params;
  validateMongoDBId(id);

  try{
    const uploader = (path) => cloudinaryUploadImg(path, 'images');
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const findBlog = await Blog.findByIdAndUpdate(id,
    {
      images: urls.map(file=>{return file;}),
    }, 
    {new:true}); 
    res.json(findBlog);
  }
  catch(error){
    console.log(error);
    throw new Error(error);
  }

   
});
 

// const createBlog = asyncHandler(async (req, res) => {
//   try {
//     const newBlog = new Blog.create(req.body);
//     res.json(newBlog);
//   } catch (error) {
//     throw new Error(error);
//   }
//   // const { title, description, body, author } = req.body;
//   // const blog = new Blog({
//   //   title,
//   //   description,
//   //   body,
//   //   author,
//   // });
//   // const createdBlog = await blog.save();
//   // res.status(201).json(createdBlog);
// }); 

module.exports = { createBlog , updateBlog,getAllBlogs, getBlog, deleteBlog, liketheBlog, disliketheBlog, uploadImages};