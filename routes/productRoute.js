const express = require('express');
const router = express.Router();
const {createProduct, getProduct, getAllProducts,updateProduct, deleteProduct} = require('../controllers/productCtrl');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');

//mewye piliwela waradunath a kiyanne isAdmin ekata kalin auth magula aawath error ekak enawa 

router.post('/',authMiddleware,isAdmin, createProduct);
router.get('/:id', getProduct);
router.get('/', getAllProducts )
router.put('/:id',authMiddleware,isAdmin, updateProduct);
router.delete('/:id',authMiddleware,isAdmin, deleteProduct);


module.exports = router;
