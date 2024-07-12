const express = require('express');
const router = express.Router();
const {createProduct, getProduct,getProductCashier, getAllProducts,updateProduct, deleteProduct, addToWishlist, rating, getRating, getSales} = require('../controllers/productCtrl');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const {productImgResize,uploadPhoto} = require('../middlewares/uploadImage');

//mewye piliwela waradunath a kiyanne isAdmin ekata kalin auth aawath error ekak enawa 

router.post('/', authMiddleware, isAdmin, uploadPhoto.array("images", 10), productImgResize, createProduct);
// router.post('/', authMiddleware, isAdmin, createProduct);
// router.post('/',authMiddleware, isAdmin, createProduct);
// router.put("/upload", authMiddleware, isAdmin, uploadPhoto.array("images",10),productImgResize,uploadImages);
router.get("/sales-admin", getSales) 
router.get('/:id', getProduct);
router.get("/cashier/:barcode", getProductCashier)

router.put("/wishlist", authMiddleware, addToWishlist);
router.post("/rating", authMiddleware, rating);
router.get('/rating/:id',getRating) ;
router.get('/', getAllProducts );
router.put('/:productId',authMiddleware,isAdmin, uploadPhoto.array("images", 10), productImgResize, updateProduct);
router.delete('/:productId',authMiddleware,isAdmin, deleteProduct);
router.delete('/delete-img/:id',authMiddleware,isAdmin);

module.exports = router;