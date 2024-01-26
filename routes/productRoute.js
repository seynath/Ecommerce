const express = require('express');
const router = express.Router();
const {createProduct, getProduct, getAllProducts,updateProduct, deleteProduct, addToWishlist, rating,uploadImages} = require('../controllers/productCtrl');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const {productImgResize,uploadPhoto} = require('../middlewares/uploadImage');

//mewye piliwela waradunath a kiyanne isAdmin ekata kalin auth magula aawath error ekak enawa 

router.post('/',authMiddleware,isAdmin, createProduct);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images",10),productImgResize,uploadImages);
router.get('/:id', getProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);
router.get('/', getAllProducts )
router.put('/:id',authMiddleware,isAdmin, updateProduct);
router.delete('/:id',authMiddleware,isAdmin, deleteProduct);


module.exports = router;
