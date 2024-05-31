import React, { useContext, useState, useEffect, createContext } from "react";
import { useCookies } from "react-cookie";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [cookies, setCookie] = useCookies(["access_token"]);
  const [currentUser, setCurrentUser] = useState({
    name: "",
    favorites: [],
    trips: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cookies.access_token && window.location.pathname !== "trips") {
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
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setCurrentUser({
        name: "guest",
      });
    }
    setLoading(false);
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
        return response.json();
      })
      .then((data) => {
        setCookie("access_token", data.token);
        setCurrentUser(data.user);
      })
      .catch((error) => console.error("Error:", error));
  }

  const value = {
    currentUser,
    login,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
