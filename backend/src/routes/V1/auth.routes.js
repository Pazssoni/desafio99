import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/auth.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 * name: Auth
 * description: Authentication related endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 * post:
 * summary: Register a new user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [name, email, password]
 * properties:
 * name: { type: string, example: 'John Doe' }
 * email: { type: string, format: email, example: 'john.doe@example.com' }
 * password: { type: string, minLength: 8, example: 'password123' }
 * responses:
 * '201': { description: 'User registered successfully' }
 * '400': { description: 'Invalid input or email already in use' }
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Login a user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [email, password]
 * properties:
 * email: { type: string, format: email, example: 'test@example.com' }
 * password: { type: string, example: 'password123' }
 * responses:
 * '200': { description: 'Login successful' }
 * '401': { description: 'Invalid credentials' }
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/refresh:
 * post:
 * summary: Refresh the access token
 * tags: [Auth]
 * responses:
 * '200': { description: 'Access token refreshed' }
 * '401': { description: 'Refresh token not found' }
 */
router.post('/refresh', refresh);

/**
 * @swagger
 * /api/auth/logout:
 * post:
 * summary: Logout a user
 * tags: [Auth]
 * responses:
 * '200': { description: 'Logout successful' }
 */
router.post('/logout', logout);

export default router;