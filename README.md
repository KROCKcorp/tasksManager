# Task Manager (Full-Stack)

A full-stack task management application with Vue.js (Quasar) frontend and Node.js/Express backend.

## Features

- User authentication (login/register)
- Create, edit, view, and delete tasks.
- Task statuses (Pending/In Progress/Completed)
- Responsive Quasar UI

## Tech Stack

- **Frontend**: Vue 3 (Composition) + Quasar + Vite + Axios
- **Backend**: Node.js + Express + MySQL
- **Database**: MySQL 8.0

---
## Screenshots

### Login & Registeration:
![Login Page](https://github.com/KROCKcorp/tasksManager/blob/main/screenshots/Login.png)

![Register Page](https://github.com/KROCKcorp/tasksManager/blob/main/screenshots/Register.png)

### Tasks Operations:
![All Task](https://github.com/KROCKcorp/tasksManager/blob/main/screenshots/Tasks.png)

![View Task](https://github.com/KROCKcorp/tasksManager/blob/main/screenshots/ViewTask.png)

![Create New Task](https://github.com/KROCKcorp/tasksManager/blob/main/screenshots/CreateNewTask.png)

![Edit Task](https://github.com/KROCKcorp/tasksManager/blob/main/screenshots/EditTask.png)

---

# Setup Guide

## Prerequisites

- Node.js v18+
- MySQL 8.0+
- npm

## 1. Clone the Repository

```bash
git clone https://github.com/krockcorp/tasksManager.git
cd tasksManager
```

## 2. Database Setup

### Create Database and Tables

```bash
mysql -u root -p < sql/task_manager_schema.sql
```

### Configure Environment

Create `.env` in `backend/` (I provided a .env.example file in place of .env):

| Variable    | Description            |
| ----------- | ---------------------- |
| DB_HOST     | MySQL host             |
| DB_USER     | MySQL username         |
| DB_PASSWORD | MySQL password         |
| DB_NAME     | Database name          |
| JWT_SECRET  | Secret for auth tokens |
| PORT        | Server port            |

## 3. Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install

# Root Folder
npm install
```

## 4. Run the Application

### Option A: Run Both Together (Recommended)

From project root:

```bash
npm run start
```

### Option B: Run Separately

```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd ../frontend && npm run dev
```

## 5. Access the App

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)

---

# Project Structure

```
tasksManager/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── sql/
│   ├── task_manager_schema.sql
│   ├── db.js
│   ├── .env
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── router/
    │   ├── views/
    │   └── views/
    └── vite.config.js
```

---

# Troubleshooting

- **MySQL Connection Issues**:

  - Verify MySQL service is running
  - Check `.env` credentials match your MySQL setup
  - Run `mysql -u root -p` to test connection manually

- **Node.js Errors**:

  - Delete `node_modules` and re-run `npm install`
  - Ensure using Node.js v18+

---

# License

MIT
