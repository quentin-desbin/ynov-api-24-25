import express from 'express'
import {
    getUsers,
    getUserById,
    deleteUserById,
    registerUser,
    loginUser,
    getMyProfile,
    updateUser
} from '../controllers/users.controller.js'
import authMiddleware, { adminMiddleware } from '../middlewares/auth.js'

// Create a new router
const router = express.Router()

// Define the routes and the functions that will be executed when those routes are requested
// The functions are imported from the controller(s)
router.get('/', authMiddleware, adminMiddleware, getUsers) // Will match GET /users
router.get('/me', authMiddleware, getMyProfile) // Will match GET /users/me
router.get('/:id', authMiddleware, adminMiddleware, getUserById) // Will match GET /users/:id
router.delete('/:id', authMiddleware, adminMiddleware, deleteUserById) // Will match DELETE /users/:id
router.put('/:id', authMiddleware, adminMiddleware, updateUser) // Will match PUT /users/:id
router.post('/register', registerUser) // Will match POST /users/register
router.post('/login', loginUser) // Will match POST /users/login

// Export the router to be used on the app
export default router
