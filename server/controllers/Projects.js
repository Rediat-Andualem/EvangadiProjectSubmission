const { Project } = require('../models');

const createProjectForStudents = async (req, res) => {
  const { nameOfProject, projectDescription, projectResource, ProjectDeadLine } = req.body;
  const {userId}=req.user
  if (!nameOfProject || !userId) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const project = await Project.create({
      nameOfProject,
      projectDescription,
      projectResource,
      ProjectDeadLine, //dd/mm/yyyy
      userId
    });
    return res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create project", error: error.message });
  }
};



const getProjectsCreatedForStudents = async (req, res) => {
  try {
    const projects = await Project.findAll();
    return res.status(200).json({ projects });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get projects", error: error.message });
  }
};





const deleteProjectForStudents = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.user;

  try {
    const deletedProject = await Project.destroy({where :{
        projectId, userId}});
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found or not owned by user." });
    }
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete project", error: error.message });
  }
};


module.exports = {
  createProjectForStudents,
  getProjectsCreatedForStudents,
  deleteProjectForStudents
};
