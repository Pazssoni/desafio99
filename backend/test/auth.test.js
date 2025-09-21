import request from 'supertest';
import app from '../src/server.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Endpoints', () => {
  const testUser = {
    name: 'Test User',
    email: 'test.user@example.com',
    password: 'password1234',
  };

  // Runs before all tests in this file
  beforeAll(async () => {
    // Clean up database before starting
    await prisma.note.deleteMany({});
    await prisma.user.deleteMany({});

    // Create a user to be used in login tests
    await request(app).post('/api/auth/register').send(testUser);
  });

  // Runs after all tests in this file
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    // Note: The user from the first test is created in beforeAll.
    // We need a different user for the successful registration test here.
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
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(newUser.email);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 400 if email is already in use', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...newUser, email: testUser.email }); // Using an existing email

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
      // Checks if the httpOnly cookie for the refresh token was set
      expect(response.headers['set-cookie']).toBeDefined();
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
      expect(response.body.message).toBe('Invalid credentials.');
    });
  });

  describe('Protected Routes', () => {
    it('should return 401 when accessing a protected route without a token', async () => {
      const response = await request(app).get('/api/notes');
      expect(response.status).toBe(401);
    });

    it('should allow access to a protected route with a valid token', async () => {
      // First, log in to get a token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });
      
      const token = loginRes.body.accessToken;

      // Then, use the token to access the protected route
      const response = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${token}`); // Set the auth header

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array); // Expect an array of notes
    });
  });
});