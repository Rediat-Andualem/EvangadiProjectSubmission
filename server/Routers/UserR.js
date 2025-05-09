const express = require('express');
const { userC, loginC,deleteUser,forgotPassword,updateUserPassword,allUserFinder,singleUserFinder} = require('../controllers/UserC.js'); 
const {checkRole,authenticateToken} = require('../Auth/Auth.js')

let userCreateRouter = express.Router();

userCreateRouter.post('/createUser', userC);  
userCreateRouter.post('/login', loginC);  
userCreateRouter.delete('/deleteUser/:userId',authenticateToken,checkRole(["1"]), deleteUser); 
userCreateRouter.post('/forgotPassword', forgotPassword);  
userCreateRouter.post('/updatePassword/:userId',updateUserPassword );  
userCreateRouter.get('/allUsers',checkRole(["1"]),allUserFinder );  
userCreateRouter.get('/singleUser/:userId',authenticateToken,checkRole(["1"]),singleUserFinder ); 

module.exports = {userCreateRouter};
    // 1.User role = "0"
    // 2.Admin role ="1"
    // 3.Sub Admin role = "2"
    // 4.Advert Reviewer ="3"
   