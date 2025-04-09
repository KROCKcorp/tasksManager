'use strict';

export async function up(queryInterface, Sequelize) {
  const tableExists = async (tableName) => {
    const tables = await queryInterface.showAllTables();
    return tables.includes(tableName);
  };

  if (!(await tableExists('users'))) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  }

  if (!(await tableExists('tasks'))) {
    await queryInterface.createTable('tasks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'in-progress', 'completed'),
        defaultValue: 'pending',
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  }

  await queryInterface.addConstraint('tasks', {
    fields: ['user_id'],
    type: 'foreign key',
    name: 'tasks_user_id_fk',
    references: {
      table: 'users',
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
}
export async function down(queryInterface) {
  // Drop tables in reverse order (tasks first due to FK constraint)
  await queryInterface.dropTable('tasks');
  await queryInterface.dropTable('users');
}
