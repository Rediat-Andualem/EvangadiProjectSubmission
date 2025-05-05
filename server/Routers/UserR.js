const express = require('express');
const { userC, allUserNameFinder, loginC,deleteUser,forgotPassword,updateUserPassword,verifyEmail,allUserFinder,singleUserFinder,getSecurityQuestions,createSecurityQuestion,deleteSecurityQuestion} = require('../controller/UserC.js'); 
const {checkRole,authenticateToken} = require('../Auth/Auth.js')

let userCreateRouter = express.Router();

userCreateRouter.post('/createUser', userC); // checked
userCreateRouter.post('/login', loginC); // checked
userCreateRouter.delete('/deleteUser/:userNameId',authenticateToken,checkRole(["1"]), deleteUser); // checked
userCreateRouter.post('/email-pass', forgotPassword); // checked
userCreateRouter.post('/updatePassword/:userNameId',updateUserPassword ); // checked
userCreateRouter.post('/verify',verifyEmail ); // checked
// userCreateRouter.post('/privilege/:userNameId',authenticateToken,checkRole(["1"]),grantPrivilege ); // checked
userCreateRouter.get('/allUsers',allUserFinder ); // checked
userCreateRouter.get('/singleUser/:userNameId',authenticateToken,checkRole(["1"]),singleUserFinder ); // checked
userCreateRouter.get('/getSecurityQuestions',getSecurityQuestions ); // checked
userCreateRouter.post('/createSecurityQuestions',createSecurityQuestion ); // checked
userCreateRouter.delete('/deleteSecurityQuestions/:SecurityQuestionId',deleteSecurityQuestion ); // checked
userCreateRouter.get('/getUserNames',allUserNameFinder ); 



module.exports = {userCreateRouter};
// 1.User role = "0"
// 2.Admin role ="1"
// 3.Sub Admin role = "2"
// 4.Advert Reviewer ="3"



