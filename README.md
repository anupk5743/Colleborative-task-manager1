# Colleborative-task-manager1# 🚀 Collaborative Task Manager

A production-ready, full-stack Task Management application with real-time collaboration features, built with modern JavaScript/TypeScript technologies.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
# -collaborative-task-manager-

## Project

collaborative-task-manager

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── task/
│   │   │   │   ├── task.controller.ts
│   │   │   │   ├── task.dto.ts
│   │   │   │   ├── task.model.ts
│   │   │   │   ├── task.repository.ts
│   │   │   │   ├── task.routes.ts
│   │   │   │   └── task.service.ts
│   │   │   └── user/
│   │   │       └── user.model.ts
│   │   ├── sockets/
│   │   │   └── socket.ts            # Socket.io handlers
│   │   ├── app.ts                   # Express app setup
│   │   └── server.ts                # Server entry point
│   ├── .env.example
│   ├── jest.config.js
│   ├── tsconfig.json
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.ts             # Configured axios instance
    │   ├── components/
    │   │   ├── LoginForm.tsx
    │   │   ├── RegisterForm.tsx
    │   │   ├── TaskCard.tsx
    │   │   ├── TaskForm.tsx
    │   │   ├── TaskList.tsx
    │   │   ├── Navbar.tsx
    │   │   └── NotificationCenter.tsx
    │   ├── hooks/
    │   │   └── useSocket.ts         # Socket.io custom hook
    │   ├── pages/
    │   │   ├── Auth.tsx
    │   │   └── Dashboard.tsx
    │   ├── types/
    │   │   └── index.ts             # TypeScript types
    │   ├── utils/
    │   │   └── helpers.ts           # Utility functions
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── .env.example
    ├── vite.config.ts
    ├── tailwind.config.js
    └── package.json
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB 4.0+
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/collaborative-task-manager
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

   The backend will start at `http://localhost:5000`

7. **Run tests**
   ```bash
   npm test
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   VITE_SOCKET_URL=http://localhost:5000
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

   The frontend will start at `http://localhost:5173`

6. **Build for production**
   ```bash
   npm run build
   ```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/v1/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "User registered successfully"
}
```

#### POST `/api/v1/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "Login successful"
}
```

#### POST `/api/v1/auth/logout`
Logout the current user (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### GET `/api/v1/auth/me`
Get current user profile (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### PUT `/api/v1/auth/profile`
Update user profile (requires authentication).

**Request Body:**
```json
{
  "name": "Jane Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "name": "Jane Doe",
    "email": "john@example.com"
  },
  "message": "Profile updated successfully"
}
```

### Task Endpoints

All task endpoints require authentication (JWT token in HttpOnly cookie).

#### POST `/api/v1/tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "dueDate": "2025-12-31T18:00:00Z",
  "priority": "High",
  "status": "To Do",
  "assignedToId": "user456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "task123",
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API docs",
    "dueDate": "2025-12-31T18:00:00Z",
    "priority": "High",
    "status": "To Do",
    "creatorId": "user123",
    "assignedToId": "user456",
    "createdAt": "2025-12-17T10:00:00Z",
    "updatedAt": "2025-12-17T10:00:00Z"
  },
  "message": "Task created successfully"
}
```

#### GET `/api/v1/tasks`
Get all user tasks (created or assigned) with optional filtering.

**Query Parameters:**
- `status` - Filter by status (To Do, In Progress, Review, Completed)
- `priority` - Filter by priority (Low, Medium, High, Urgent)
- `sortBy` - Sort field (dueDate, createdAt, priority)
- `order` - Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "task123",
      "title": "Task 1",
      "description": "Description",
      "dueDate": "2025-12-31T18:00:00Z",
      "priority": "High",
      "status": "To Do",
      "creatorId": "user123",
      "assignedToId": "user456",
      "createdAt": "2025-12-17T10:00:00Z",
      "updatedAt": "2025-12-17T10:00:00Z"
    }
  ]
}
```

