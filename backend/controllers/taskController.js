import { Task } from '../models/index.js';

const validStatuses = ['pending', 'in-progress', 'completed'];

export const getUserTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({ where: { user_id: req.user.id } });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  const { title, description, status } = req.body;
  if (!title) {
    const error = new Error('Title is required');
    error.status = 400;
    return next(error);
  }

  if (status && !validStatuses.includes(status)) {
    const error = new Error('Invalid task status value');
    error.status = 400;
    return next(error);
  }

  try {
    await Task.create({
      user_id: req.user.id,
      title,
      description,
      status: status || 'pending',
    });

    res.status(201).json({ msg: 'Task was added successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  const { title, description, status } = req.body;
  const { id } = req.params;

  if (!title) {
    const error = new Error('Title is required');
    error.status = 400;
    return next(error);
  }

  if (status && !validStatuses.includes(status)) {
    const error = new Error('Invalid status value');
    error.status(400);
    return next(error);
  }

  try {
    const [affectedRows] = await Task.update(
      { title, description, status },
      {
        where: {
          id,
          user_id: req.user.id,
        },
      }
    );

    if (affectedRows === 0) {
      const error = new Error('Task not found');
      error.status = 400;
      return next(error);
    }

    res.status(201).json({ msg: 'Task was updated' });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const affectedRows = await Task.destroy({ where: { id, user_id: req.user.id } });

    if (affectedRows === 0) {
      const error = new Error('Task not found');
      error.status = 400;
      return next(error);
    }

    res.json({ msg: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};
