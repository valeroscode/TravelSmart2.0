import React, { useContext, useState, useEffect, createContext } from "react";
import { useCookies } from "react-cookie";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const [currentUser, setCurrentUser] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cookies.access_token && window.location.pathname !== "/login") {
      alert(true)
      fetch("http://localhost:8080/getUserData", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + cookies.access_token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setCurrentUser(data.user);
          console.log(data.user)
        })
        .catch((err) => {
          console.error(err);
        });
        setLoading(false);
    }
  }, []);

  function login(username, password) {
    fetch("http://localhost:8080/getUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    })
      .then((response) => {
        console.log(response)
        if (response.ok) {
        return response.json();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .then((data) => {
        setCookie("access_token", data.token);
        setCurrentUser(data.user);
        window.location.replace('http://localhost:8080/home')
      })
      .catch((error) => {
        alert('invalid credentials')
  });
  }

  function logout() {
    removeCookie("access_token")
  }

  const value = {
    currentUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
