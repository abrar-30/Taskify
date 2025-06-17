# Taskify Backend

Taskify is a project management tool that allows users to manage projects and tasks efficiently. This backend is built using Node.js, Express, and MongoDB, providing a RESTful API for user authentication, project management, and task management.

## Features

- **User Authentication**: Register and login functionality with role-based access control (admin and member).
- **Project Management**: Create, read, update, and delete projects. Each project can have multiple members.
- **Task Management**: Manage tasks within projects, including CRUD operations and status updates.
- **Role-Based Access Control**: Only project creators or admins can delete or assign tasks, and only assigned users can update their task status.

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- Passport for authentication
- dotenv for environment configuration

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd taskify-backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add the following environment variables:
   ```
   PORT=5001
   MONGO_URI=your_mongodb_connection_string

   # Admin User Credentials
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_secure_password
   ADMIN_USERNAME=admin
   ```

   You can copy from `.env.example` and modify the values as needed.

### Setting Up Admin User

Before running the application, create the admin user:
```
npm run seed:admin
```

This will create an admin user with the credentials specified in your `.env` file.

### Running the Application

To start the server, run:
```
npm start
```

For development with auto-restart:
```
npm run dev
```

The server will be running on the specified port.

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run seed:admin` - Create the admin user
- `npm run seed:sample` - Create sample data for testing

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login an existing user.

### Projects

- `POST /api/projects`: Create a new project.
- `GET /api/projects`: Get all projects.
- `GET /api/projects/:id`: Get a specific project by ID.
- `PUT /api/projects/:id`: Update a project by ID.
- `DELETE /api/projects/:id`: Delete a project by ID.

### Tasks

- `POST /api/tasks`: Create a new task.
- `GET /api/tasks`: Get all tasks.
- `GET /api/tasks/:id`: Get a specific task by ID.
- `PUT /api/tasks/:id`: Update a task by ID.
- `DELETE /api/tasks/:id`: Delete a task by ID.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.