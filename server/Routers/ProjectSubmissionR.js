const express = require("express");
const {
  createProject,
  deleteProject,
  getProjectByStudent,
  updateProjectByStudent,
getAllProjectSubmissions,
updateAllowing,
commentFromInstructors,
BatchWiseCompletion,
overAllCompletion,
forAssignment,
AssignToProject,
getAssignedUsers,
addCommentToStudent,
addSuggestionToEvangadi,
deleteAssigned
} = require("../controllers/ProjectSubmissionC.js");
const { checkRole, authenticateToken } = require("../Auth/Auth.js");

let projectSubmissionRouter = express.Router();

projectSubmissionRouter.post("/submitProject",authenticateToken, createProject);
projectSubmissionRouter.get("/getStudentProject",authenticateToken,getProjectByStudent);
projectSubmissionRouter.patch("/updateStudentProject/:projectId",authenticateToken,updateProjectByStudent);
projectSubmissionRouter.delete("/deleteProject/:projectId",authenticateToken,deleteProject);
projectSubmissionRouter.get("/fullInfo",authenticateToken, checkRole(["1"]),getAllProjectSubmissions);
projectSubmissionRouter.post("/projectComment/:currentProjectId",authenticateToken, checkRole(["1"]),commentFromInstructors);
projectSubmissionRouter.patch("/updateAllowing/:projectId",authenticateToken, checkRole(["1"]),updateAllowing);
projectSubmissionRouter.post("/batchCompletion",authenticateToken, checkRole(["1"]),BatchWiseCompletion);
projectSubmissionRouter.post("/overAllCompletion",authenticateToken, checkRole(["1"]),overAllCompletion);
projectSubmissionRouter.post("/usersForForum",authenticateToken, checkRole(["1"]),forAssignment);
projectSubmissionRouter.post("/assignProject",authenticateToken, checkRole(["1"]),AssignToProject);
projectSubmissionRouter.post("/getAssignedStudents",authenticateToken, checkRole(["1"]),getAssignedUsers); 
projectSubmissionRouter.post("/addSuggestionToEvangadi",authenticateToken, checkRole(["1"]),addSuggestionToEvangadi); 
projectSubmissionRouter.post("/addCommentToStudent",authenticateToken, checkRole(["1"]),addCommentToStudent); 
projectSubmissionRouter.delete('/deleteAssigned/:currentForumId',authenticateToken,checkRole(["1"]),deleteAssigned)

 

module.exports = { projectSubmissionRouter };

// 1.User role = "0"
// 2.Admin role ="1"
// 3.Sub Admin role = "2"
// 4.Advert Reviewer ="3"
