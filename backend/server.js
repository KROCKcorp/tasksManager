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

// Test database connection and sync models
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    // Sync all models (use { force: true } only in development to drop tables)
    await sequelize.sync({ alter: true }); // Alter tables to match models
  } catch (error) {
    console.error('Unable to connect to the database:', error);
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
