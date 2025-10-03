import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import redis from '../redisClient.js';
import asyncHandler from '../utils/asyncHandler.js'; 
import ApiError from '../errors/ApiError.js';
import httpStatus from '../errors/httpStatus.js';

const prisma = new PrismaClient();

/**
 * Handles new user registration.
 */
export const register = asyncHandler(async (req, res) => {
  const userSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { name, email, password } = userSchema.parse(req.body);
  const existingUser = await prisma.user.findUnique({ where: { email } });
  
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already in use.');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await prisma.user.create({ data: { name, email, password: hashedPassword } });

  res.status(httpStatus.CREATED).json({ id: newUser.id, name: newUser.name, email: newUser.email });
});

/**
 * Handles user login.
 */
export const login = asyncHandler(async (req, res) => {
  const loginSchema = z.object({ email: z.string().email(), password: z.string() });
  const { email, password } = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials.');
  }

  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = crypto.randomBytes(64).toString('hex');
  
  await redis.set(refreshToken, user.id, 'EX', 7 * 24 * 60 * 60);

  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.status(httpStatus.OK).json({ accessToken });
});

/**
 * Handles access token refresh.
 */
export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token not found.');
  }

  const userId = await redis.get(refreshToken);
  if (!userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid or expired refresh token.');
  }

  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  res.json({ accessToken });
});

/**
 * Handles user logout.
 */
export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    await redis.del(refreshToken);
  }
  res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
  res.status(httpStatus.OK).json({ message: 'Logout successful.' });
});