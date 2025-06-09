const { ProjectSubmission, Project, User, ForumTable } = require("../models");

// const createProject = async (req, res) => {
//  const { userId } = req.user;
//   const {
//     submittedProjectName,
//     githubCodeLink,
//     deployedLink,
//     projectType,
//     ReviewersComment,
//   } = req.body;


//   if (!submittedProjectName || !githubCodeLink || !userId) {
//     return res.status(400).json({ message: "Missing required fields." });
//   }

//   try {
//     if (deployedLink) {
//       const existingProject = await ProjectSubmission.findOne({
//         where: { deployedLink },
//       });
//       if (existingProject) {
//         return res
//           .status(400)
//           .json({ message: "Deployed link already in use." });
//       }
//     }

//     const newProject = await ProjectSubmission.create({
//       projectId: submittedProjectName,
//       githubCodeLink,
//       deployedLink,
//       projectType,
//       ReviewersComment,
//       userId,
//     });

//     return res
//       .status(201)
//       .json({ message: "Project Submitted successfully", project: newProject });
//   } catch (error) {
//     console.error("Error creating project:", error.message);
//     return res
//       .status(500)
//       .json({ message: "Failed to create project", error: error.message });
//   }
// };


const createProject = async (req, res) => {
  const { userId } = req.user;
  const {
    submittedProjectName,
    githubCodeLink,
    deployedLink,
    projectType,
    ReviewersComment,
  } = req.body;

  if (!submittedProjectName || !githubCodeLink || !userId ) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const existingProjectForType = await ProjectSubmission.findOne({
      where: {
        userId,
        projectId:submittedProjectName,
      },
    });

    if (existingProjectForType) {
      return res.status(400).json({
        message:
          "Uploading multiple times is not allowed. You can update or delete the existing project.",
      });
    }


    if (deployedLink) {
      const existingProjectWithDeployedLink = await ProjectSubmission.findOne({
        where: { deployedLink },
      });

      if (existingProjectWithDeployedLink) {
        return res.status(400).json({
          message: "Deployed link already in use.",
        });
      }
    }

    // Create new project
    const newProject = await ProjectSubmission.create({
      projectId: submittedProjectName,
      githubCodeLink,
      deployedLink,
      projectType,
      ReviewersComment,
      userId,
    });

    return res.status(201).json({
      message: "Project submitted successfully.",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error.message);
    return res.status(500).json({
      message: "Failed to create project.",
      error: error.message,
    });
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

   
let normalizedComment = comment.trim().replace(/\s+/g, ' ');

    await submission.update({ ReviewersComment: normalizedComment });

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


const BatchWiseCompletion = async (req, res) => {
  const { Batch, Group, Year, Project: ProjectName } = req.body;
  console.log(req.user)
  try {
    const filteredSubmissions = await ProjectSubmission.findAll({
      where: {
        ReviewersComment: 'Accepted'
      },
      include: [
        {
          model: User,
          where: {
            Batch,
            Group,
            Year
          },
          attributes: ['userFirstName', 'userLastName', 'userEmail', 'userPhoneNumber', 'Batch', 'Group', 'Year']
        },
        {
          model: Project,
          where: ProjectName ? { nameOfProject: ProjectName } : {},
          attributes: ['nameOfProject']
        }
      ]
    });

    const response = filteredSubmissions.map(submission => ({
      firstName: submission.User.userFirstName,
      lastName: submission.User.userLastName,
      email: submission.User.userEmail,
      phoneNumber: submission.User.userPhoneNumber,
      batch: submission.User.Batch,
      group: submission.User.Group,
      year: submission.User.Year,
      projectName: submission.Project.nameOfProject,
      githubCodeLink: submission.githubCodeLink,
      deployedLink: submission.deployedLink,
      submittedProjectId: submission.submittedProjectId
    }));

    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching project submissions:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};


const overAllCompletion = async (req, res) => {
  const { Batch, Year } = req.body;

  try {
    // Step 1: Fetch all project IDs
    const projects = await Project.findAll({
      attributes: ['projectId'],
    });

    const projectIds = projects.map(project => project.projectId);
    if (projectIds.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No projects found',
      });
    }

    const users = await User.findAll({
      where: {
        Batch,
        Year,
      },
      attributes: ['userId', 'userFirstName', 'userLastName', 'userEmail', 'userPhoneNumber', 'Batch', 'Group', 'Year'],
    });

    const completedUsers = [];

    for (const user of users) {  
      const acceptedSubmissions = await ProjectSubmission.findAll({
        where: {
          userId: user.userId,
          ReviewersComment: 'Accepted',
          projectId: projectIds,
        },
        attributes: ['projectId'],
      });

      const acceptedProjectIds = acceptedSubmissions.map(sub => sub.projectId);

   
      const hasAllAccepted = projectIds.every(id => acceptedProjectIds.includes(id));

      if (hasAllAccepted) {
        completedUsers.push({
          firstName: user.userFirstName,
          lastName: user.userLastName,
          email: user.userEmail,
          phoneNumber: user.userPhoneNumber,
          batch: user.Batch,
          group: user.Group, 
          year: user.Year,
        });
      }
    }
    return res.status(200).json({
      success: true,
      data: completedUsers,
    });
  } catch (error) {
    console.error('Error in overAllCompletion:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

const forAssignment = async (req, res) => {
  const { Batch, Group, Year } = req.body;
  try {
    const filteredUsers = await User.findAll({
      where: {
        Batch,
        Group,
        Year
      },
      attributes: ['userFirstName', 'userLastName', 'userEmail', 'userPhoneNumber' ,'userId','Batch','Year','Group']
    });

    const response = filteredUsers.map(user => ({
      firstName: user.userFirstName,
      lastName: user.userLastName,
      email: user.userEmail,
      phoneNumber: user.userPhoneNumber,
      userID : user.userId,
      Batch:user.Batch,
      Year:user.Year,
      InitialEvangadiGroup:user.Group

    }));

    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const AssignToProject = async (req, res) => {
  try {
    const { userId, userEmail, projectId, Group, Batch,year } = req.body;
    // Validate required fields
    if (!userId || !userEmail || !projectId || !Group || !Batch) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if this user is already assigned to this project
    const existingAssignment = await ForumTable.findOne({
      where: {
        userId,
        projectId
      }
    });

    if (existingAssignment) {
      return res.status(400).json({
        message: 'User is already assigned to this project.'
      });
    }


    // Create new assignment record
    const newAssignment = await ForumTable.create({
      userId,
      userEmail,
      projectId,
      year,
      groupAssigned: Group,
      batch: Batch,
      assigned: true
    });

    res.status(201).json({
      message: "Student successfully assigned to project",
      // data: newAssignment
    });

  } catch (error) {
    console.error('Error assigning student to project:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

const getAssignedUsers = async (req, res) => {
  try {
    const { Batch, Group, Year, projectId } = req.body;

    const filteredUsers = await ForumTable.findAll({
      where: {
        batch: Batch,
        groupAssigned: Group,
        year: Year,
        projectId
      },
      include: [
        {
          model: User,
          attributes: ['userId', 'userFirstName', 'userLastName', 'userEmail', 'userPhoneNumber', 'Group', 'Batch', 'Year']
        },
        {
          model: Project,
          attributes: ['projectId', 'nameOfProject', 'projectDescription', 'projectResource', 'ProjectShowStatus', 'ProjectDeadLine']
        }
      ]
    });

    res.status(200).json({ data: filteredUsers });
  } catch (error) {
    console.error('Error fetching assigned users:', error);
    res.status(500).json({ message: 'Failed to fetch assigned users', error });
  }
};

const addCommentToStudent = async (req, res) => {
  try {
    const { forumtableId, message, projectId } = req.body;

    if (!forumtableId || !message || !projectId) {
      return res.status(400).json({ error: "Required fields missing." });
    }

    // Update ForumTable: commentToStudent
    const forumUpdate = await ForumTable.update(
      { commentToStudent: message },
      { where: { forumtableId } }
    );

    // Update ProjectSubmission: ReviewersComment
    const projectUpdate = await ProjectSubmission.update(
      { ReviewersComment: message },
      { where: { projectId } }
    );

    if (forumUpdate[0] === 0 && projectUpdate[0] === 0) {
      return res.status(404).json({ error: "No matching records found." });
    }

    return res.status(200).json({ message: "Comment added successfully." });

  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const addSuggestionToEvangadi = async (req, res) => {
  try {
    const { forumtableId, message } = req.body;

    if (!forumtableId || !message) {
      return res.status(400).json({ error: "Required fields missing." });
    }

    // Update only the suggestionToEvangadi field
    const updateResult = await ForumTable.update(
      { suggestionToEvangadi: message },
      { where: { forumtableId } }
    );

    if (updateResult[0] === 0) {
      return res.status(404).json({ error: "ForumTable entry not found." });
    }

    return res.status(200).json({ message: "Suggestion added successfully." });

  } catch (error) {
    console.error("Error adding suggestion:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const deleteAssigned = async (req, res) => {
  const { currentForumId } = req.params;
console.log(currentForumId)
  try {
    const deletedRecord = await ForumTable.destroy({
      where: {
        forumtableId: currentForumId,
      },
    });

    if (deletedRecord === 0) {
      return res.status(404).json({ message: 'No record found with the given ID.' });
    }

    res.status(200).json({ message: 'User assignment deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user assignment:', error);
    res.status(500).json({ message: 'Internal server error.' });
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
  BatchWiseCompletion,
  overAllCompletion,
  forAssignment,
  AssignToProject,
  getAssignedUsers,
  addCommentToStudent,
  addSuggestionToEvangadi,
  deleteAssigned
};
