import express from 'express'
import cors from 'cors'
import usersRouter from './routers/users.router.js'

// Initialize express
const app = express()

// Use default middlewares
app.use(cors()) // Cors is a middleware that allows/disallows access to the API
app.use(express.json()) // Parse incoming requests with JSON payloads

// API routers
app.use('/users', usersRouter) // When a request is made to /users, the usersRouter will handle it

// Export the app to be used in the server
export default app