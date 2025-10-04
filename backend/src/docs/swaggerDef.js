const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Kortex API',
    version: '1.0.0',
    description: 'API documentation for the Kortex project.',
  },
  servers: [{ url: 'http://localhost:3333' }],
  tags: [
    { name: 'Auth', description: 'Authentication related endpoints' },
    { name: 'Notes', description: 'Note management endpoints' },
    { name: 'Widgets', description: 'API-driven widget endpoints' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    // Auth Routes
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
          '200': { description: 'Login successful' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh the access token',
        responses: {
          '200': { description: 'Access token refreshed' },
          '401': { description: 'Refresh token not found' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout a user',
        responses: {
          '200': { description: 'Logout successful' },
        },
      },
    },
    // Notes Routes
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
        parameters: [{
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string' },
          description: 'The ID of the note to delete',
        }],
        responses: {
          '204': { description: 'Note deleted successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Note not found' },
        },
      },
    },
    // Widgets Routes
    '/api/widgets/github': {
      get: {
        tags: ['Widgets'],
        summary: 'Get public repositories for a GitHub user',
        security: [{ bearerAuth: [] }],
        parameters: [{
          in: 'query',
          name: 'user',
          required: true,
          schema: { type: 'string' },
          description: 'The GitHub username',
        }],
        responses: {
          '200': { description: 'A list of public repositories' },
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
        },
      },
    },
    '/api/widgets/weather': {
      get: {
        tags: ['Widgets'],
        summary: 'Get mock weather data',
        security: [{ bearerAuth: [] }],
        parameters: [{
          in: 'query',
          name: 'city',
          schema: { type: 'string' },
          description: 'The city name (optional)',
        }],
        responses: {
          '200': { description: 'Mock weather data' },
        },
      },
    },
  },
};

export default swaggerDefinition;