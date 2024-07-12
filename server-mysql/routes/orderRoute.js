const express = require("express");
const router = express.Router();
const {
  createOrder,
  createOrderByCard,
  loadSessionId,
  createBulkOrder,
  getBulkOrders,
  updateBulkOrderById,
  getProductsByBulkId,
  getOrdersByUserId
} = require("../controllers/orderCtrl")
const {authMiddleware,isAdmin, isCashier} = require("../middlewares/authMiddleware");

router.post("/create",authMiddleware,createOrder);
router.post('/createbycard',authMiddleware, createOrderByCard )
router.get('/paymentStatus/:sessionId', loadSessionId)
router.post("/bulk",authMiddleware, createBulkOrder)
router.get("/bulk", authMiddleware,getBulkOrders)
router.put("/bulk/update-order/:bulk_id", authMiddleware,isAdmin,updateBulkOrderById)
router.get("/get-bulkorder-products/:bulk_id", authMiddleware,getProductsByBulkId)
router.get("/bulk/ordersByID", authMiddleware, getOrdersByUserId)
module.exports = router;
