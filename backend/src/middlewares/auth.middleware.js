/**
 * @file JWT authentication middleware for Express.
 */
import jwt from 'jsonwebtoken';

/**
 * Middleware to validate JWT and protect routes.
 * It checks for a 'Bearer' token in the Authorization header.
 * If the token is valid, it attaches the userId to the request object.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      req.userId = decoded.userId;

      next();
    } catch (error) {
      res.status(401).json({ message: 'Token is not valid or has expired.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token found.' });
  }
};