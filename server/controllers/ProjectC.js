const { Project } = require('../models');




const createProject = async (req, res) => {
  const {
    nameOfProject,
    githubCodeLink,
    deployedLink,
    projectType,
    ReviewersComment,
    userId,
  } = req.body;

  // Validation to ensure required fields are provided
  if (!nameOfProject || !githubCodeLink || !projectType || !ReviewersComment || !userId) {
    return res.status(400).json({ message: "All required fields must be provided." });
  }

  try {
    // Check if the deployedLink already exists
    const existingProject = await Project.findOne({
      where: { deployedLink }
    });

    if (existingProject) {
      return res.status(400).json({ message: "The deployed link is already associated with another project." });
    }

    // Create a new project
    const newProject = await Project.create({
      nameOfProject,
      githubCodeLink,
      deployedLink,
      projectType,
      ReviewersComment,
      userId,
    });

    // Respond with the created project
    return res.status(201).json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    console.error("Error creating project:", error.message);
    return res.status(500).json({ message: "Failed to create project", error: error.message });
  }
};




const deleteProject = async (req, res) => {
    const { projectId } = req.params;
  
    if (!projectId) {
      return res.status(400).json({ message: "Project ID not provided." });
    }
  
    try {
      const deletedCount = await Project.destroy({ where: { projectId } });
  
      if (deletedCount === 0) {
        return res.status(404).json({ message: "Project not found." });
      }
  
      return res.status(200).json({ message: "Project deleted successfully." });
    } catch (error) {
      console.error("Error deleting project:", error.message);
      return res.status(500).json({ message: "Failed to delete project", error: error.message });
    }
  };
  


  module.exports = {
    createProject,
    deleteProject
  };
  