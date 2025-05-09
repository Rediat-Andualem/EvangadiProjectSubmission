import React, { useContext, useEffect, useState } from 'react'
import './LogInSignUp.css'

import { Form, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { axiosInstance } from '../../Utility/axios'
import jwt_decode from "jwt-decode";
function Login() {
    const [type, setType] = useState("password");
    const [response, setResponse] = useState()
    const [icon, setIcon] = useState(eyeOff);
    const [form, setform] = useState({
        email:'',
        password:''
    })
    const navigate = useNavigate()

    useEffect(() => {
      if(userData.user){
         navigate('/home')
      }
    }, [userData,navigate])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const loginRes = await axios.post('http://localhost:4000/user/login',{
                email : form.email,
                password:form.password
            }).then((data)=>{
              console.log(data.data)
                if(data.data.token===undefined){
                  setResponse(data.data)
                }else{
                  let decodedToken =jwt_decode(data.data.token) 
                  setUserData({
                      token : data.data.token,
                      user: decodedToken.display_name
                  })
                  localStorage.setItem('token',data.data.token)
                  navigate('/home')
                }
            })
        } catch (error) {
            console.log(error.message)
        }
      };
      let handleChange = (e) => {
        switch (e.target.name) {
          case "user_email":
            setform((pre) => {
              return { ...pre, email: e.target.value };
            });
            break;
          case "user_password":
            setform((pre) => {
              return { ...pre, password: e.target.value };
            });
            break;
          default:
            break;
        }
      };
      const HandleIconChange = () => {
        // event listenforPassworder function
        if (type === "password") {
          setIcon(eye);
          setType("text");
        } else {
          setIcon(eyeOff);
          setType("password");
        }
      };

      console.log(userData)
if(response){
  return<div className="forSuccessPa">
  <h1 className="thankYou">{response.messageToTheFront}</h1>
  <a className="thankYouAnch" href={response.navigation}>
    {response.messageToUser}
  </a>
</div>

}else{
  return (
    <div className="container py-5 d-md-flex justify-content-between login_container">
      <div className="main col-12 col-md-6 me-md-2 p-5 d-flex flex-column justify-content-center">
        <p className="p1">Evangadi stack overflow</p>
        <p className="p2 text-center">
          Don't have an account? <br />
          <Link to="/signup" className="a3">
            {" "}
            Create a new account
          </Link>
        </p>
        <form onSubmit={handleSubmit}>
          <input
            className="in1"
            type="email"
            name="user_email"
            placeholder="Your Email"
            required
            autoComplete="new-password"
            onChange={handleChange}
          />
          <input
            className="in1"
            type={type}
            name="user_password"
            placeholder="Your Password"
            required
            autoComplete="new-password"
            onChange={handleChange}
          />
          <span className="showHide1">
            <Icon icon={icon} size={20} onClick={HandleIconChange} className="iconss"/>
          </span>
          <button className="btn1">submit</button>
        </form>
    
        <Link to="/forgotPass" className="a3 a1">
          Forgot password ?
        </Link> 
        <br/>
        <Link to="/signup" className="a3 a1 my-3">
        Click Here To Create an Account?
        </Link>
    </div>
    <div className="sideNote2 container col-12 col-md-6 ms-md-2 mt-sm-5">
          <p className="forTitle">About</p>
          <h1>Evangadi Networks Q&A</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem voluptate officiis beatae nobis pariatur omnis facere accusamus laboriosam hic, adipisci vero reiciendis, recusandae sit ad, eum quisquam! Molestias, ut commodi!</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem voluptate officiis beatae nobis pariatur omnis facere accusamus laboriosam hic, adipisci vero reiciendis, recusandae sit ad, eum quisquam! Molestias, ut commodi!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam ipsum, provident minus laudantium esse soluta maiores nostrum nisi sunt perferendis dolorum. Praesentium necessitatibus quia consectetur sunt tempora possimus eveniet voluptates?</p>

        </div>
    </div>
      )
}
}

export default Login

{/* <div className="container me-5 vh-100"> */}