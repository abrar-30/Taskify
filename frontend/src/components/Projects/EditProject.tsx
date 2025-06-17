import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react';
import { projectsAPI, authAPI } from '../../lib/api';
import { Project, User } from '../../types';
import toast from 'react-hot-toast';

const EditProject: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: [] as string[]
  });

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      
      // Load project data
      const projectData = await projectsAPI.getById(projectId);
      setProject(projectData);
      
      // Populate form with project data
      // Always include project creator in members (even though they're shown separately)
      const memberIds = projectData.members?.map(member => member._id) || [];
      const creatorId = projectData.creator?._id;

      setFormData({
        name: projectData.name || '',
        description: projectData.description || '',
        members: creatorId && !memberIds.includes(creatorId)
          ? [...memberIds, creatorId]
          : memberIds
      });
      
      // Load users
      const usersData = await authAPI.getAllUsers();
      setAllUsers(Array.isArray(usersData) ? usersData : []);
      
    } catch (error) {
      console.error('Failed to load project data:', error);
      toast.error('Failed to load project data');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get all users organized by their relationship to the project
  const getOrganizedUsers = () => {
    if (!project) return { creator: null, currentMembers: [], availableUsers: [] };

    const projectCreatorId = project.creator?._id;
    const currentMemberIds = project.members?.map(member => member._id) || [];

    const creator = allUsers.find(user => user._id === projectCreatorId) || null;
    const currentMembers = allUsers.filter(user =>
      currentMemberIds.includes(user._id) && user._id !== projectCreatorId
    );
    const availableUsers = allUsers.filter(user =>
      user._id !== projectCreatorId && !currentMemberIds.includes(user._id)
    );

    return { creator, currentMembers, availableUsers };
  };

  const handleMemberToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectId) return;
    
    try {
      setSubmitting(true);
      
      await projectsAPI.update(projectId, formData);
      toast.success('Project updated successfully!');
      navigate(`/projects/${projectId}`);
    } catch (error: any) {
      console.error('Failed to update project:', error);
      toast.error(error.response?.data?.message || 'Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading project...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2>
        <button
          onClick={() => navigate('/projects')}
          className="text-blue-600 hover:text-blue-700"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Project
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
          <p className="text-gray-600 mt-1">Update project details and manage members</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Members
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Manage project members. Check users to add them to the project, uncheck to remove them.
            </p>
            <div className="border border-gray-300 rounded-lg p-4 max-h-80 overflow-y-auto">
              {allUsers.length === 0 ? (
                <p className="text-gray-500 text-sm">No users available</p>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const { creator, currentMembers, availableUsers } = getOrganizedUsers();

                    return (
                      <>
                        {/* Project Creator - Always included, cannot be removed */}
                        {creator && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={true}
                                  disabled={true}
                                  className="h-4 w-4 text-blue-600 border-gray-300 rounded opacity-50"
                                />
                                <span className="ml-2 text-sm font-medium text-blue-900">
                                  {creator.username} ({creator.email})
                                </span>
                              </div>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Creator
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Current Members */}
                        {currentMembers.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Members</h4>
                            <div className="space-y-2">
                              {currentMembers.map((user) => {
                                const isSelected = formData.members.includes(user._id);

                                return (
                                  <label
                                    key={user._id}
                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 bg-green-50 border border-green-200"
                                  >
                                    <div className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleMemberToggle(user._id)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                      />
                                      <span className="ml-2 text-sm text-green-900 font-medium">
                                        {user.username} ({user.email})
                                      </span>
                                    </div>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                      Current Member
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Available Users to Add */}
                        {availableUsers.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Available Users</h4>
                            <div className="space-y-2">
                              {availableUsers.map((user) => {
                                const isSelected = formData.members.includes(user._id);

                                return (
                                  <label
                                    key={user._id}
                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 border border-gray-200"
                                  >
                                    <div className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleMemberToggle(user._id)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                      />
                                      <span className="ml-2 text-sm text-gray-700">
                                        {user.username} ({user.email})
                                      </span>
                                    </div>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                      Available
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Show message if no available users */}
                        {availableUsers.length === 0 && currentMembers.length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">All users are already part of this project</p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
            <div className="mt-3 text-xs text-gray-500 space-y-1">
              <p><strong>Total members:</strong> {formData.members.length + 1} (including creator)</p>
              <p>• Project creator is automatically included and cannot be removed</p>
              <p>• Check users to add them as project members</p>
              <p>• Uncheck current members to remove them from the project</p>
              <p>• All system users are available for selection</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/projects/${projectId}`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
