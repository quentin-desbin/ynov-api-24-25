import prisma from '../db.js'

export const createOrder = async (userId, items) => {
    // Calculate total amount
    let totalAmount = 0
    for (const item of items) {
        const dbItem = await prisma.items.findUnique({
            where: { id: item.itemId }
        })
        if (!dbItem) throw new Error(`Item ${item.itemId} not found`)
        totalAmount += dbItem.price * item.amount
    }

    // Create order with items in a transaction
    return await prisma.$transaction(async (tx) => {
        const order = await tx.orders.create({
            data: {
                userId,
                amountPayed: totalAmount,
                items: {
                    create: items.map(item => ({
                        amount: item.amount,
                        item: {
                            connect: { id: item.itemId }
                        }
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        item: true
                    }
                }
            }
        })
        return order
    })
}

export const getUserOrders = async (userId) => {
    return await prisma.orders.findMany({
        where: {
            userId
        },
        include: {
            items: {
                include: {
                    item: true
                }
            }
        }
    })
}

export const updateOrderState = async (orderId, state) => {
    const validStates = ['PENDING', 'PAID', 'CANCELLED', 'DELIVERED']
    if (!validStates.includes(state)) {
        throw new Error('Invalid order state')
    }

    return await prisma.orders.update({
        where: { id: orderId },
        data: { state }
    })
}

export const getOrders = async () => {
    return await prisma.orders.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true
                }
            },
            items: {
                include: {
                    item: true
                }
            }
        }
    })
} 