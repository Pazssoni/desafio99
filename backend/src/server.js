import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
const prisma = new PrismaClient();


app.use(cors()); 
app.use(express.json()); 
app.use(cookieParser());

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


const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});