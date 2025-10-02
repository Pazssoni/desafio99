import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
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
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export default swaggerDocs;