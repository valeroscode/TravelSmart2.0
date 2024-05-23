import React, { useContext, useState, useEffect, createContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { docMethods, auth } from "../firebase/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  const [loading, setLoading] = useState(true);

  //Will be used across the application to get user information without having to make calls to the database
  const info = {
    name: "",
    favorites: [],
    trips: {},
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (currentUser) {
    if (info.name !== "") {
      return info;
    }
    let string = currentUser.email.toString();
    string = currentUser.metadata.createdAt + string.substring(0, 8);
    var promise = Promise.resolve(docMethods.getUserData(string));

    promise.then((result) => {
      //set the user info through changing the state of user
      info.name = result.name;
      info.favorites = result.favorites;
      info.trips = result.trips;
    });
  }

  function login(email, password) {
    fetch("http://localhost:8080/getUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
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
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    signOut(auth);
  }

  const value = {
    currentUser,
    signup,
    login,
    info,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
