import prisma from '../db.js'

export const createItem = async (name, price) => {
    return await prisma.items.create({
        data: {
            name,
            price
        }
    })
}

export const getAllItems = async () => {
    return await prisma.items.findMany()
}

export const updateItem = async (id, data) => {
    return await prisma.items.update({
        where: { id },
        data
    })
}

export const deleteItem = async (id) => {
    return await prisma.items.delete({
        where: { id }
    })
} 