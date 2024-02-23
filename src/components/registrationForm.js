import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import "./styles/signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { docMethods } from "./firebase/firebase";

function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signup, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
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
    console.log(emailRef.current.value);
    console.log(passwordRef.current.value);
    try {
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      let string = currentUser.email.toString();
      string = currentUser.metadata.createdAt + string.substring(0, 8);
      docMethods.newDoc(firstName, lastName, string);
      navigate("/Home");
    } catch {
      alert("failed to create an account");
    }

    setLoading(false);

    // const data = {
    //   firstName: firstName,
    //   lastName: lastName,
    //   email: email,
    //   password: hashedPassword,
    //   confirmPassword: hashedConfirmed,
    //   favorites: [],
    //   trips: {},
    // };

    // const dbRef = collection(db, "users");

    // addDoc(dbRef, data)
    //   .then((docRef) => {
    //     localStorage.setItem("Key", docRef);
    //     let inputUrl = new URL(
    //       "https://storage.cloud.google.com/maps_project_1/Miami.html"
    //     );
    //     let inputParams = new URLSearchParams(inputUrl.search);
    //     inputParams.append("user", `${email}`);
    //     window.location.replace(inputUrl + "?" + inputParams);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  return (
    <>
      <div id="body">
        <div id="login">
          <h1 className="signupH1">SIGN UP</h1>

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
              style={{ WebkitTextSecurity: "circle" }}
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
          <div id="pw">
            <input
              id="confirmPassword"
              className="signup-field"
              {...register("confirmPassword", {
                required: true,
                validate: { minLength: (v) => v.length >= 8 },
              })}
              type="text"
              placeholder="Re-type password"
              style={{ WebkitTextSecurity: "circle" }}
              onChange={(e) => handleInputChange(e)}
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
        <div id="NoAcc-signup">
          <p className="AL">Already have an account?</p>

          <button className="loginBtn">
            <Link to="/login">Log In</Link>
          </button>
        </div>
      </div>
    </>
  );
}
export default Signup;
