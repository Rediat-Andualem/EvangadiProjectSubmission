import { useState, useEffect } from "react";
import "./LogInSignUp.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/axiosInstance";
import useSignIn from 'react-auth-kit/hooks/useSignIn'
import {jwtDecode} from 'jwt-decode'
function LogInSignUp({errorStatus}) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();
  const signIn = useSignIn()

  useEffect(() => {
    if(errorStatus==='SIGN IN TO YOUR ACCOUNT'){
      setError(false); 
    } else if(errorStatus==='CREATE A NEW ACCOUNT'){
      setError(false); 
    }

  }, [errorStatus]);
  // Form states
  const [signupData, setSignupData] = useState({
    userName: "",
    email: "",
    password: "",
    sq1: "",
    sqa1: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Fetch all security questions on component mount
  useEffect(() => {
    getAllQuestions();
  }, []);

  const getAllQuestions = async () => {
    try {
      const res = await axiosInstance.get("/users/getSecurityQuestions");
      setQuestions(res?.data?.allQuestions || []);
    } catch (err) {
      setError(err?.response?.data?.errors || "Failed to fetch questions.");
    }
  };

  // Handle signup form change
  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // Handle login form change
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Signup function
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axiosInstance.post("/users/createUser", signupData);
      setSuccess(res?.data?.message);
      setSignupData({ userName: "", email: "", password: "", sq1: "", sqa1: "" });
    } catch (err) {
      console.log(err)
      setError(err?.response?.data?.errors || "Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axiosInstance.post("/users/login", loginData);
      console.log(res)
      const token = res.headers['authorization']?.split(' ')[1]
     const decodedToken = jwtDecode(token)
     if (token) {
      if (signIn({
        auth: {
          token,
          type: 'Bearer',
          expiresIn: 4320,    
        },
        userState: {
          userNameId: decodedToken.userNameId,
          userName: decodedToken.userName,
          userRole: decodedToken.role,
          email:decodedToken.email
        },
      })) {
        navigate("/main");
      } else {
        navigate('/signUp');
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
                  data-bs-slide="prev"
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
                    name="email"
                    placeholder="Email address"
                    value={loginData.email}
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
                    {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                  </span>
                </div>
                <div className="forgot">
                  <Link to="/forgotPassword">Forgot password?</Link>
                </div>
                <div className="btn-login">
                  <button disabled={loading} type="submit">
                    {loading ? "Logging in..." : "Login"}
                  </button>
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
                  data-bs-slide="next"
                >
                  Sign in
                </span>
              </div>

              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}

              <form onSubmit={handleSignup}>
                <div className="form-input">
                  <input
                    name="userName"
                    type="text"
                    placeholder="User Name"
                    value={signupData.userName}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <div className="form-input">
                  <input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <div className="row">
                  <div className="form-input col-md-6">
                    <select
                      name="sq1"
                      value={signupData.sq1}
                      onChange={handleSignupChange}
                      required
                    >
                      <option value="">Select security question</option>
                      {questions?.map((q) => (
                        <option key={q.UserSecurityQuestionId} value={q.UserSecurityQuestion}>
                          {q.UserSecurityQuestion}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-input col-md-6">
                    <input
                      name="sqa1"
                      type="text"
                      placeholder="Answer for security question"
                      value={signupData.sqa1}
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
                    {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
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
