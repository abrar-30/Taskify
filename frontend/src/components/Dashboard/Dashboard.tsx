import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Project, Task, User } from '../../types';
import { projectsAPI, tasksAPI, authAPI } from '../../lib/api';
import { Plus, FolderOpen, CheckSquare, Clock, Users, UserCheck } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);

    try {
      const projectsData = await projectsAPI.getAll();
      setProjects(Array.isArray(projectsData) ? projectsData : []);

      const tasksData = await tasksAPI.getAll();
      setTasks(Array.isArray(tasksData) ? tasksData : []);

      // Load users only for admin
      if (user?.isAdmin) {
        const usersData = await authAPI.getAllUsersForAdmin();
        setUsers(Array.isArray(usersData) ? usersData : []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setProjects([]);
      setTasks([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // Helper functions
  const getTaskStats = () => {
    if (!Array.isArray(tasks) || !user) {
      return { total: 0, pending: 0, inProgress: 0, completed: 0 };
    }
    const myTasks = tasks.filter(task => task?.assignedTo?._id === user?._id);
    return {
      total: myTasks.length,
      pending: myTasks.filter(task => task?.status === 'pending').length,
      inProgress: myTasks.filter(task => task?.status === 'in-progress').length,
      completed: myTasks.filter(task => task?.status === 'completed').length,
    };
  };

  const getRecentTasks = () => {
    if (!Array.isArray(tasks) || !user) {
      return [];
    }
    return tasks
      .filter(task => task?.assignedTo?._id === user?._id)
      .sort((a, b) => {
        const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  };

  const taskStats = getTaskStats();
  const recentTasks = getRecentTasks();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Link>
          <Link
            to="/tasks/new"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              {user?.isAdmin ? (
                <UserCheck className="h-6 w-6 text-green-600" />
              ) : (
                <CheckSquare className="h-6 w-6 text-green-600" />
              )}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {user?.isAdmin ? 'Total Users' : 'My Tasks'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {user?.isAdmin ? users.length : taskStats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {user?.isAdmin ? 'Total Tasks' : 'In Progress'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {user?.isAdmin ? tasks.length : taskStats.inProgress}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {user?.isAdmin ? 'Active Projects' : 'Completed'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {user?.isAdmin ? projects.length : taskStats.completed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects and Tasks/Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
              <Link
                to="/projects"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No projects yet</p>
                <Link
                  to="/projects/new"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first project
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}`}
                    className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {project.members.length + 1} members
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {format(new Date(project.createdAt), 'MMM d')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Tasks or Users (Admin) */}
        {user?.isAdmin ? (
          /* Users Section for Admin */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">System Users</h2>
                <span className="text-sm text-gray-500 font-medium">
                  {users.length} total users
                </span>
              </div>
            </div>
            <div className="p-6">
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No users found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div
                      key={user._id}
                      className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{user.username}</h3>
                          <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                          <div className="flex items-center mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'admin'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(new Date(user.createdAt), 'MMM d')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Tasks Section for Regular Users */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">My Recent Tasks</h2>
                <Link
                  to="/tasks"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No tasks assigned to you</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <Link
                      key={task._id}
                      to={`/tasks/${task._id}`}
                      className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{task.project?.name || 'No project'}</p>
                          <div className="flex items-center mt-2 space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              task.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : task.status === 'in-progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {task.status}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              task.priority === 'high'
                                ? 'bg-red-100 text-red-800'
                                : task.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(new Date(task.createdAt), 'MMM d')}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
