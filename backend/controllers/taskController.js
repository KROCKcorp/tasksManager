import pool from '../db.js';

const validStatuses = ['pending', 'in-progress', 'completed'];

export const getUserTasks = async (req, res, next) => {
  try {
    const [tasks] = await pool.query('SELECT * FROM tasks WHERE user_id = ?', [req.user.id]);
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
    await pool.query('INSERT INTO tasks (user_id, title, description, status) VALUES (?,?,?,?)', [
      req.user.id,
      title,
      description,
      status,
    ]);
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
    const [result] = await pool.query(
      'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
      [title, description, status, id, req.user.id]
    );

    if (result.affectedRows === 0) {
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
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id]);

    if (result.affectedRows === 0) {
      const error = new Error('Task not found');
      error.status = 400;
      return next(error);
    }

    res.json({ msg: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};
