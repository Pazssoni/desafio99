import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swaggerConfig.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'https://localhost'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', routes);

app.use(errorHandler);

export default app;