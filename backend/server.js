import express from 'express';
import dotenv from 'dotenv';
import tasks from './routes/tasksRoutes.js';
import autRoutes from './routes/authRoutes.js';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasks);

app.use('/api/auth', autRoutes);

app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
