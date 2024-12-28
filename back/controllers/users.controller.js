import { getAll, getById, deleteById, create, update, login } from '../services/users.service.js'

// A method on a controller will have at first parameter the current request and the second parameter the response object
// The response object will be used to send the response back to the client
// The request object will contain the data sent by the client
// The aim of the controller is to handle the request, call a service if needed and send back the response to the client
// The controller should not contain any business or database logic, it should only handle the request and response
// The business/database logic should be placed in the service

// To create a controller we just need to export functions that will be called by our router
// Be careful to not forget to export the functions, otherwise the router won't be able to call them
// You can't import a function having the same name as an exported function, use aliases, import the whole module or rename the functions

export const getUsers = async (req, res) => {
    // Calling the service function with the sortBy and sortDir parameters from the query string
    // The query string is an object containing all the parameters sent in the URL after the ? character
    // These values can be null or undefined if not provided
    const data = await getAll(req.query.sortBy, req.query.sortDir)
    res.json({
        success: true,
        data
    })
}

export const getUserById = async (req, res) => {
    // Calling the service function with the id parsed as an integer, the id is a path parameter from the URL, it's a string, declared in the router
    const user = await getById(parseInt(req.params.id))

    // If the user is not found, we will return a 404 status code
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }

    // Otherwise we will return the user object
    return res.json({
        success: true,
        data: user
    })
}

export const deleteUserById = async (req, res) => {
    const hasBeenDeleted = await deleteById(parseInt(req.params.id))
    if (!hasBeenDeleted) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }

    return res.json({
        success: true,
        message: 'User deleted'
    })
}

export const registerUser = async (req, res, next) => {
    // We will get the username and password from the request body
    const { username, password, firstName, lastName } = req.body
    let user

    // We will call the service function with the username and password
    try {
        user = await create(username, password, firstName, lastName)
    } catch (err) {
        return next(err)
    }

    // We will return the created user
    res.json({
        success: true,
        data: user
    })
}

export const updateUser = async (req, res, next) => {
    // We will get the username and password from the request body
    const { username, firstName, lastName, isAdmin } = req.body
    const userId = req.params.id

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required'
        })
    }

    let user

    // We will call the service function with the username and password
    try {
        user = await update(parseInt(userId), username, firstName, lastName, isAdmin)
    } catch (err) {
        return next(err)
    }

    // We will return the updated user
    res.json({
        success: true,
        data: user
    })
}

export const loginUser = async (req, res, next) => {
    const { username, password } = req.body
    let token

    try {
        token = await login(username, password)
    } catch (err) {
        return next(err)
    }

    // We will return a success message if the login was successful and the token
    res.json({
        success: true,
        message: 'Login successful',
        token: token
    })
}

export const getMyProfile = async (req, res, next) => {
    const user = await getById(parseInt(req.user.id))

    return res.json({
        success: true,
        data: user
    })
}