#### GET `/api/v1/tasks/created/me`
Get tasks created by the current user.

#### GET `/api/v1/tasks/assigned/me`
Get tasks assigned to the current user.

#### GET `/api/v1/tasks/overdue/me`
Get overdue tasks for the current user.

#### GET `/api/v1/tasks/:id`
Get a specific task by ID.

#### PUT `/api/v1/tasks/:id`
Update a task (creator only).

**Request Body:**
```json
{
  "title": "Updated title",
  "status": "In Progress",
  "priority": "Medium"
}
```

#### DELETE `/api/v1/tasks/:id`
Delete a task (creator only).

### Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [...]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "No authentication token provided"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Only task creator can update this task"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Task not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## 🏗 Architecture Overview

### Design Patterns

#### 1. **Service/Repository Pattern (Backend)**
```
Route Handler → Controller → Service → Repository → Database
```

- **Route Handler**: Express route definitions
- **Controller**: HTTP request/response handling
- **Service**: Business logic and validation
- **Repository**: Data access layer abstraction
- **Database**: MongoDB with Mongoose ODM

**Benefits:**
- Clear separation of concerns
- Easy testing with dependency injection
- Reusable business logic
- Database agnostic repositories

#### 2. **Data Transfer Objects (DTOs)**
All API inputs are validated using Zod schemas defined in DTO files:
- Request validation happens at the controller level
- Strong typing throughout the application
- Consistent error responses

Example:
```typescript
export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(100),
  dueDate: z.string().datetime(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  // ...
});
```

#### 3. **Authentication Flow**

1. User registers with email/password
2. Password hashed with bcrypt (10 salt rounds)
3. JWT token generated and sent as HttpOnly cookie
4. Frontend includes cookie automatically in requests
5. Middleware verifies token on protected routes
6. User ID extracted and attached to request object

**Security Features:**
- HttpOnly cookies prevent XSS attacks
- Secure flag in production (HTTPS only)
- SameSite=Strict prevents CSRF attacks
- JWT expiry set to 7 days
- Passwords never returned in responses

### Database Schema

#### Users Collection
```typescript
{
  _id: ObjectId,
  name: String (required, max 50 chars),
  email: String (required, unique, lowercase),
  password: String (hashed with bcrypt),
  createdAt: Date,
  updatedAt: Date
}
```

#### Tasks Collection
```typescript
{
  _id: ObjectId,
  title: String (required, max 100 chars),
  description: String (required),
  dueDate: Date (required, must be future),
  priority: Enum["Low", "Medium", "High", "Urgent"],
  status: Enum["To Do", "In Progress", "Review", "Completed"],
  creatorId: ObjectId (ref: User, required),
  assignedToId: ObjectId (ref: User, optional),
  createdAt: Date,
  updatedAt: Date,
  // Indexes for performance
  // - creatorId
  // - assignedToId
  // - status
  // - dueDate
}
```

### Frontend Architecture

#### State Management
- **React Query**: Server state (data fetching, caching, synchronization)
- **React Hooks**: Component local state
- **Context** (potential): Global app state

#### Real-Time Updates
- Socket.io for WebSocket connections
- Custom `useSocket` hook for easy event subscription
- Event types:
  - `task:statusChanged` - Task status update
  - `task:priorityChanged` - Priority update
  - `task:assigned` - Task assignment
  - `task:created` - New task creation
  - `task:deleted` - Task deletion
  - `notification:taskAssigned` - User notification

## 🔄 Real-Time Features

### Socket.io Integration

**Backend (`src/sockets/socket.ts`):**
- Authenticates WebSocket connections using JWT
- Maintains online user tracking
- Broadcasts task updates to all clients
- Sends targeted notifications to assigned users

**Frontend (`src/hooks/useSocket.ts`):**
- Establishes authenticated connection
- Provides event subscription/unsubscription
- Emits events from UI
- Manages connection state and errors

### Event Flow Example - Task Assignment

