import { getAll, getById, deleteById } from '../services/users.service.js'

// A method on a controller will have at first parameter the current request and the second parameter the response object
// The response object will be used to send the response back to the client
// The request object will contain the data sent by the client
// The aim of the controller is to handle the request, call a service if needed and send back the response to the client
// The controller should not contain any business or database logic, it should only handle the request and response
// The business/database logic should be placed in the service

// To create a controller we just need to export functions that will be called by our router
// Be careful to not forget to export the functions, otherwise the router won't be able to call them
// You can't import a function having the same name as an exported function, use aliases, import the whole module or rename the functions

export const getUsers = (req, res) => {
    // Calling the service function with the sortBy and sortDir parameters from the query string
    // The query string is an object containing all the parameters sent in the URL after the ? character
    // These values can be null or undefined if not provided
    const data = getAll(req.query.sortBy, req.query.sortDir)
    res.json({
        success: true,
        data
    })
}

export const getUserById = (req, res) => {
    // Calling the service function with the id parsed as an integer, the id is a path parameter from the URL, it's a string, declared in the router
    const user = getById(parseInt(req.params.id))

    // If the user is not found, we will return a 404 status code
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }

    // Otherwise we will return the user object
    return res.json(user)
}

export const deleteUserById = (req, res) => {
    const hasBeenDeleted = deleteById(parseInt(req.params.id))
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