import express from 'express'
import { getUsers, getUserById, deleteUserById, createUser } from '../controllers/users.controller.js'

// Create a new router
const router = express.Router()

// Define the routes and the functions that will be executed when those routes are requested
// The functions are imported from the controller(s)
router.get('/', getUsers) // Will match GET /users
router.get('/:id', getUserById) // Will match GET /users/:id
router.delete('/:id', deleteUserById) // Will match DELETE /users/:id
router.post('/', createUser) // Will match POST /users

// Export the router to be used on the app
export default router