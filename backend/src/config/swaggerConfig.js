import swaggerJsdoc from 'swagger-jsdoc';
import swaggerDefinition from '../docs/swaggerDef.js';

const swaggerOptions = {
  swaggerDefinition,
  apis: [], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export default swaggerDocs;