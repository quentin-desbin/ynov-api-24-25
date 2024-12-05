import express from 'express'
import { getUsers, getUserById, deleteUserById, registerUser, loginUser } from '../controllers/users.controller.js'
import authMiddleware from '../middlewares/auth.js'

// Create a new router
const router = express.Router()

// Define the routes and the functions that will be executed when those routes are requested
// The functions are imported from the controller(s)
router.get('/', authMiddleware, getUsers) // Will match GET /users
router.get('/:id', getUserById) // Will match GET /users/:id
router.delete('/:id', deleteUserById) // Will match DELETE /users/:id
router.post('/register', registerUser) // Will match POST /users/register
router.post('/login', loginUser) // Will match POST /users/login

// Export the router to be used on the app
export default router