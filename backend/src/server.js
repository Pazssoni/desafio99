/**
 * @file Main server entry point for the application.
 */
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import crypto from 'crypto'; 
import redis from './redisClient.js'; 
import { protect } from './authMiddleware.js';

// --- Swagger Configuration ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'X99 Project API',
      version: '1.0.0',
      description: 'API documentation for the X99 development test project.',
    },
    servers: [{ url: 'http://localhost:3333' }],
    tags: [
      { name: 'Auth', description: 'Authentication related endpoints' },
      { name: 'Notes', description: 'Note management endpoints' },
      { name: 'Widgets', description: 'API-driven widget endpoints' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
                    password: { type: 'string', minLength: 8, example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'User registered successfully' },
            '400': { description: 'Invalid input or email already in use' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login a user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'test@example.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Login successful, returns accessToken and sets refreshToken cookie' },
            '401': { description: 'Invalid credentials' },
          },
        },
      },
      '/api/auth/refresh': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh the access token',
          description: 'Uses the httpOnly refreshToken cookie to generate a new accessToken.',
          responses: {
            '200': { description: 'Access token refreshed successfully' },
            '401': { description: 'Refresh token not found' },
            '403': { description: 'Invalid or expired refresh token' },
          },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout a user',
          description: 'Clears the httpOnly refreshToken cookie.',
          responses: {
            '200': { description: 'Logout successful' },
          },
        },
      },
      '/api/notes': {
        get: {
          tags: ['Notes'],
          summary: 'Get all notes for the authenticated user',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'A list of notes' },
            '401': { description: 'Unauthorized' },
          },
        },
        post: {
          tags: ['Notes'],
          summary: 'Create a new note',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', example: 'My First Note' },
                    content: { type: 'string', example: 'This is the content of my note.' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'Note created successfully' },
            '401': { description: 'Unauthorized' },
          },
        },
      },
      '/api/notes/{id}': {
        delete: {
          tags: ['Notes'],
          summary: 'Delete a specific note',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'The ID of the note to delete',
            },
          ],
          responses: {
            '204': { description: 'Note deleted successfully' },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Note not found or not authorized' },
          },
        },
      },
      '/api/widgets/weather': {
        get: {
          tags: ['Widgets'],
          summary: 'Get mock weather data',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'city', schema: { type: 'string' }, description: 'The city name (optional)' }
          ],
          responses: {
            '200': { description: 'Mock weather data' },
            '401': { description: 'Unauthorized' },
          },
        },
      },
      '/api/widgets/github': {
        get: {
          tags: ['Widgets'],
          summary: 'Get public repositories for a GitHub user',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'user', required: true, schema: { type: 'string' }, description: 'The GitHub username' }
          ],
          responses: {
            '200': { description: 'A list of public repositories' },
            '401': { description: 'Unauthorized' },
          },
        },
      },
      '/api/widgets/pokemon': {
        get: {
          tags: ['Widgets'],
          summary: 'Get a random Pokémon for the game',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Data for a random Pokémon' },
            '401': { description: 'Unauthorized' },
          },
        },
      },
    },
  },
  apis: [], 
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



app.post('/api/auth/register', async (req, res) => {
  try {
    const userSchema = z.object({ name: z.string().min(3), email: z.string().email(), password: z.string().min(8) });
    const { name, email, password } = userSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already in use.' });
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({ data: { name, email, password: hashedPassword } });
    return res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
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
});

app.post('/api/auth/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token not found.' });

  try {
   
    const userId = await redis.get(refreshToken);

    if (!userId) {
      return res.status(403).json({ message: 'Invalid or expired refresh token.' });
    }
    

    const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  } catch (error) {
    console.error('Refresh Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  
  if (refreshToken) {
    // Delete the token from Redis to invalidate the session
    await redis.del(refreshToken);
  }
  

  res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logout successful.' });
});
app.get('/api/notes', protect, async (req, res) => {
  try {
    const notes = await prisma.note.findMany({ where: { authorId: req.userId }, orderBy: { createdAt: 'desc' } });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes.' });
  }
});

app.post('/api/notes', protect, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content are required.' });
    const newNote = await prisma.note.create({ data: { title, content, authorId: req.userId } });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note.' });
  }
});

app.delete('/api/notes/:id', protect, async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note || note.authorId !== req.userId) return res.status(404).json({ message: 'Note not found or not authorized.' });
    await prisma.note.delete({ where: { id: noteId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note.' });
  }
});

app.get('/api/widgets/weather', protect, (req, res) => {
  const { city } = req.query;
  const mockWeather = { city: city || 'Lisbon', temperature: '19°C', condition: 'Partly Cloudy' };
  res.json(mockWeather);
});

app.get('/api/widgets/github', protect, async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) return res.status(400).json({ message: 'Parameter "user" is required.' });
    const response = await axios.get(`https://api.github.com/users/${user}/repos?sort=updated&per_page=5`);
    const repos = response.data.map(repo => ({ id: repo.id, name: repo.name, url: repo.html_url, stars: repo.stargazers_count }));
    res.json(repos);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: 'Error fetching GitHub repositories.' });
  }
});

app.get('/api/widgets/pokemon', protect, async (req, res) => {
  try {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const pokemonData = { name: response.data.name, image: response.data.sprites.other['official-artwork'].front_default };
    res.json(pokemonData);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: 'Error fetching Pokémon data.' });
  }
});

// --- SERVER INITIALIZATION ---
const PORT = 3333;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Docs available on http://localhost:${PORT}/api-docs`);
  });
}
export default app;