const express = require('express');
const { userC, loginC,deleteUser,forgotPassword,updateUserPassword,verifyEmail,allUserFinder,singleUserFinder} = require('../controllers/UserC.js'); 
const {checkRole,authenticateToken} = require('../Auth/Auth.js')

let userCreateRouter = express.Router();

userCreateRouter.post('/createUser', userC); // 
userCreateRouter.post('/login', loginC); // 
userCreateRouter.delete('/deleteUser/:userNameId',authenticateToken,checkRole(["1"]), deleteUser); // 
userCreateRouter.post('/email-pass', forgotPassword); // 
userCreateRouter.post('/updatePassword/:userNameId',updateUserPassword ); // 
userCreateRouter.post('/verify',verifyEmail ); // 
userCreateRouter.get('/allUsers',allUserFinder ); // 
userCreateRouter.get('/singleUser/:userNameId',authenticateToken,checkRole(["1"]),singleUserFinder ); // 




module.exports = {userCreateRouter};
// 1.User role = "0"
// 2.Admin role ="1"
// 3.Sub Admin role = "2"
// 4.Advert Reviewer ="3"


