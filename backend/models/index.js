import sequelize from '../config/database.js';
import User from './User.js';
import Task from './Task.js';

User.hasMany(Task, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'user_id' });

export { sequelize, User, Task };