1. **User Action**: Creator assigns task to User B
2. **Frontend**: Emits `task:assigned` event via Socket.io
3. **Backend**: 
   - Broadcasts to all clients: `task:assigned` event
   - Sends targeted notification to User B
4. **User B's Frontend**: 
   - Receives `notification:taskAssigned`
   - Displays toast notification
   - Updates task list via React Query
5. **Other Clients**: Update their task lists

### Real-Time Sync Benefits
- Instant feedback on actions
- No page refresh needed
- Collaborative experience
- Notifications for important updates
- Optimistic updates in frontend

## 🧪 Testing

### Backend Unit Tests

Located in `src/__tests__/`:

#### Auth Service Tests (`auth.service.test.ts`)
- ✅ Test 1: Successful user registration
- ✅ Test 2: Registration with existing email
- ✅ Test 3: Login with valid credentials
- ✅ Test 4: Login with invalid email
- ✅ Test 5: Login with invalid password
- ✅ Test 6: Token verification with valid token
- ✅ Test 7: Invalid or expired token
- ✅ Test 8: Get user profile
- ✅ Test 9: Get non-existent user

#### Task Service Tests (`task.service.test.ts`)
- ✅ Test 1: Successful task creation
- ✅ Test 2: Task creation with past due date
- ✅ Test 3: Task access control (creator only)
- ✅ Test 4: Get task with valid access
- ✅ Test 5: Get non-existent task
- ✅ Test 6: Access denied to task
- ✅ Test 7: Get user tasks with filtering
- ✅ Test 8: Delete task as creator
- ✅ Test 9: Delete task as non-creator
- ✅ Test 10: Get overdue tasks

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test auth.service.test.ts

# Watch mode
npm test -- --watch
```

### Test Framework: Jest
- Unit test framework for Node.js
- Mock support for dependencies
- Coverage reporting
- Fast and reliable

## 📦 Building for Production

### Backend Build

```bash
cd backend
npm run build
npm run start
```

Produces `dist/` folder with compiled JavaScript.

### Frontend Build

```bash
cd frontend
npm run build
```

Produces `dist/` folder optimized for production.

### Environment Variables

**Backend (.env):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/db
JWT_SECRET=your-production-secret-key
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

**Frontend (.env):**
```env
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_SOCKET_URL=https://api.yourdomain.com
```

## 🐳 Docker Setup (Optional)

### Dockerfile for Backend

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: collaborative-task-manager

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      MONGO_URI: mongodb://mongodb:27017/collaborative-task-manager
      JWT_SECRET: dev-secret

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

Run with: `docker-compose up`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Design Decisions

### Why MongoDB?
- **Flexibility**: Schema-less design allows easy iterations
- **Scalability**: Horizontal scaling with sharding
- **Performance**: Fast for read-heavy operations
- **Developer Experience**: JSON-like documents match JavaScript objects

### Why JWT + HttpOnly Cookies?
- **JWT**: Stateless authentication, scalable
- **HttpOnly Cookies**: Secure against XSS attacks, automatic inclusion in requests
- **Combined**: Best security without sacrificing user experience

### Why Zod for Validation?
- **TypeScript Native**: Type inference from schemas
- **Runtime Safety**: Validates at runtime, not just compile time
- **Developer Experience**: Clear error messages
- **Composable**: Easy to build complex validations

### Why React Query?
- **Caching**: Automatic request deduplication and caching
- **Synchronization**: Background refetching keeps data fresh
- **Mutations**: Built-in mutation handling with optimistic updates
- **DevTools**: Amazing debugging experience

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongod`
- Verify port 5000 is available
- Check `.env` file is correctly configured

### Frontend can't connect to API
- Verify backend is running on http://localhost:5000
- Check VITE_API_URL in `.env`
- Check browser console for CORS errors

### Socket.io connection fails
- Verify JWT token is being sent
- Check VITE_SOCKET_URL in `.env`
- Check network tab in DevTools

## 📞 Support

For issues and questions, please open an issue on GitHub.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using React, Node.js, MongoDB, and Socket.io**
