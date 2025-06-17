# Taskify - Project Management Application

A full-stack project management application built with React, Node.js, Express, and MongoDB. Taskify allows teams to manage projects, assign tasks, and track progress with role-based access control.

## 🚀 Features

### Core Functionality
- **Project Management**: Create, edit, delete, and view projects
- **Task Management**: Create, assign, update, and track tasks
- **User Management**: User registration, authentication, and profile management
- **Role-Based Access**: Admin and member roles with different permissions
- **Dashboard**: Overview of projects, tasks, and statistics

### Advanced Features
- **Project Members**: Add/remove team members from projects
- **Task Assignment**: Assign tasks to project members only
- **Status Tracking**: Track task progress (pending, in-progress, completed)
- **Priority Levels**: Set task priorities (low, medium, high)
- **Due Dates**: Set and track task deadlines
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hook Form** for form handling
- **React Hot Toast** for notifications
- **Axios** for API calls
- **date-fns** for date formatting

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Passport.js** for authentication
- **Express Session** for session management
- **bcrypt** for password hashing
- **CORS** for cross-origin requests
- **dotenv** for environment variables

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Clone Repository
```bash
git clone https://github.com/yourusername/taskify.git
cd taskify
```

### Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and admin credentials

# Create admin user
npm run seed:admin

# Start development server
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string

# Admin User Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
ADMIN_USERNAME=admin
```

### Default Admin User
- Email: admin@gmail.com
- Password: 123456
- Role: Admin

## 🚀 Usage

1. **Start the Backend**: `cd backend && npm run dev`
2. **Start the Frontend**: `cd frontend && npm run dev`
3. **Access the Application**: http://localhost:5173
4. **Login as Admin**: Use the default admin credentials
5. **Create Projects**: Add new projects and invite team members
6. **Manage Tasks**: Create, assign, and track tasks within projects

## 📱 Screenshots

### Dashboard
- Overview of projects and tasks
- Quick statistics and recent activity
- Navigation to create new projects/tasks

### Project Management
- Create and edit projects
- Manage team members
- View project details and tasks

### Task Management
- Create and assign tasks
- Set priorities and due dates
- Track task progress and status

## 🔐 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **Session Management**: Express sessions with secure cookies
- **Role-Based Access**: Admin-only features protected
- **Input Validation**: Form validation on frontend and backend
- **Environment Variables**: Sensitive data stored securely

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the database
- Tailwind CSS for the utility-first CSS framework
- All contributors and testers
