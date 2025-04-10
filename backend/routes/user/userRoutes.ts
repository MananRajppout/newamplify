import express from 'express'
import {
  createAccount,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  editUser,
  deleteUser,
  findUserById,
} from '../../controllers/user.controller'
import { catchError } from '../../middlewares/catchError.middleware'

const router = express.Router()

// POST /api/v1/users/register - Register a new user
router.post('/register', catchError(createAccount))
// POST /api/v1/users/login - login a user
router.post('/login', catchError(loginUser))
// POST /api/v1/auth/forgot-password
router.post('/forgot-password', catchError(forgotPassword))

// POST /api/v1/auth/reset-password
router.post('/reset-password', catchError(resetPassword))

// GET /api/v1/auth/verify-email
router.get('/verify-email', catchError(verifyEmail))

// GET /api/v1/auth/find-by-id
router.get('/find-by-id', catchError(findUserById))

// POST /api/v1/auth/change-password
router.post('/change-password', catchError(changePassword))

// PUT /api/v1/auth/edit/:id
router.put('/edit/:id', catchError(editUser))

// DELETE /api/v1/auth/:id
router.delete('/:id', catchError(deleteUser))
// ! Delete route will be implemented after creating project
// ! Find all and find by id route need to be implemented for the amplify admin

export default router
