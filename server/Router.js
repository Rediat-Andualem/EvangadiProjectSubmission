const express = require("express");
const {userCreateRouter} = require('./Routers/UserR.js')
const {projectSubmissionRouter} = require('./Routers/ProjectSubmissionR.js')
const {ProjectForStudentsRoute} = require('./Routers/ProjectsR.js')

// const {fileUploader}=require('./Routers/fileUploader.js')
const AllRouters = express.Router();

AllRouters.use('/users',userCreateRouter)
AllRouters.use('/projectSubmission',projectSubmissionRouter)
AllRouters.use('/projectCreation',ProjectForStudentsRoute)

// AllRouters.use('/files',fileUploader)

module.exports={AllRouters}