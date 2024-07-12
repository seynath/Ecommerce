const express = require("express");
const {
 
  loginCashier,
  createOrderCashier,
  printBillCashier,
  getCashierSalesByCashierId,
  getBranches,
  getProductsBySalesId
  
  
} = require("../controllers/cashierCtrl");
//othanadi userCtrl.js ekee createuser kiyana func eke witrai aran thiyenne.
const router = express.Router();
const {authMiddleware,isAdmin, isCashier} = require("../middlewares/authMiddleware");


router.post("/sales/create", authMiddleware, createOrderCashier)
router.get("/print/bill/:salesOrderId", printBillCashier)
router.get("/branch/list",getBranches)

router.get("/cashier/sales",authMiddleware, getCashierSalesByCashierId)
router.get("/sales/products/:salesId",authMiddleware, getProductsBySalesId)



module.exports = router;
