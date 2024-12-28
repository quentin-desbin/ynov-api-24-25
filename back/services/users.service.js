import prisma from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
            username: true,
            firstName: true,
            lastName: true,
            isAdmin: true
        }
    }
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
            username: true,
            firstName: true,
            lastName: true,
            isAdmin: true
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

export const update = async (id, username, firstName, lastName, isAdmin) => {
    const count = await prisma.user.count({
        where: {
            username
        }
    })
    if (count > 1) throw new Error('Username already taken')

    return await prisma.user.update({
        where: {
            id
        },
        data: {
            username,
            firstName,
            lastName,
            isAdmin
        },
        select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            isAdmin: true
        }
    })
}

export const create = async (username, password, firstName, lastName) => {

    const count = await prisma.user.count({
        where: {
            username
        }
    })
    if (count > 0) throw new Error('Username already exists')

    const encryptedPassword = bcrypt.hashSync(password, parseInt(process.env.BCRYPT_SALT_ROUNDS))

    const user = await prisma.user.create({
        data: {
            username,
            password: encryptedPassword,
            firstName,
            lastName,
            isAdmin: false
        },
        select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            isAdmin: true
        }
    })

    return user
}

export const login = async (username, password) => {
    const user = await prisma.user.findFirst({
        where: {
            username
        }
    })

    if (!user) throw new Error('User not found')

    if (!bcrypt.compareSync(password, user.password)) throw new Error('Invalid password')

    // Generate a token here
    const token = jwt.sign({
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
    }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })

    return token
}
