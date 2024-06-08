import "./styles/homeHeader.css";
import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faMagnifyingGlassLocation,
  faUser,
  faArrowRightFromBracket
} from "@fortawesome/free-solid-svg-icons";
import { allPlaces } from "./allMarkers.mjs";
import { useAuth } from "./contexts/AuthContext";
import { doc } from "firebase/firestore/lite";

function HomeHeader({ name }) {
  const account = useRef();
  const editUser = useRef();
  const { currentUser, logout } = useAuth();
  const [placesDropDown, setPlacesDropDown] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    allPlaces.map((place) =>
      !cities.includes(place.city) ? cities.push(place.city) : null
    );
    setCities(cities);
    setTimeout(() => {
      document.getElementById("users-name").style.opacity = 1;
    }, 500);
   

      window.addEventListener("click", (e) => {
          searchBarFunctions.handleClicksOutside_ofInputs(e);
          searchBarFunctions.hideEditUser(e)
      });
        
    
  }, []);

  function handleLogout() {
    logout();
    window.location.replace("http://localhost:3000/login");
  }

  const cityInput = useRef();
  const searchInput = useRef();
  const cityDD = useRef();
  const searchDD = useRef();

  const searchBarFunctions = {
    setDropdownContent: function (e) {
      const array = [];
      for (let i = 0; i < allPlaces.length; i++) {
        if (allPlaces[i].city === cityInput.current.value) {
        if (!array.includes(allPlaces[i].style)) {
          array.push(allPlaces[i].style)
        } else if (!array.includes(allPlaces[i].category)) {
          array.push(allPlaces[i].category)
        } else if (!array.includes(allPlaces[i].area)) {
          array.push(allPlaces[i].area)
        }
      }
      }
      setPlacesDropDown(array)
    },
    handleClicksOutside_ofInputs: function (e) {
   
      if (e.target !== searchInput.current && e.target !== cityInput.current) {
          cityDD.current.style.display = "none";
          searchDD.current.style.display = "none";
      }
    
  },
  hideEditUser: function (e) {
      
  }
  }

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

  function searchPlaces() {
    sessionStorage.setItem("city", cityInput.current.value);
    if (searchInput.current.value !== "" && cityInput.current.value !== "") {
      document.body.append(document.getElementById("google-map"));
      const str = String(searchInput.current.value);
      sessionStorage.setItem("filters", str.toUpperCase());
      sessionStorage.setItem("total", 1);
      window.location.replace(
        "http://localhost:3000/Search-Results"
      );
    } else {
      alert("Input fields incomplete");
    }
  }

  return (
    <>
      <div id="home-title">
        <div id="home-org">
      <div id="home-h1">
          <FontAwesomeIcon icon={faPaperPlane} className="plane" />
          <h1>TRAVEL SMART</h1>
        </div>

        <div id="home-searchbar">
        <div id="cityDD-input">
          <input ref={cityInput} placeholder="Choose A City" onClick={() => {
            cityDD.current.style.display = "flex"
          }} onKeyUp={(e) => {
             const city = document.getElementsByClassName("city-dd-item")
             const inputValue = String(e.target.value).toLocaleLowerCase();
             for (let i = 0; i < city.length; i++) {
              
              if (e.target.value === "") {
                city[i].style.display = "flex"
              } else {
             if (String(city[i].textContent).toLocaleLowerCase().includes(inputValue)) {
              city[i].style.display ="block"
             } else {
              city[i].style.display = "none"
             }
            }
            }
          }}></input>
          <ul ref={cityDD}>
            {
              cities.map((city) => (
                <li className="city-dd-item" onClick={(e) => {
                  cityInput.current.value = e.target.textContent;
                  cityDD.current.style.display = "none"
                  searchBarFunctions.setDropdownContent()
                }}>{city}</li>
              ))
            }
          </ul>
          </div>
          <div id="placeDD-input">
          <input ref={searchInput} placeholder="Sushi, Bars, Area"
          onClick={() => {
            searchDD.current.style.display = "flex"
          }}
          onKeyUp={(e) => {
            const place = document.getElementsByClassName("place-dd-item")
            const inputValue = String(e.target.value).toLocaleLowerCase();
            for (let i = 0; i < place.length; i++) {
             if (e.target.value === "") {
              place[i].style.display = "none"
              searchDD.current.style.display = "none"
             } else {
              
            if (String(place[i].textContent).toLocaleLowerCase().includes(inputValue)) {
              searchDD.current.style.display = "flex"
              place[i].style.display ="block"
            } else {
              place[i].style.display = "none"
            }
           }
           }
         }}></input>
          <ul ref={searchDD}>
            {
              placesDropDown.map((content) => (
                <li className="place-dd-item" onClick={(e) => {
                  searchInput.current.value = e.target.textContent;
                  searchDD.current.style.display = "none"
                  searchInput.current.value = e.target.textContent
                }}>
                  {content}
                </li>
              ))
            }
          </ul>
          </div>
          <button onClick={searchPlaces}><FontAwesomeIcon icon={faMagnifyingGlassLocation} /></button>
        </div>
        <div id="acc-and-trip">
          
        <div ref={account} className="account" 
        onClick={() => {
          editUser.current.style.display = "flex";
        }}>
          <div ref={editUser} id="edit-user">
            <div>
            <FontAwesomeIcon icon={faUser} />
            <h4>{name}</h4>
            </div>
            <h5>avalero.software@gmail.com</h5>
            <hr/>

          <button onClick={alert("button clicked")}><FontAwesomeIcon icon={faArrowRightFromBracket}/> Sign Out</button>
          </div>
                {currentUser ? (
                  <div className="user-name">
                    <p id="users-name">{name}</p>
                    <div id="account-photo">
                    <FontAwesomeIcon icon={faUser} />
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
      </div>
      </div>
    </>
  );
}
export default HomeHeader;
