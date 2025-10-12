import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDatabase } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import applicationRoutes from './routes/applicationRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import logRoutes from './routes/logRoutes';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/logs', logRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

async function start() {
  try {
    await connectDatabase(process.env.MONGODB_URI as string || 'mongodb://127.0.0.1:27017/eduhireDB');
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;


