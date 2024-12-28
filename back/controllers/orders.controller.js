import { createOrder, getUserOrders, updateOrderState, getOrders } from '../services/orders.service.js'

export const createNewOrder = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { items } = req.body
        const order = await createOrder(userId, items)
        res.json({
            success: true,
            data: order
        })
    } catch (err) {
        next(err)
    }
}

export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await getUserOrders(req.user.id)
        res.json({
            success: true,
            data: orders
        })
    } catch (err) {
        next(err)
    }
}

export const updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params
        const { state } = req.body
        const order = await updateOrderState(parseInt(id), state)
        res.json({
            success: true,
            data: order
        })
    } catch (err) {
        next(err)
    }
}

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await getOrders()
        res.json({
            success: true,
            data: orders
        })
    } catch (err) {
        next(err)
    }
} 