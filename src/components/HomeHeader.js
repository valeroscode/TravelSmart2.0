import "./styles/homeHeader.css";
import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faPlaneDeparture,
  faMagnifyingGlassLocation,
} from "@fortawesome/free-solid-svg-icons";
import { allPlaces } from "./allMarkers.mjs";
import { useAuth } from "./contexts/AuthContext";

function HomeHeader({ name }) {
  const account = useRef();
  const { currentUser, logout } = useAuth();
  const [places_InCity, setPlaces_InCity] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    allPlaces.map((place) =>
      !cities.includes(place.city) ? cities.push(place.city) : null
    );
    setCities(cities);
    setTimeout(() => {
      document.getElementById("users-name").style.opacity = 1;
    }, 500);
    if (window.location.pathname === "/#/home") {
      window.addEventListener("click", (e) => {
        setTimeout(() => {
          searchBar.handleClicksOutside_ofInputs(e);
        }, 200);
      });
    }
  }, []);

  async function handleLogout() {
    try {
      await logout();
      window.location.replace("http://localhost:3000/");
    } catch (e) {
      console.log(e.error);
      alert("logout failed");
    }
  }

  const cityInput = useRef();
  const searchInput = useRef();
  const cityDD = useRef();
  const searchDD = useRef();

  const searchBar = {
    handleRenderingDropdown: function (e) {
      //if either of the search bars are clicked
      if (e.target === searchInput.current || e.target === cityInput.current) {
        const dropdown = e.target.nextElementSibling;
        if (dropdown.style.display === "flex") {
          return;
        }

        if (e.target === searchInput.current) {
          const arr = [];
          allPlaces.map((place) =>
            !arr.includes(place.style) ? arr.push(place.style) : null
          );
          allPlaces.map((place) =>
            !arr.includes(place.category) ? arr.push(place.category) : null
          );
          setPlaces_InCity(arr);
        }
        dropdown.style.display = "flex";
      }
    },
    handleClicksOutside_ofInputs: function (e) {
      if (e.target !== searchInput.current && e.target !== cityInput.current) {
        if (cityDD && searchDD) {
          cityDD.current.style.display = "none";
          searchDD.current.style.display = "none";
        }
      } else {
        return;
      }
    },
    handleDropdownClicks: function (e) {
      const input = e.target.closest("#city-search-DD");
      if (input) {
        e.target.parentNode.previousSibling.value = e.target.textContent;
        cityDD.current.style.display = "none";
      } else {
        e.target.parentNode.previousSibling.value = e.target.textContent;
        searchDD.current.style.display = "none";
      }
    },
  };

  function searchPlaces(e) {
    sessionStorage.setItem("city", cityInput.current.value);
    if (searchInput.current.value !== "" && cityInput.current.value !== "") {
      document.body.append(document.getElementById("google-map"));
      const str = searchInput.current.value.toString();
      sessionStorage.setItem("filters", str.toUpperCase());
      sessionStorage.setItem("total", 1);
      window.location.replace(
        "https://travelsmart2-0.onrender.com/Search-Results"
      );
    } else {
      alert("Input fields incomplete");
    }
  }

  function openTripCreator() {
    document.getElementById("new-trip").style.display = "flex";
    setTimeout(() => {
      document.getElementById("new-trip").style.opacity = "1";
    }, 100);
  }

  return (
    <>
      <div id="home-title">
        <div id="home-h1">
          <FontAwesomeIcon icon={faPaperPlane} className="plane" />
          <h1>TRAVEL SMART</h1>
        </div>
        <div id="homesearch">
          <div
            className="first-input"
            onClick={(e) => searchBar.handleRenderingDropdown(e)}
          >
            <div id="search-bar-wrapper">
              <div id="place-search-div">
                <input
                  autoComplete="off"
                  type="text"
                  ref={searchInput}
                  id="city-place-search"
                  placeholder={
                    window.innerWidth > 1300
                      ? "Resturant, miami beach, etc."
                      : "Sushi, Coffee, etc."
                  }
                />
                <div
                  id="place-search-DD"
                  ref={searchDD}
                  onClick={(e) => searchBar.handleDropdownClicks(e)}
                >
                  {places_InCity.map((place) => (
                    <p className="place city">{place}</p>
                  ))}
                </div>
              </div>
              <div id="city-search-div">
                <input
                  autoComplete="off"
                  type="text"
                  ref={cityInput}
                  id="place-search"
                  placeholder="Choose your city"
                />
                <div
                  id="city-search-DD"
                  ref={cityDD}
                  onClick={(e) => searchBar.handleDropdownClicks(e)}
                >
                  {cities.map((city) => (
                    <p className="place city">{city}</p>
                  ))}
                </div>
              </div>

              <div className="home-search-btn" onClick={searchPlaces}>
                <FontAwesomeIcon icon={faMagnifyingGlassLocation} />
              </div>
            </div>
            <div id="acc-and-trip">
              <button
                onClick={() => openTripCreator()}
                className="tripsBtn"
                value="My Trips"
              >
                Create Trip&nbsp;&nbsp;
                <FontAwesomeIcon icon={faPlaneDeparture} />
              </button>
              <div ref={account} className="account">
                {currentUser ? (
                  <div className="user-name">
                    <p id="users-name">Hello, {name}</p>
                    <button onClick={() => handleLogout()}>Log Out</button>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default HomeHeader;
