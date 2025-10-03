// src/app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// Lembre-se de descomentar as linhas do Swagger depois, se quiser reativá-lo
// import swaggerUi from 'swagger-ui-express';
// import swaggerDocs from './config/swaggerConfig.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// CORREÇÃO: As rotas agora serão acessadas via /api/...
app.use('/api', routes);

app.use(errorHandler);

export default app;