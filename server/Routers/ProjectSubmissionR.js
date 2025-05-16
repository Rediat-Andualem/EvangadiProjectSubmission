const express = require("express");
const {
  createProject,
  deleteProject,
  getProjectByStudent,
  updateProjectByStudent,
getAllProjectSubmissions,
updateAllowing,
commentFromInstructors
} = require("../controllers/ProjectSubmissionC.js");
const { checkRole, authenticateToken } = require("../Auth/Auth.js");

let projectSubmissionRouter = express.Router();

projectSubmissionRouter.post("/submitProject",authenticateToken, createProject);
projectSubmissionRouter.get("/getStudentProject",authenticateToken,getProjectByStudent);
projectSubmissionRouter.put("/updateStudentProject/:projectId",authenticateToken,updateProjectByStudent);
projectSubmissionRouter.delete("/deleteProject/:projectId",authenticateToken,deleteProject);
projectSubmissionRouter.get("/fullInfo",authenticateToken, checkRole(["1"]),getAllProjectSubmissions);
projectSubmissionRouter.post("/projectComment/:currentProjectId",authenticateToken, checkRole(["1"]),commentFromInstructors);
projectSubmissionRouter.patch("/updateAllowing/:projectId",authenticateToken, checkRole(["1"]),updateAllowing);




module.exports = { projectSubmissionRouter };

// 1.User role = "0"
// 2.Admin role ="1"
// 3.Sub Admin role = "2"
// 4.Advert Reviewer ="3"
