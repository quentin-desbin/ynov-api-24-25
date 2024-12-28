import express from 'express'
import { createNewItem, getItems, updateItemById, deleteItemById } from '../controllers/items.controller.js'
import authMiddleware, { adminMiddleware } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', getItems)
router.post('/', authMiddleware, adminMiddleware, createNewItem)
router.patch('/:id', authMiddleware, adminMiddleware, updateItemById)
router.delete('/:id', authMiddleware, adminMiddleware, deleteItemById)

export default router 