import request from 'supertest';
import app from '../src/server.js';
import { PrismaClient } from '@prisma/client';
import redis from '../src/redisClient.js'; 

const prisma = new PrismaClient();

describe('Auth Endpoints', () => {
  const testUser = {
    name: 'Test User',
    email: 'test.user@example.com',
    password: 'password1234',
  };

  beforeAll(async () => {
    await prisma.note.deleteMany({});
    await prisma.user.deleteMany({});
    await request(app).post('/api/auth/register').send(testUser);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redis.disconnect();
  });

  describe('POST /api/auth/register', () => {
    const newUser = {
      name: 'New Register User',
      email: 'new.register@example.com',
      password: 'password1234',
    };
    
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.email).toBe(newUser.email);
    });

    it('should return 400 if email is already in use', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...newUser, email: testUser.email });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email already in use.');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user and return tokens', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.headers['set-cookie'][0]).toContain('refreshToken=');
    });

    it('should return 401 for incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('Protected Routes', () => {
    it('should return 401 when accessing a protected route without a token', async () => {
      const response = await request(app).get('/api/notes');
      expect(response.status).toBe(401);
    });

    it('should allow access to a protected route with a valid token', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });
      
      const token = loginRes.body.accessToken;

      const response = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });
});