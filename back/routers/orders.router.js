import express from 'express'
import { createNewOrder, getMyOrders, updateOrder, getAllOrders } from '../controllers/orders.controller.js'
import authMiddleware, { adminMiddleware } from '../middlewares/auth.js'

const router = express.Router()

router.post('/', authMiddleware, createNewOrder)
router.get('/my', authMiddleware, getMyOrders)
router.get('/', authMiddleware, adminMiddleware, getAllOrders)
router.patch('/:id/state', authMiddleware, adminMiddleware, updateOrder)

export default router 