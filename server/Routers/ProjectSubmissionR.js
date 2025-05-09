const express = require("express");
const {
  createProject,
  deleteProject,
  getProjectByStudent,
  updateProjectByStudent,
} = require("../controllers/ProjectSubmissionC.js");
const { checkRole, authenticateToken } = require("../Auth/Auth.js");

let projectSubmissionRouter = express.Router();

projectSubmissionRouter.post("/submitProject",authenticateToken, createProject);
projectSubmissionRouter.get("/getStudentProject",authenticateToken,getProjectByStudent);
projectSubmissionRouter.put("/updateStudentProject/:projectId",authenticateToken,updateProjectByStudent);
projectSubmissionRouter.delete("/deleteProject/:projectId",authenticateToken,deleteProject);



module.exports = { projectSubmissionRouter };

// 1.User role = "0"
// 2.Admin role ="1"
// 3.Sub Admin role = "2"
// 4.Advert Reviewer ="3"
