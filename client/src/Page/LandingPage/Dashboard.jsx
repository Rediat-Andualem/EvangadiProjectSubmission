import React, { useState } from "react";
import "./DashBoard.css";
import LogInSignUp from "../LogInSignUp/LogInSignUp";
// import aspirePic from "../../images/aspire 2.jpg"
function Dashboard() {
  const [buttonText, setbuttonText] = useState(true);
  const [hideError, setHideError] = useState();

  let textChanger = () => {
    buttonText ? setbuttonText(false) : setbuttonText(true);
    buttonText
      ? setHideError("CREATE A NEW ACCOUNT")
      : setHideError("SIGN IN TO YOUR ACCOUNT");
  };
  return (
    <div className="mainSection">
      <div className="container px-md-5">
        <div className="d-flex">
          <div className="col-12 col-md-6 shadow auth mx-md-4 ">
            {/* <p className="text-danger">{state.alert}</p> */}
            <div className="">
              <LogInSignUp errorStatus={hideError} />
            </div>
          </div>
          <div className="d-none d-md-block col-12 col-md-6 explained">
            <h1 className="text-gradient">
              Welcome To Evangadi Project Submission Portal!
            </h1>
            <ul>
              <li>Ensure all your information is correct before submitting.</li>
              <li>
                Use the same information you provided during registration.
              </li>
              <li>All projects must be submitted with a working link.</li>
              <li>All projects must be submitted before the deadline.</li>
       <li>Make sure to avoid unnecessary spacing, as it will be taken into consideration.</li>
            </ul>
            {/* <img className="forAspImg" src={aspirePic} alt="" /> */}
            {/* <button
						onClick={textChanger}
						type="button"
						className="CreateNewAcc"
						data-bs-target="#carouselExample"
						data-bs-slide="next"
						>
									{buttonText?'CREATE A NEW ACCOUNT': 'SIGN IN TO YOUR ACCOUNT'}
									
						</button>
						 */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
