import { useState, useEffect } from "react";
import "./LogInSignUp.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/axiosInstance";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { jwtDecode } from "jwt-decode";

function LogInSignUp({ errorStatus }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();
  const signIn = useSignIn();

  useEffect(() => {
    if (
      errorStatus === "SIGN IN TO YOUR ACCOUNT" ||
      errorStatus === "CREATE A NEW ACCOUNT"
    ) {
      setError(false);
    }
  }, [errorStatus]);

  const [signupData, setSignupData] = useState({
    userFirstName: "",
    userLastName: "",
    userEmail: "",
    userPhoneNumber: "",
    Group: "",
    Batch: "",
    Year: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    userEmail: "",
    password: "",
  });

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // const handleSignup = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  //   setSuccess(null);

  //   const nameRegex = /^[A-Za-z]+$/;
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   const phoneRegex = /^\+\d{6,15}$/;

  //   if (
  //     !nameRegex.test(signupData.userFirstName) ||
  //     signupData.userFirstName.length > 15
  //   ) {
  //     setError(
  //       "First name should contain only letters and not exceed 15 characters."
  //     );
  //     return;
  //   }

  //   if (
  //     !nameRegex.test(signupData.userLastName) ||
  //     signupData.userLastName.length > 15
  //   ) {
  //     setError(
  //       "Last name should contain only letters and not exceed 15 characters."
  //     );
  //     return;
  //   }

  //   if (!emailRegex.test(signupData.userEmail)) {
  //     setError("Please enter a valid email address.");
  //     return;
  //   }

  //   if (!phoneRegex.test(signupData.userPhoneNumber)) {
  //     setError(
  //       "Phone number must start with a country code '+1345... or +251.."
  //     );
  //     return;
  //   }

  //   if (signupData.password.length < 6) {
  //     setError("Password must be at least 6 characters long.");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const res = await axiosInstance.post("/users/createUser", signupData);
  //     // setSuccess(res?.data?.message);
  //     setSignupData({
  //       userFirstName: "",
  //       userLastName: "",
  //       userEmail: "",
  //       userPhoneNumber: "",
  //       Group: "",
  //       Batch: "",
  //       Year: "",
  //       password: "",
  //     });

  //     const token = res.headers["authorization"]?.split(" ")[1];
  //     const decodedToken = jwtDecode(token);

  //     if (token) {
  //       if (
  //         signIn({
  //           auth: {
  //             token,
  //             type: "Bearer",
  //             expiresIn: 4320,
  //           },
  //           userState: {
  //             userId: decodedToken.userId,
  //             userEmail: decodedToken.userEmail,
  //             userName: decodedToken.userFirstName,
  //             role: decodedToken.role,
  //             authStatus: true,
  //           },
  //         })
  //       ) {
  //         navigate("/submitdb");
  //       } else {
  //         navigate("/");
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     setError(
  //       err?.response?.data?.errors || "Signup failed, please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedSignupData = {
      ...signupData,
      userFirstName: signupData.userFirstName.trim(),
      userLastName: signupData.userLastName.trim(),
      userEmail: signupData.userEmail.trim(),
      userPhoneNumber: signupData.userPhoneNumber.trim(),
      Group: signupData.Group.trim(),
      Batch: signupData.Batch.trim(),
      Year: signupData.Year.toString().trim(),
    };

    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+\d{6,15}$/;

    if (
      !nameRegex.test(trimmedSignupData.userFirstName) ||
      trimmedSignupData.userFirstName.length > 15
    ) {
      setError(
        "First name should contain only letters and not exceed 15 characters."
      );
      return;
    }

    if (
      !nameRegex.test(trimmedSignupData.userLastName) ||
      trimmedSignupData.userLastName.length > 15
    ) {
      setError(
        "Last name should contain only letters and not exceed 15 characters."
      );
      return;
    }

    if (!emailRegex.test(trimmedSignupData.userEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!phoneRegex.test(trimmedSignupData.userPhoneNumber)) {
      setError(
        "Phone number must start with a country code '+1345... or +251.."
      );
      return;
    }

    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post(
        "/users/createUser",
        trimmedSignupData
      );

      setSignupData({
        userFirstName: "",
        userLastName: "",
        userEmail: "",
        userPhoneNumber: "",
        Group: "",
        Batch: "",
        Year: "",
        password: "",
      });

      const token = res.headers["authorization"]?.split(" ")[1];
      const decodedToken = jwtDecode(token);

      if (token) {
        if (
          signIn({
            auth: {
              token,
              type: "Bearer",
              expiresIn: 4320,
            },
            userState: {
              userId: decodedToken.userId,
              userEmail: decodedToken.userEmail,
              userName: decodedToken.userFirstName,
              role: decodedToken.role,
              authStatus: true,
            },
          })
        ) {
          navigate("/submitdb");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.errors || "Signup failed, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);
  //   setSuccess(null);

  //   try {
  //     const res = await axiosInstance.post("/users/login", loginData);
  //     const token = res.headers["authorization"]?.split(" ")[1];
  //     const decodedToken = jwtDecode(token);

  //     if (token) {
  //       if (
  //         signIn({
  //           auth: {
  //             token,
  //             type: "Bearer",
  //             expiresIn: 4320,
  //           },
  //           userState: {
  //             userId: decodedToken.userId,
  //             userEmail: decodedToken.userEmail,
  //             userName: decodedToken.userFirstName,
  //             role: decodedToken.role,
  //             authStatus: true,
  //           },
  //         })
  //       ) {
  //         navigate("/submitdb");
  //       } else {
  //         navigate("/");
  //       }
  //     }
  //   } catch (err) {
  //     setError(err?.response?.data?.message || "Invalid email or password");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const trimmedLoginData = {
      userEmail: loginData.userEmail.trim(),
      password: loginData.password,
    };

    try {
      const res = await axiosInstance.post("/users/login", trimmedLoginData);
      const token = res.headers["authorization"]?.split(" ")[1];
      const decodedToken = jwtDecode(token);

      if (token) {
        if (
          signIn({
            auth: {
              token,
              type: "Bearer",
              expiresIn: 4320,
            },
            userState: {
              userId: decodedToken.userId,
              userEmail: decodedToken.userEmail,
              userName: decodedToken.userFirstName,
              role: decodedToken.role,
              authStatus: true,
            },
          })
        ) {
          navigate("/submitdb");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginSignUp">
      <div id="carouselExample" className="carousel slide">
        <div className="carousel-inner">
          {/* Login Section */}
          <div className="carousel-item active">
            <div className="login">
              <h5>Login to your account</h5>
              <div>
                Don’t have an account?{" "}
                <span
                  className="spn-signupIn"
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide="next"
                  onClick={() => {
                    setError(null);
                    setSuccess(null);
                  }}
                >
                  Create a new account
                </span>
              </div>

              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}

              <form onSubmit={handleLogin}>
                <div className="form-input">
                  <input
                    type="email"
                    name="userEmail"
                    placeholder="Email address"
                    value={loginData.userEmail}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <div className="form-input password">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />
                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <AiOutlineEye />
                    ) : (
                      <AiOutlineEyeInvisible />
                    )}
                  </span>
                </div>
                <div className="btn-login">
                  <button disabled={loading} type="submit">
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
                <div className="d-flex justify-content-end mt-2">
                  <Link to="/emailforpassword" className="spn-signupIn">
                    Forgot password?
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Signup Section */}
          <div className="carousel-item">
            <div className="register">
              <h5>Join the network</h5>
              <div>
                Already have an account?{" "}
                <span
                  className="spn-signupIn"
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide="prev"
                  onClick={() => {
                    setError(null);
                    setSuccess(null);
                  }}
                >
                  Sign In
                </span>
              </div>

              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}

              <form onSubmit={handleSignup}>
                <div className="row">
                  <div className="form-input col-md-6">
                    <input
                      name="userFirstName"
                      type="text"
                      placeholder="First Name"
                      value={signupData.userFirstName}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  <div className="form-input col-md-6">
                    <input
                      name="userLastName"
                      type="text"
                      placeholder="Last Name"
                      value={signupData.userLastName}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-input">
                  <input
                    name="userEmail"
                    type="email"
                    placeholder="Email address"
                    value={signupData.userEmail}
                    onChange={handleSignupChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="form-input col-md-6">
                    <select
                      name="Group"
                      value={signupData.Group}
                      onChange={handleSignupChange}
                      required
                    >
                      <option value="" disabled>
                        Select Group
                      </option>
                      <option value="Group 1">Group 1</option>
                      <option value="Group 2">Group 2</option>
                      <option value="Group 3">Group 3</option>
                      <option value="Group 4">Group 4</option>
                    </select>
                  </div>
                  <div className="form-input col-md-6">
                    <select
                      name="Batch"
                      value={signupData.Batch}
                      onChange={handleSignupChange}
                      required
                    >
                      <option value="" disabled>
                        Select Batch (Month)
                      </option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="form-input col-md-6">
                    <input
                      name="Year"
                      type="number"
                      placeholder="Year"
                      value={signupData.Year}
                      onChange={handleSignupChange}
                      min="2000"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>
                  <div className="form-input col-md-6">
                    <input
                      name="userPhoneNumber"
                      type="text"
                      placeholder="Phone Number"
                      value={signupData.userPhoneNumber}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-input password">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                  />
                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <AiOutlineEye />
                    ) : (
                      <AiOutlineEyeInvisible />
                    )}
                  </span>
                </div>

                <div className="btn-login">
                  <button disabled={loading} type="submit">
                    {loading ? "Signing up..." : "Create account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogInSignUp;
