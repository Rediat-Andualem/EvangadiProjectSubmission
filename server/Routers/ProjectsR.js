const express = require("express");
const {
 createProjectForStudents,
 getProjectsCreatedForStudents,
 deleteProjectForStudents,
 updateProjectShowStatusForStudents
} = require("../controllers/Projects");
const { checkRole, authenticateToken } = require("../Auth/Auth.js");

let ProjectForStudentsRoute = express.Router();

ProjectForStudentsRoute.post("/createProjectForStudents",authenticateToken, checkRole(['1']), createProjectForStudents);
ProjectForStudentsRoute.get("/getProjectsForStudents",authenticateToken,getProjectsCreatedForStudents);
ProjectForStudentsRoute.delete("/deleteProjectForStudents/:projectId",authenticateToken,checkRole(['1']),deleteProjectForStudents);
ProjectForStudentsRoute.patch("/updateShowStatus/:projectId",authenticateToken,checkRole(['1']),updateProjectShowStatusForStudents);


module.exports = { ProjectForStudentsRoute };

// 1.User role = "0"
// 2.Admin role ="1"
// 3.Sub Admin role = "2"
// 4.Advert Reviewer ="3"
