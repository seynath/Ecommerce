const express = require('express')
const { getOrderChartData, getOrderChartData2, getDailySalesChart, getDailySalesGanemulla,getDailySalesGampaha } = require('../controllers/chartCtrl')
const router = express.Router()

router.get('/orderChart',getOrderChartData)
router.get('/dailyOrders',getOrderChartData2)
router.get("/sales", getDailySalesChart)
router.get("/sales/ganemulla", getDailySalesGanemulla)
router.get("/sales/gampaha", getDailySalesGampaha)



module.exports = router