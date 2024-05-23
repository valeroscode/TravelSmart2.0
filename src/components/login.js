import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./styles/login.css";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { setUser } from "../userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";

function LoginForm() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user);
  const [cookies, setCookies, removeCookie] = useCookies([
    "access_token",
    "has_account",
  ]);
  const dispatch = useDispatch();
  const emailRef = useRef();
  const passwordRef = useRef();

  const {
    register,
    formState: { errors },
  } = useForm();

  async function OnLogin() {
    await fetch("http://localhost:8080/getUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(setUser(data.user));
        setCookies("has_account", true);
        setCookies("access_token", data.token);
      })
      .then(() => {
        console.log(currentUser);
        navigate("/home");
        // window.location.replace("http://localhost:8080/home");
      })
      .catch((error) => console.error("Error:", error));
  }

  return (
    <>
      <div id="body">
        <div id="login-div-left">
          <div id="login-title">
            <h1>Explore. Discover. Plan.</h1>
          </div>
          <div id="login">
            <div className="signupH1">
              <div id="login-text">
                <h1>Login to your account</h1>
              </div>
              <div id="NoAcc">
                <p className="FP">Don't Have An Account?</p>
                <a className="gtsignup-Btn">
                  <Link to="/Signup">Sign Up</Link>
                </a>
              </div>
            </div>
            <div id="username-login">
              <input
                type="text"
                placeholder="Email"
                defaultValue="avalero1112ee@gmail.com"
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
              />
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
                defaultValue="12345678"
                style={{ WebkitTextSecurity: "circle" }}
                name="password"
                id="passwordfield-login"
                {...register("password", {
                  required: true,
                  validate: { minLength: (v) => v.length >= 8 },
                })}
                ref={passwordRef}
              />
              {errors.password?.type === "required" && (
                <p className="error">Password is required</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="error">Password must be atleast 8 characters</p>
              )}
            </div>
            <button id="loginBtn" type="submit" onClick={() => OnLogin()}>
              LOG IN
            </button>
            <p id="login-notice">
              *Login credentials have been filled in for your convenience
            </p>
          </div>
        </div>
        <div id="img-login-div">
          <img src="./login-img.jpg" id="login-img"></img>
        </div>
      </div>
    </>
  );
}
export default LoginForm;
