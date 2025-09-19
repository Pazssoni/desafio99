import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { protect } from './authMiddleware.js';

const app = express();
const prisma = new PrismaClient();


app.use(cors()); 
app.use(express.json()); 
app.use(cookieParser());

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
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }


    const hashedPassword = await bcrypt.hash(password, 12);


    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });


    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });

  } catch (error) {
 
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });

    // Use a generic error message to prevent email enumeration attacks
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // User is validated, generate tokens
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' } // Short-lived
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' } // Long-lived
    );

    // Set refresh token in a secure, httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use 'true' in production with HTTPS
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ accessToken });

  } catch (error) {
    // Handle validation errors or other server errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

app.get('/api/notes', protect, async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { authorId: req.userId }, // req.userId is from the 'protect' middleware
      orderBy: { createdAt: 'desc' },
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar notas.' });
  }
});


app.post('/api/notes', protect, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Título e conteúdo são obrigatórios.' });
    }

    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        authorId: req.userId,
      },
    });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar nota.' });
  }
});


app.delete('/api/notes/:id', protect, async (req, res) => {
  try {
    const noteId = req.params.id;

    
    const note = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note || note.authorId !== req.userId) {
      return res.status(404).json({ message: 'Nota não encontrada ou não autorizada.' });
    }

    await prisma.note.delete({
      where: { id: noteId },
    });

    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar nota.' });
  }
});


const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});