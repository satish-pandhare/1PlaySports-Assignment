# Task Manager Application

A full-stack task management application built with React, Node.js/Express, and PostgreSQL.

## Features

- **User Authentication**: Register and login with JWT-based authentication
- **Task Management**: Create, view, update, and delete personal tasks
- **Status Tracking**: Track tasks as To Do, In Progress, or Done
- **Due Dates**: Optional due date with overdue highlighting
- **Filtering**: Filter tasks by status
- **Pagination**: Server-side pagination support
- **Optimistic Updates**: Instant UI feedback on status changes

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT (JSON Web Tokens)

## Project Structure

```
task-manager/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskFilter.jsx
│   │   │   └── DeleteConfirmModal.jsx
│   │   ├── context/         # React context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── TaskContext.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── services/        # API service layer
│   │   │   └── api.js
│   │   └── App.jsx          # Root component
│   └── vite.config.js       # Vite config with proxy
│
├── server/                  # Express backend
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── middleware/      # Express middleware
│   │   │   ├── auth.js      # JWT verification
│   │   │   ├── validate.js  # Request validation
│   │   │   └── errorHandler.js
│   │   ├── routes/          # Route definitions
│   │   │   ├── auth.js
│   │   │   └── tasks.js
│   │   ├── services/        # Shared services
│   │   │   └── db.js        # Prisma client
│   │   └── index.js         # Express app entry
│   └── prisma/
│       └── schema.prisma    # Database schema
│
├── docker-compose.yml       # PostgreSQL container
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL) or a PostgreSQL instance
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd task-manager

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Set Up Database

```bash
# Start PostgreSQL with Docker
docker compose up -d

# Or use your own PostgreSQL instance and update DATABASE_URL in .env
```

### 3. Configure Environment

```bash
# In the server directory, create .env from example
cd server
cp .env.example .env

# Update values if needed:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public"
# JWT_SECRET="your-secret-key"
# PORT=3001
```

### 4. Run Database Migrations

```bash
cd server
npm run db:migrate
```

### 5. Start the Application

```bash
# Terminal 1: Start the backend
cd server
npm run dev

# Terminal 2: Start the frontend
cd client
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Endpoints

### Authentication

| Method | Route          | Description              |
| ------ | -------------- | ------------------------ |
| POST   | /auth/register | Register a new user      |
| POST   | /auth/login    | Login and get JWT token  |
| GET    | /auth/profile  | Get current user profile |

### Tasks (Protected - requires JWT)

| Method | Route      | Description                                     |
| ------ | ---------- | ----------------------------------------------- |
| GET    | /tasks     | Get all tasks (supports filtering & pagination) |
| GET    | /tasks/:id | Get a single task by ID                         |
| POST   | /tasks     | Create a new task                               |
| PATCH  | /tasks/:id | Update task fields                              |
| DELETE | /tasks/:id | Delete a task                                   |

### Query Parameters

- `?status=todo|in-progress|done` - Filter by status
- `?page=1&limit=10` - Pagination

## Database Schema

The application uses two models:

**User**

- `id` - UUID primary key
- `email` - Unique email address
- `password` - Bcrypt hashed password
- `name` - User's display name
- `createdAt`, `updatedAt` - Timestamps

**Task**

- `id` - UUID primary key
- `title` - Task title (required)
- `description` - Optional description
- `status` - Enum: TODO, IN_PROGRESS, DONE
- `dueDate` - Optional due date
- `userId` - Foreign key to User
- `createdAt`, `updatedAt` - Timestamps

## Assumptions & Trade-offs

1. **Simple JWT Auth**: Uses basic JWT without refresh tokens for simplicity. In production, would add refresh token rotation.

2. **No Email Verification**: Users can register without email verification. Would add in production.

3. **Client-side Filtering**: Filter UI works client-side on current page. For large datasets, would implement full server-side filtering.

4. **No Real-time Updates**: Tasks don't sync across tabs/devices. Would add WebSocket support for real-time collaboration.

5. **Basic Validation**: Server-side validation covers required fields and types. Would add more comprehensive validation in production.

## What I Would Improve With More Time

- **Testing**: Add unit tests for API and integration tests for frontend
- **Refresh Tokens**: Implement proper token refresh flow
- **Task Categories/Tags**: Allow organizing tasks with labels
- **Due Date Reminders**: Email or push notifications for upcoming tasks
- **Drag-and-Drop**: Reorder tasks or change status via drag-and-drop
- **Dark Mode**: Add theme toggle support
- **Task Editing**: Full edit form for existing tasks (currently only status can be changed)
- **Search**: Full-text search across task titles and descriptions
- **Bulk Actions**: Select multiple tasks for bulk delete/status update

## License

MIT
# 1PlaySports-Assignment
