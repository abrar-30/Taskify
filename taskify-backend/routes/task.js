const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// Create a new task
router.post('/', authenticate, taskController.createTask);

// Get all tasks (for dashboard and task list)
router.get('/', authenticate, taskController.getAllTasks);

// Get all tasks for a project
router.get('/project/:projectId', authenticate, taskController.getTasksByProject);

// Get a specific task
router.get('/:taskId', authenticate, taskController.getTaskById);

// Update a task
router.put('/:taskId', authenticate, taskController.updateTask);

// Delete a task
router.delete('/:taskId', authenticate, authorize('admin'), taskController.deleteTask);

module.exports = router;