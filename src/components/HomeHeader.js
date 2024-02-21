import "./styles/homeHeader.css";
import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faPlaneDeparture,
  faMagnifyingGlassLocation,
} from "@fortawesome/free-solid-svg-icons";
import allPlaces from "./allMarkers.mjs";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { learnMoreAboutPlace, placePageSuggestions } from "./getPlaceInfo.mjs";

function HomeHeader() {
  const account = useRef();
  const { currentUser, info, logout } = useAuth();

  const [firstname, setFirstname] = useState("");
  const [places_InCity, setPlaces_InCity] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const settingName = () => {
        if (info.name) {
          setFirstname(info.name);
        } else {
          setTimeout(settingName(), 200);
        }
      };

      allPlaces.map((place) =>
        !cities.includes(place.city) ? cities.push(place.city) : null
      );
      setCities(cities);
    }

    window.addEventListener("click", (e) => {
      setTimeout(() => {
        searchBar.handleClicksOutside_ofInputs(e);
      }, 200);
    });
  }, []);

  const [error, setError] = useState("");

  async function handleLogout() {
    setError("");
    try {
      await logout();
    } catch {
      setError("Failed to log out");
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
          if (cityInput.current.value === "") {
            allPlaces.map((place) =>
              !arr.includes(place.style) ? arr.push(place.style) : null
            );
            allPlaces.map((place) =>
              !arr.includes(place.type) ? arr.push(place.type) : null
            );
            setPlaces_InCity(arr);
          } else if (cityInput.current.value !== "") {
            for (let i = 0; i < allPlaces.length; i++) {
              if (allPlaces[i].city === cityInput.current.value) {
                if (!arr.includes(allPlaces[i].style)) {
                  arr.push(allPlaces[i].style);
                } else if (!arr.includes(allPlaces[i].type)) {
                  arr.push(allPlaces[i].type);
                }
              }
            }
            setPlaces_InCity(arr);
          }
        }
        dropdown.style.display = "flex";
      }
    },
    handleClicksOutside_ofInputs: function (e) {
      if (e.target !== searchInput.current && e.target !== cityInput.current) {
        cityDD.current.style.display = "none";
        searchDD.current.style.display = "none";
      } else {
        return;
      }
    },
    handleDropdownClicks: function (e) {
      const input = e.target.closest(".placeInCity");
      if (input) {
        if (
          input.parentNode.previousSibling === searchInput.current &&
          cityInput.current.value !== ""
        ) {
          input.parentNode.previousSibling.value = input.getAttribute("place");
        }
      } else {
        e.target.parentNode.previousSibling.value = e.target.textContent;
      }
    },
  };

  function searchPlaces(e) {
    sessionStorage.setItem("city", cityInput.current.value);
    if (searchInput.current.value !== "" && cityInput.current.value !== "") {
      const str = searchInput.current.value.toString();
      sessionStorage.setItem("filters", str.toUpperCase());
      sessionStorage.setItem("total", 1);
      window.location.replace("Search-Results");
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
                    <p>Hello, {firstname}</p>
                    <button onClick={() => handleLogout()}>
                      <Link to="/login">Log Out</Link>
                    </button>
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
