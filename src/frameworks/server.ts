import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initializeDatabase } from '../infrastructure/database';
import { config } from '../config/index';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true // Allow cookies to be sent cross-origin
}));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'College Event Management API is running' });
});

import { routes } from './routes';
import { errorMiddleware } from './middleware';

app.use('/api', routes);

app.use(errorMiddleware);

const startServer = async () => {
  await initializeDatabase();
  
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};

startServer();
