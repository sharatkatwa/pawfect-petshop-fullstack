const express =  require('express')
const { authMiddleware } = require('../controllers/authController')
const { createOrder, cancelOrder, getMyOrders, getSingleOrder } = require('../controllers/orderController')

const router = express.Router()

router.post('/',authMiddleware, createOrder)
router.post('/cancel',authMiddleware, cancelOrder)
router.get('/my-order',authMiddleware,getMyOrders)
router.get('/:id',authMiddleware,getSingleOrder)