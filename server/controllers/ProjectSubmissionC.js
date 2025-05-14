const { where } = require('sequelize');
const { ProjectSubmission ,  Project} = require('../models');

const createProject = async (req, res) => {
  
  const {
    submittedProjectName,
    githubCodeLink,
    deployedLink,
    projectType,
    ReviewersComment,
  } = req.body;
const {userId} =req.user

  if (!submittedProjectName || !githubCodeLink || !userId) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    if (deployedLink) {
      const existingProject = await ProjectSubmission.findOne({ where: { deployedLink } });
      if (existingProject) {
        return res.status(400).json({ message: "Deployed link already in use." });
      }
    }

    const newProject = await ProjectSubmission.create({
      projectId:submittedProjectName,
      githubCodeLink,
      deployedLink,
      projectType,
      ReviewersComment,
      userId,
    });

    return res.status(201).json({ message: "Project Submitted successfully", project: newProject });
  } catch (error) {
    console.error("Error creating project:", error.message);
    return res.status(500).json({ message: "Failed to create project", error: error.message });
  }
};

const getProjectByStudent = async (req, res) => {
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const submissions = await ProjectSubmission.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Project,
          attributes: ['ProjectDeadLine', 'nameOfProject'],
          required: true
        }
      ]
    });

    // Flatten the data
    const formatted = submissions.map(submission => {
      const { Project: project, ...submissionData } = submission.toJSON();
      return {
        ...submissionData,
        nameOfProject: project?.nameOfProject,
        ProjectDeadLine: project?.ProjectDeadLine,
        // projectActualId: submissions?.submittedProjectId
      };
    });
console.log(formatted)
    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching student projects:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const updateProjectByStudent = async (req, res) => {
  const { projectId } = req.params;
  const {userId}=req.user
  const {
    submittedProjectName,
    githubCodeLink,
    deployedLink,
    projectType,
    ReviewersComment
  } = req.body;

  if (!projectId || !userId) {
    return res.status(400).json({ message: "Project ID and User ID are required." });
  }

  try {
    const project = await ProjectSubmission.findOne({
      where: {submittedProjectId : projectId  , userId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found or not owned by this student." });
    }

    // if (deployedLink && deployedLink !== project.deployedLink) {
    //   const existing = await ProjectSubmission.findOne({ where: { deployedLink } });
    //   if (existing) {
    //     return res.status(409).json({ message: "This deployed link is already in use." });
    //   }
    // }

    await project.update({
      submittedProjectName: submittedProjectName || project.submittedProjectName,
      githubCodeLink: githubCodeLink || project.githubCodeLink,
      deployedLink: deployedLink || project.deployedLink,
      projectType: projectType || project.projectType,
      ReviewersComment: ReviewersComment || project.ReviewersComment,
    });

    return res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("Error updating project:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const deleteProject = async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({ message: "Project ID not provided." });
  }

  try {
    const deletedCount = await ProjectSubmission.destroy({ where: { submittedProjectId : projectId } });

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
  deleteProject,
  getProjectByStudent,
  updateProjectByStudent
};
