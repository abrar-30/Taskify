const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const { title, description, status, dueDate, assignedTo, priority, project } = req.body;

        // Validate that the project exists
        const Project = require('../models/Project');
        const projectDoc = await Project.findById(project);
        if (!projectDoc) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // If assignedTo is provided, validate that the user is a member of the project
        if (assignedTo) {
            const isCreator = projectDoc.creator.toString() === assignedTo;
            const isMember = projectDoc.members.some(member => member.toString() === assignedTo);

            if (!isCreator && !isMember) {
                return res.status(400).json({
                    message: 'Cannot assign task to user who is not a member of this project'
                });
            }
        }

        const task = new Task({
            title,
            description,
            status: status || 'pending',
            dueDate,
            assignedTo,
            priority: priority || 'medium',
            project,
            createdBy: req.user._id
        });

        await task.save();

        // Populate the task before sending response
        const populatedTask = await Task.findById(task._id)
            .populate('project', 'name')
            .populate('assignedTo', 'username email')
            .populate('createdBy', 'username email');

        res.status(201).json(populatedTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};

// Get all tasks (for dashboard and task list)
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('project', 'name')
            .populate('assignedTo', 'username email')
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching all tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};

// Get all tasks for a project
exports.getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId })
            .populate('project', 'name')
            .populate('assignedTo', 'username email')
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks for project:', error);
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const { title, description, status, dueDate, assignedTo, priority } = req.body;
        const task = await Task.findById(req.params.taskId).populate('project');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Only assigned user or admin can update status, only admin/project creator can assign
        if (status && task.assignedTo && req.user._id.toString() !== task.assignedTo.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update status' });
        }
        if ((assignedTo || title || description || dueDate || priority) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update task details' });
        }

        // If assignedTo is being updated, validate that the user is a member of the project
        if (assignedTo) {
            const Project = require('../models/Project');
            const projectDoc = await Project.findById(task.project._id);

            const isCreator = projectDoc.creator.toString() === assignedTo;
            const isMember = projectDoc.members.some(member => member.toString() === assignedTo);

            if (!isCreator && !isMember) {
                return res.status(400).json({
                    message: 'Cannot assign task to user who is not a member of this project'
                });
            }
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (status) task.status = status;
        if (dueDate) task.dueDate = dueDate;
        if (assignedTo) task.assignedTo = assignedTo;
        if (priority) task.priority = priority;
        await task.save();

        // Populate the task before sending response
        const updatedTask = await Task.findById(task._id)
            .populate('project', 'name')
            .populate('assignedTo', 'username email')
            .populate('createdBy', 'username email');

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        // Only admin or project creator can delete
        if (req.user.role !== 'admin' && req.user._id.toString() !== task.createdBy.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }
        await Task.findByIdAndDelete(req.params.taskId);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
};

// Get a specific task
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task', error });
    }
};