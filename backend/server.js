import express from 'express';
import dotenv from 'dotenv';
import tasks from './routes/tasksRoutes.js';
import autRoutes from './routes/authRoutes.js';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import path from 'path';

dotenv.config({ path: path.resolve('backend', '.env') });
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasks);

app.use('/api/auth', autRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
