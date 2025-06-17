const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// Create a new project
router.post('/', authenticate, projectController.createProject);

// Get all projects
router.get('/', authenticate, projectController.getAllProjects);

// Get a single project by ID
router.get('/:id', authenticate, projectController.getProjectById);

// Get project members
router.get('/:id/members', authenticate, projectController.getProjectMembers);

// Update a project by ID
router.put('/:id', authenticate, authorize('admin', 'member'), projectController.updateProject);

// Delete a project by ID
router.delete('/:id', authenticate, authorize('admin'), projectController.deleteProject);

module.exports = router;