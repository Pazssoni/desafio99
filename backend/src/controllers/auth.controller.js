import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import redis from '../redisClient.js';

const prisma = new PrismaClient();

/**
 * Handles new user registration.
 */
export const register = async (req, res) => {
    try {
        const userSchema = z.object({
            name: z.string().min(3),
            email: z.string().email(),
            password: z.string().min(8),
        });
        const { name, email, password } = userSchema.parse(req.body);
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email already in use.' });

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await prisma.user.create({ data: { name, email, password: hashedPassword } });

        return res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
        console.error('Register Error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Handles user login.
 */
export const login = async (req, res) => {
    try {
        const loginSchema = z.object({ email: z.string().email(), password: z.string() });
        const { email, password } = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials.' });

        const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = crypto.randomBytes(64).toString('hex');

        await redis.set(refreshToken, user.id, 'EX', 7 * 24 * 60 * 60);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ accessToken });
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Handles access token refresh.
 */
export const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token not found.' });

    try {
        const userId = await redis.get(refreshToken);
        if (!userId) return res.status(403).json({ message: 'Invalid or expired refresh token.' });

        const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
    } catch (error) {
        console.error('Refresh Error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Handles user logout.
 */
export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        await redis.del(refreshToken);
    }
    res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logout successful.' });
};