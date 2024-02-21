import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./styles/login.css";
import { Link } from "react-router-dom";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Signup from "./registrationForm";
import { useAuth } from "./contexts/AuthContext";
import { docMethods } from "./firebase/firebase";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [emailErr, setEmailErr] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "emaillogin") {
      setEmail(value);
    }
    if (id === "passwordfield-login") {
      setPassword(value);
    }
  };

  async function OnLogin(email, password) {
    try {
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("Home");
    } catch {
      alert("failed to login");
    }

    setLoading(false);
  }

  return (
    <>
      <div id="body">
        <div id="login">
          <div className="signupH1">
            <h1>TRAVEL SMART </h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
            >
              <style>svg{"fill:#000000;position=relative; top=0.5rem "}</style>
              <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
            </svg>
          </div>
          <div id="username-login">
            <input
              type="text"
              placeholder="Email"
              name="email"
              id="emaillogin"
              {...register("email", {
                required: true,
                validate: {
                  minLength: (v) => v.length <= 50,
                  matchPattern: (v) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                    "Email address must be a valid address",
                },
              })}
              ref={emailRef}
              onChange={(e) => handleInputChange(e)}
            />
            <p className="errorEmail">{emailErr}</p>
            {errors.email?.type === "required" && (
              <p className="error">Email is required</p>
            )}
            {errors.email?.type === "matchPattern" && (
              <p className="error">Email must be valid</p>
            )}
          </div>
          <div id="pwlogin">
            <input
              type="text"
              placeholder="Password"
              style={{ WebkitTextSecurity: "circle" }}
              name="password"
              id="passwordfield-login"
              {...register("password", {
                required: true,
                validate: { minLength: (v) => v.length >= 8 },
              })}
              ref={passwordRef}
              onChange={(e) => handleInputChange(e)}
            />
            {errors.password?.type === "required" && (
              <p className="error">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="error">Password must be atleast 8 characters</p>
            )}
          </div>
          <button
            id="loginBtn"
            type="submit"
            onClick={() => OnLogin(email, password)}
          >
            LOG IN
          </button>
          {/* <a>
            <Link to="forgotPW.js">
              <p className="FP">Forgot Password?</p>
            </Link>
          </a> */}
          <p style={{ color: "black", fontWeight: 800 }} className="trailAcc">
            🛫 DEMO ACCOUNT: 🛬 <br /> 👉 EMAIL: avalero1112ee@gmail.com 👈{" "}
            <br /> 🙊 PASSWORD: 12345678 🙊
          </p>
        </div>

        <div id="NoAcc">
          <p className="FP">Don't Have An Account?</p>
          <button className="gtsignup-Btn">
            {/*             <Link to="/Signup">Sign Up</Link> */}
          </button>
        </div>
      </div>
    </>
  );
}
export default LoginForm;
