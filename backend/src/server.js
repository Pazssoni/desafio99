/**
 * @file Main server entry point for the application.
 * Configures the Express server, sets up middleware, and defines API routes.
 */
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import { protect } from './authMiddleware.js';

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const userSchema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(8),
    });
    const { name, email, password } = userSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    return res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const loginSchema = z.object({ email: z.string().email(), password: z.string() });
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/auth/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found.' });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired refresh token.' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logout successful.' });
});

// --- NOTES ROUTES (PROTECTED) ---
app.get('/api/notes', protect, async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { authorId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes.' });
  }
});

app.post('/api/notes', protect, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }
    const newNote = await prisma.note.create({
      data: { title, content, authorId: req.userId },
    });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note.' });
  }
});

app.delete('/api/notes/:id', protect, async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note || note.authorId !== req.userId) {
      return res.status(404).json({ message: 'Note not found or not authorized.' });
    }
    await prisma.note.delete({ where: { id: noteId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note.' });
  }
});

// --- WIDGET ROUTES (PROTECTED) ---
app.get('/api/widgets/weather', protect, (req, res) => {
  const { city } = req.query;
  const mockWeather = {
    city: city || 'Lisbon',
    temperature: '19°C',
    condition: 'Partly Cloudy',
  };
  res.json(mockWeather);
});

app.get('/api/widgets/github', protect, async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) {
      return res.status(400).json({ message: 'Parameter "user" is required.' });
    }
    const response = await axios.get(`https://api.github.com/users/${user}/repos?sort=updated&per_page=5`);
    const repos = response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      url: repo.html_url,
      stars: repo.stargazers_count,
    }));
    res.json(repos);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: 'Error fetching GitHub repositories.' });
  }
});

app.get('/api/widgets/pokemon', protect, async (req, res) => {
  try {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const pokemonData = {
      name: response.data.name,
      image: response.data.sprites.other['official-artwork'].front_default,
    };
    res.json(pokemonData);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: 'Error fetching Pokémon data.' });
  }
});

const PORT = 3333;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
export default app; // Exporta o app