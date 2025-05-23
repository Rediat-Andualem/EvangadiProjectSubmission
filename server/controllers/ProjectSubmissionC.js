const { ProjectSubmission, Project, User } = require("../models");

const createProject = async (req, res) => {
  const {
    submittedProjectName,
    githubCodeLink,
    deployedLink,
    projectType,
    ReviewersComment,
  } = req.body;
  const { userId } = req.user;

  if (!submittedProjectName || !githubCodeLink || !userId) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    if (deployedLink) {
      const existingProject = await ProjectSubmission.findOne({
        where: { deployedLink },
      });
      if (existingProject) {
        return res
          .status(400)
          .json({ message: "Deployed link already in use." });
      }
    }

    const newProject = await ProjectSubmission.create({
      projectId: submittedProjectName,
      githubCodeLink,
      deployedLink,
      projectType,
      ReviewersComment,
      userId,
    });

    return res
      .status(201)
      .json({ message: "Project Submitted successfully", project: newProject });
  } catch (error) {
    console.error("Error creating project:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to create project", error: error.message });
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
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Project,
          attributes: ["ProjectDeadLine", "nameOfProject"],
          required: true,
        },
      ],
    });

    // Flatten the data
    const formatted = submissions.map((submission) => {
      const { Project: project, ...submissionData } = submission.toJSON();
      return {
        ...submissionData,
        nameOfProject: project?.nameOfProject,
        ProjectDeadLine: project?.ProjectDeadLine,
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching student projects:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updateProjectByStudent = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.user;
  const {
    submittedProjectName,
    githubCodeLink,
    deployedLink,
    projectType,
    ReviewersComment,
  } = req.body;

  if (!projectId || !userId) {
    return res
      .status(400)
      .json({ message: "Project ID and User ID are required." });
  }

  try {
    const project = await ProjectSubmission.findOne({
      where: { submittedProjectId: projectId, userId },
    });

    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or not owned by this student." });
    }

    // if (deployedLink && deployedLink !== project.deployedLink) {
    //   const existing = await ProjectSubmission.findOne({ where: { deployedLink } });
    //   if (existing) {
    //     return res.status(409).json({ message: "This deployed link is already in use." });
    //   }
    // }

    await project.update({
      submittedProjectName:
        submittedProjectName || project.submittedProjectName,
      githubCodeLink: githubCodeLink || project.githubCodeLink,
      deployedLink: deployedLink || project.deployedLink,
      projectType: projectType || project.projectType,
      ReviewersComment: ReviewersComment || project.ReviewersComment,
    });

    return res
      .status(200)
      .json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("Error updating project:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const deleteProject = async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({ message: "Project ID not provided." });
  }

  try {
    const deletedCount = await ProjectSubmission.destroy({
      where: { submittedProjectId: projectId },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Project not found." });
    }

    return res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("Error deleting project:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to delete project", error: error.message });
  }
};

const getAllProjectSubmissions = async (req, res) => {
  try {
    const submissions = await ProjectSubmission.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Project,
          attributes: ["nameOfProject", "ProjectShowStatus", "ProjectDeadLine"],
          required: true,
        },
        {
          model: User,
          attributes: [
            "userFirstName",
            "userLastName",
            "userEmail",
            "userPhoneNumber",
            "Group",
            "Batch",
            "Year",
          ],
          required: true,
        },
      ],
    });

    const formatted = submissions.map((submission) => {
      const {
        Project: project,
        User: user,
        ...submissionData
      } = submission.toJSON();
      return {
        ...submissionData,
        nameOfProject: project?.nameOfProject,
        ProjectDeadLine: project?.ProjectDeadLine,
        username: user?.userFirstName,
        email: user?.userEmail,
        userPhoneNumber: user?.userPhoneNumber,
        Group: user?.Group,
        Batch: user?.Batch,
        Year: user?.Year,
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching all project submissions:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const commentFromInstructors = async (req, res) => {
  const { currentProjectId } = req.params;
  const { comment } = req.body;

  try {
    // Find the submission
    const submission = await ProjectSubmission.findByPk(currentProjectId);

    if (!submission) {
      return res.status(404).json({ message: "Project submission not found." });
    }

    // Update only the ReviewersComment field
    await submission.update({ ReviewersComment: comment });

    return res
      .status(200)
      .json({ message: "Reviewer comment updated successfully." });
  } catch (error) {
    console.error("Error updating comment:", error);
    return res
      .status(500)
      .json({ message: "Failed to update comment.", error: error.message });
  }
};

const updateAllowing = async (req, res) => {
  const { projectId } = req.params;
  const {ProjectUpdateStatus} = req.body
  try {
    const [updatedRowsCount] = await ProjectSubmission.update(
      { ProjectUpdateStatus },
      { where: { projectId } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "Submission not found" });
    }

    return res.status(200).json({
      message: "Project update status updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  createProject,
  deleteProject,
  getProjectByStudent,
  updateProjectByStudent,
  getAllProjectSubmissions,
  commentFromInstructors,
  updateAllowing,
};
