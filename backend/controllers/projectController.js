const Project = require('../models/Project');

// Create a new project
exports.createProject = async (req, res) => {
    const { name, description, members } = req.body;
    try {
        const project = new Project({
            name,
            description,
            creator: req.user._id,
            members: members || []
        });
        await project.save();

        // Populate the project before sending response
        const populatedProject = await Project.findById(project._id)
            .populate('creator', 'username email')
            .populate('members', 'username email');

        res.status(201).json(populatedProject);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
    try {
        // For admin users, show all projects. For regular users, show projects they created or are members of
        let query = {};
        if (req.user.role !== 'admin') {
            query = {
                $or: [
                    { creator: req.user._id },
                    { members: req.user._id }
                ]
            };
        }

        const projects = await Project.find(query)
            .populate('creator', 'username email')
            .populate('members', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('creator', 'username email')
            .populate('members', 'username email');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
};

// Get project members
exports.getProjectMembers = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('creator', 'username email')
            .populate('members', 'username email');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Combine creator and members into one array
        const allMembers = [project.creator];
        project.members.forEach(member => {
            // Avoid duplicates if creator is also in members array
            if (!allMembers.some(m => m._id.toString() === member._id.toString())) {
                allMembers.push(member);
            }
        });

        res.status(200).json(allMembers);
    } catch (error) {
        console.error('Error fetching project members:', error);
        res.status(500).json({ message: 'Error fetching project members', error: error.message });
    }
};

// Update a project
exports.updateProject = async (req, res) => {
    const { name, description, members } = req.body;
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this project' });
        }
        project.name = name || project.name;
        project.description = description || project.description;
        project.members = members || project.members;
        await project.save();

        // Populate and return updated project
        const updatedProject = await Project.findById(project._id)
            .populate('creator', 'username email')
            .populate('members', 'username email');

        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this project' });
        }
        await Project.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
};