import express from 'express';
import dotenv from 'dotenv';
import tasks from './routes/tasksRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import path from 'path';
import { sequelize } from './models/index.js';

dotenv.config({ path: path.resolve('./.env') });
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    if (process.env.NODE_ENV === 'development') {
      const { execSync } = require('child_process');
      execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
    }
  } catch (error) {
    console.error('Database error:', error);
  }
};

// Initialize database connection
initializeDatabase();

// Routes
app.use('/api/tasks', tasks);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
