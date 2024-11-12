import prisma from '../db.js'

/**
 * Returns all users, sorted by the provided field and direction
 * @param {string} sortBy - The field to sort by (optional)
 * @param {string} sortDirection - The direction to sort by (optional, default is 'ASC')
 * @returns {Array} - An array of users
 */
export const getAll = async (sortBy, sortDirection) => {
    // If the sortBy parameter is provided, we will sort the users array
    let options = {
        select: {
            id: true,
            username: true
        }
    };
    if (sortBy) {
        if (!sortDirection) sortDirection = 'asc'
        options.orderBy = {
            [sortBy]: sortDirection
        }
    }

    return await prisma.user.findMany(options)
}

/**
 * Returns a single user by its id
 * @param {number} id - The id of the user to get 
 * @returns {object} - The user object or null if not found
 */
export const getById = async (id) => {
    // Here we assume that the id provided is a number, our objects have a numeric id we can use triple equals. Refers to the controller to see how we parse the id from the request.
    return await prisma.user.findUnique({
        select: {
            id: true,
            username: true
        },
        where: {
            id
        }
    })
}

/**
 * Deletes a user by its id
 * @param {number} id 
 * @returns {boolean} - True if the user was deleted, false if not found
 */
export const deleteById = async (id) => {
    if (await getById(id)) {
        await prisma.user.delete({
            where: {
                id
            }
        })
        return true
    }
    return false
}

export const create = async (username, password) => {
    const user = await prisma.user.create({
        data: {
            username,
            password
        },
        select: {
            id: true,
            username: true
        }
    })

    return user
}