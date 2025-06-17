import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Flag } from 'lucide-react';
import { CreateTaskData, Project, User as UserType } from '../../types';
import { tasksAPI, projectsAPI } from '../../lib/api';
import toast from 'react-hot-toast';

const CreateTask: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectMembers, setProjectMembers] = useState<UserType[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || '');
  const [loadingData, setLoadingData] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateTaskData>();

  const watchedProject = watch('project');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (projectId) {
      setValue('project', projectId);
      setSelectedProjectId(projectId);
    }
  }, [projectId, setValue]);

  useEffect(() => {
    if (watchedProject && watchedProject !== selectedProjectId) {
      setSelectedProjectId(watchedProject);
      loadProjectMembers(watchedProject);
    }
  }, [watchedProject, selectedProjectId]);

  const loadData = async () => {
    try {
      console.log('Loading projects...');
      const projectsData = await projectsAPI.getAll();
      console.log('Projects loaded:', projectsData);
      setProjects(projectsData);

      // If there's a pre-selected project, load its members
      if (projectId) {
        console.log('Loading members for project:', projectId);
        await loadProjectMembers(projectId);
      }
    } catch (error: any) {
      console.error('Failed to load data:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      toast.error(`Failed to load data: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoadingData(false);
    }
  };

  const loadProjectMembers = async (projectId: string) => {
    if (!projectId) {
      setProjectMembers([]);
      return;
    }

    try {
      setLoadingMembers(true);
      const members = await projectsAPI.getMembers(projectId);
      setProjectMembers(members);
    } catch (error: any) {
      console.error('Failed to load project members:', error);
      toast.error(`Failed to load project members: ${error.response?.data?.message || error.message}`);
      setProjectMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const onSubmit = async (data: CreateTaskData) => {
    try {
      await tasksAPI.create(data);
      toast.success('Task created successfully! Redirecting to dashboard...');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  if (loadingData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-600 mt-2">
            Add a new task and assign it to team members.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              {...register('title', {
                required: 'Task title is required',
                minLength: {
                  value: 3,
                  message: 'Task title must be at least 3 characters',
                },
              })}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters',
                },
              })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Describe the task..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
                Project
              </label>
              <select
                {...register('project', { required: 'Project is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {errors.project && (
                <p className="mt-1 text-sm text-red-600">{errors.project.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                <Flag className="h-4 w-4 inline mr-1" />
                Priority
              </label>
              <select
                {...register('priority')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Assign To (Optional)
              </label>
              <select
                {...register('assignedTo')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={!selectedProjectId || loadingMembers}
              >
                <option value="">
                  {!selectedProjectId
                    ? 'Select a project first'
                    : loadingMembers
                    ? 'Loading members...'
                    : 'Unassigned'
                  }
                </option>
                {selectedProjectId && !loadingMembers && projectMembers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
              {selectedProjectId && projectMembers.length === 0 && !loadingMembers && (
                <p className="mt-1 text-sm text-gray-500">No members in this project</p>
              )}
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Due Date (Optional)
              </label>
              <input
                {...register('dueDate')}
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
