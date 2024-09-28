import React, { useContext, useState, useEffect, createContext } from "react";
import { useCookies } from "react-cookie";
import { generalScript } from "../Miami.mjs";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const [currentUser, setCurrentUser] = useState({});
  const [defCity, setDefCity] = useState('');
  const [allPlaces, setAllPlaces] = useState([]);
  const [allPlaces_Global, setAllPlaces_Global] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cookies.access_token && window.location.pathname !== "/login") {
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
          setDefCity(data.user.defcity);
        })
        .catch((err) => {
          console.error(err);
        });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const places = []
    if (defCity !== '') {
    fetch("http://localhost:8080/places", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + cookies.access_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city: '',
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAllPlaces_Global(data)
        places.push(data)
      })
      .catch((err) => {
        console.error(err);
      });

      const inCity = []

      console.log(places)

      for (let i = 0; i < places.length; i++) {
        if (String(places[i].city).toLocaleLowerCase === String(defCity).toLocaleLowerCase) {
          inCity.push(places[i])
        }
      }

      console.log(inCity)

      setAllPlaces(inCity)
 
    }
  }, [defCity])

  useEffect(() => {

    if (allPlaces.length !== 0) {
      generalScript(allPlaces)
    }

  }, [allPlaces])

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
    allPlaces,
    allPlaces_Global,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
