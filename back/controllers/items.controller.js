import { createItem, getAllItems, updateItem, deleteItem } from '../services/items.service.js'

export const createNewItem = async (req, res, next) => {
    try {
        const { name, price } = req.body
        const item = await createItem(name, price)
        res.json({
            success: true,
            data: item
        })
    } catch (err) {
        next(err)
    }
}

export const getItems = async (req, res, next) => {
    try {
        const items = await getAllItems()
        res.json({
            success: true,
            data: items
        })
    } catch (err) {
        next(err)
    }
}

export const updateItemById = async (req, res, next) => {
    try {
        const { id } = req.params
        const item = await updateItem(parseInt(id), req.body)
        res.json({
            success: true,
            data: item
        })
    } catch (err) {
        next(err)
    }
}

export const deleteItemById = async (req, res, next) => {
    try {
        const { id } = req.params
        await deleteItem(parseInt(id))
        res.json({
            success: true,
            message: 'Item deleted'
        })
    } catch (err) {
        next(err)
    }
} 