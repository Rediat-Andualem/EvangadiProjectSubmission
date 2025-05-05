const express = require("express");
const {userCreateRouter} = require('./Routers/UserR.js')

// const {fileUploader}=require('./Routers/fileUploader.js')
const AllRouters = express.Router();

AllRouters.use('/users',userCreateRouter)
AllRouters.use('/project',userCreateRouter)

// AllRouters.use('/files',fileUploader)

module.exports={AllRouters}