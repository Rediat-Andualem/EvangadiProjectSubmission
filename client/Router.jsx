import React from "react";
import {
  Routes,
  Route
} from "react-router-dom";
import DashBoard from "./src/Page/LandingPage/Dashboard.jsx";
import LayOut from "./src/components/LayOut/LayOut.jsx"
import ProjectSubmissionPage from "./src/Page/ProjectPage/ProjectSubmissionPage.jsx";
import PrivateRoute from './src/components/ProtectRoute/PrivateRoute.jsx'



function Routing() {
  return (
    // const verificationLink = `${baseURL}/users/verify/${base64EncodedJWT}/${base64EncodedKey}/${base64EncodedIV}`;
    <Routes>
    <Route path="/" element={<LayOut showFooter={true} showHeader={true}><DashBoard/></LayOut>} />
    <Route path="/signupLogIn" element={<LayOut showFooter={true} showHeader={true}><DashBoard/></LayOut>} />
 

    {/* Protected route for authenticated users */}
    <Route element={<PrivateRoute />}>
      <Route path="/submitdb" element={<LayOut showFooter={true} showHeader={true}><ProjectSubmissionPage /></LayOut>} />
    </Route>
  </Routes>
  );
}

export default Routing;
