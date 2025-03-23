import { Router } from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { getUserTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';

const router = Router();

//Get all the logged in user tasks
router.get('/', authenticateUser, getUserTasks);

//Create new task
router.post('/', authenticateUser, createTask);

//Update task
router.put('/:id', authenticateUser, updateTask);

//Delete task
router.delete('/:id', authenticateUser, deleteTask);

export default router;
