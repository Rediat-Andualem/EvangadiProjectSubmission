const express = require("express");
const {
 createProjectForStudents,
 getProjectsCreatedForStudents,
 deleteProjectForStudents
} = require("../controllers/Projects");
const { checkRole, authenticateToken } = require("../Auth/Auth.js");

let ProjectForStudentsRoute = express.Router();

ProjectForStudentsRoute.post("/createProjectForStudents",authenticateToken, checkRole(['1']), createProjectForStudents);
ProjectForStudentsRoute.get("/getProjectsForStudents",authenticateToken,checkRole(['1']),getProjectsCreatedForStudents);
ProjectForStudentsRoute.delete("/deleteProjectForStudents/:projectId",authenticateToken,checkRole(['1']),deleteProjectForStudents);


module.exports = { ProjectForStudentsRoute };

// 1.User role = "0"
// 2.Admin role ="1"
// 3.Sub Admin role = "2"
// 4.Advert Reviewer ="3"
