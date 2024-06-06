import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { docMethods } from "./firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import icelandwaterfall from "./assets/icelandwaterfall.jpg";

function Signup() {

  const emailRef = useRef();
  const passwordRef = useRef();
  const { signup, currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
  } = useForm();

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "firstName") {
      setFirstName(value);
    }
    if (id === "lastName") {
      setLastName(value);
    }
    if (id === "email") {
      setEmail(value);
    }
    if (id === "password") {
      setPassword(value);
    }
    if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
  };
  const onSubmit = async () => {
    if (confirmPassword !== password) {
      alert("passwords don't match");
      return;
    }
    try {
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      setUser(true);
    } catch (err) {
      alert("An account with this email already exists");
      console.error(console.error(err));
    }
  };

  return (
    <>
      <div id="body">
        <div id="img-login-div" className="signup-con">
          <img src={icelandwaterfall} id="signup-img"></img>
        </div>
        <div id="login-div-left" className="signup-div-left">
          <div id="login-title">
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="plane-login"
            />
            <h1>Explore. Discover. Plan.</h1>
          </div>
          <div
            id="signup-general"
            style={window.innerWidth < 867 ? { right: 0 } : null}
          >
            <div className="signupH1">
              <div id="login-text">
                <h1>Create an account</h1>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                  fill="black"
                >
                  <style>
                    svg{"fill:#2E64FE;position=relative; top=0.5rem "}
                  </style>
                  <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                </svg>
              </div>
              <div id="NoAcc">
                <p className="FP">Already Have An Account?</p>
                <a className="gtsignup-Btn">
                  <Link to="/login">Log In</Link>
                </a>
              </div>
            </div>
            <div id="username">
              <input
                id="firstName"
                className="signup-field"
                {...register("firstName", { required: true })}
                type="text"
                placeholder="First Name"
                onChange={(e) => handleInputChange(e)}
              />
              {errors.firstName?.type === "required" && (
                <p className="error">Fist name is required</p>
              )}
            </div>
            <div id="username">
              <input
                id="lastName"
                className="signup-field"
                {...register("lastName", { required: true })}
                type="text"
                placeholder="Last Name"
                onChange={(e) => handleInputChange(e)}
              />
              {errors.lastName?.type === "required" && (
                <p className="error">Last name is required</p>
              )}
            </div>
            <div id="username">
              <input
                id="email"
                className="signup-field"
                {...register("email", {
                  required: true,
                  validate: {
                    minLength: (v) => v.length <= 50,
                    matchPattern: (v) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                      "Email address must be a valid address",
                  },
                })}
                type="text"
                placeholder="Email"
                ref={emailRef}
                onChange={(e) => handleInputChange(e)}
              />
              {errors.email?.type === "required" && (
                <p className="error">Email is required</p>
              )}
              {errors.email?.type === "matchPattern" && (
                <p className="error">Email must be valid</p>
              )}
            </div>
            <div id="pw">
              <input
                id="password"
                className="signup-field"
                {...register("password", {
                  required: true,
                  validate: { minLength: (v) => v.length >= 8 },
                })}
                type="text"
                placeholder="Password"
                ref={passwordRef}
                onChange={(e) => {
                  handleInputChange(e)
                  e.target.style.WebkitTextSecurity = "circle"
                  if (e.target.value === "") {
                    e.target.style.WebkitTextSecurity = "none"
                  }
                }}
              />
              {errors.password?.type === "required" && (
                <p className="error">Password is required</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="error">Password must be atleast 8 characters</p>
              )}
            </div>
            <div id="pw">
              <input
                id="confirmPassword"
                className="signup-field"
                {...register("confirmPassword", {
                  required: true,
                  validate: { minLength: (v) => v.length >= 8 },
                })}
                type="text"
                placeholder="Confirm Password"
                onChange={(e) => {
                  handleInputChange(e)
                  e.target.style.WebkitTextSecurity = "circle"
                  if (e.target.value === "") {
                    e.target.style.WebkitTextSecurity = "none"
                  }
                }}
              />
              {errors.confirmPassword?.type === "required" && (
                <p className="error">Confirmation is required</p>
              )}
              {errors.confirmPassword?.type === "minLength" && (
                <p className="error">Password must be at least 8 characters</p>
              )}
            </div>
            <button
              disabled={loading}
              id="signupSubmit"
              type="submit"
              onClick={onSubmit}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Signup;
