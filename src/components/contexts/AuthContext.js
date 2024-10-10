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
  const [defCity, setDefCity] = useState('Miami');
  const [allPlaces, setAllPlaces] = useState([]);
  const [allPlaces_Global, setAllPlaces_Global] = useState([]);
  const [trips, setTrips] = useState({})

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cookies.access_token && window.location.pathname !== "/login" && window.location.pathname !== '/') {
        //Checks if access token is expired
        console.log('RENDERRRR')
        const payload = JSON.parse(atob(cookies.access_token.split('.')[1]));
        const exp = payload.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        if (exp < now) {
          //if it is, redirect to login page
          window.location.replace('http://localhost:8080/login')
          return
        }
        //If the user is logged in, get ALL places, which triggers the useEffect for defcity
        fetch("http://localhost:8080/places", {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + cookies.access_token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "city": "",
          }),
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            setAllPlaces_Global(data)
            console.log(allPlaces_Global)
          })
          .catch((err) => {
            console.error(err);
          }); 

          //THEN get their user data
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
              setTrips(data.user.trips)
            })
            .catch((err) => {
              console.error(err);
            });
    } else {
      setLoading(false);
    }
  }, []);

  //Now the places in their default city will be populated
  useEffect(() => {
    if (defCity !== '' && allPlaces_Global.length !== 0) {
      const places = []
      for (let i = 0; i < allPlaces_Global.length; i++) {
        if (String(allPlaces_Global[i].city).toLocaleLowerCase() === String(defCity).toLocaleLowerCase()) {
          places.push(allPlaces_Global[i])
        }
      }
      console.log(allPlaces_Global)
      setAllPlaces(places)
    }
  }, [defCity, allPlaces_Global])

  useEffect(() => {
    if (allPlaces.length !== 0) {
      setLoading(false);
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
    defCity,
    trips,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
