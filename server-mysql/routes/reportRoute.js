const express = require("express");
const {salesReport, inventoryReport} = require('../controllers/reportCtrl')
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/sales-report", salesReport);
router.get('/inventory-report',inventoryReport)
// router.put("/:id", authMiddleware, isAdmin, updateEnquiry);

module.exports = router;
