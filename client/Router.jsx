import React from "react";
import {
  Routes,
  Route
} from "react-router-dom";
import DashBoard from "./src/Page/LandingPage/Dashboard.jsx";
import LayOut from "./src/components/LayOut/LayOut.jsx"
import ProjectSubmissionPage from "./src/Page/ProjectPage/ProjectSubmissionPage.jsx";
import PrivateRoute from './src/components/ProtectRoute/PrivateRoute.jsx'
import Admin from './src/Page/AdminPage/Main/Main.jsx'
import EmailForPassword from "./src/Page/EmailForPasswrod/EmailForPassword.jsx";
import PasswordUpdater from "./src/Page/PassworedUpdate/PasswordUpdater.jsx";
import PageNotFound from "./src/Page/PageNotFound/PageNotFound.jsx";
import PublicOnlyRoute from "./src/components/ProtectRoute/PublicOnlyRoute.jsx";


function Routing() {
  return (
    // const verificationLink = `${baseURL}/users/verify/${base64EncodedJWT}/${base64EncodedKey}/${base64EncodedIV}`;
    <Routes>
      <Route element={PublicOnlyRoute}>
    <Route path="/emailforpassword" element={<LayOut showFooter={true} showHeader={true}><EmailForPassword/></LayOut>} />
    <Route path="/reset-password/:userId" element={<LayOut showFooter={true} showHeader={true}><PasswordUpdater/></LayOut>} />
      </Route>
    <Route path="/signupLogIn" element={<PublicOnlyRoute><LayOut showFooter={true} showHeader={true}><DashBoard/></LayOut></PublicOnlyRoute>} />
    {/* Protected route for authenticated users */}
    <Route element={<PrivateRoute />}>
    <Route path="/" element={<LayOut showFooter={true} showHeader={true}><ProjectSubmissionPage/></LayOut>} />
      <Route path="/submitdb" element={<LayOut showFooter={true} showHeader={true}><ProjectSubmissionPage /></LayOut>} />
      <Route path="/forAdmin" element={<LayOut showFooter={true} showHeader={true}><Admin /></LayOut>}/>
      <Route path="*" element={<LayOut showFooter={true} showHeader={true}><PageNotFound /></LayOut>}/>
    </Route>
  </Routes>
  );
}

export default Routing;
