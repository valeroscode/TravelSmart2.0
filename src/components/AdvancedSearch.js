import "./styles/homeHeader.css";
import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faMagnifyingGlassLocation,
  faUser,
  faArrowRightFromBracket
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "./contexts/AuthContext";
import { doc } from "firebase/firestore/lite";
import { Link } from "react-router-dom";

function AdvancedSearch() {

    const {allPlaces_Global} = useAuth();
    const account = useRef();
    const editUser = useRef();
    const userNameDiv = useRef();
    const advSearchBar = useRef();
    const { currentUser, logout } = useAuth();
    const [placesDropDown, setPlacesDropDown] = useState([]);
    const [cities, setCities] = useState([]);
  
    useEffect(() => {
      if (allPlaces_Global.length !== 0) {
      const citiesTemp = []
      allPlaces_Global.map(place =>
        !citiesTemp.includes(place.city) ? citiesTemp.push(place.city) : null
      );
      setCities(citiesTemp);
      setTimeout(() => {
        document.getElementById("users-name").style.opacity = 1;
      }, 500);
     
        window.addEventListener("click", (e) => {
            searchBarFunctions.handleClicksOutside_ofInputs(e);
            searchBarFunctions.hideEditUser(e)
        });
  
      }
    }, [allPlaces_Global])
  
  
    function handleLogout() {
      logout();
      window.location.replace("http://localhost:3000/");
    }
  
    const cityInput = useRef();
    const searchInput = useRef();
    const cityDD = useRef();
    const searchDD = useRef();
  
    const searchBarFunctions = {
      setDropdownContent: function (e) {
        const array = [];
        for (let i = 0; i < allPlaces_Global.length; i++) {
          if (allPlaces_Global[i].city === cityInput.current.value) {
          if (!array.includes(allPlaces_Global[i].style)) {
            array.push(allPlaces_Global[i].style)
          }
          if (!array.includes(allPlaces_Global[i].category)) {
            array.push(allPlaces_Global[i].category)
          }
          if (!array.includes(allPlaces_Global[i].area)) {
            array.push(allPlaces_Global[i].area)
          }
          if (!array.includes(allPlaces_Global[i].serves)) {
            array.push(allPlaces_Global[i].serves)
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
        if (!e.target.closest('#edit-user') && !e.target.closest('.account')) {
          editUser.current.style.display = 'none'
          userNameDiv.current.style.backgroundColor = 'white';
          userNameDiv.current.firstElementChild.style.color = 'black';
        }
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
            for (let i = 0; allPlaces_Global.length; i++) {
              if (!arr.includes(allPlaces_Global[i].style)) {
                arr.push(allPlaces_Global[i].style)
              } 
              if (!arr.includes(allPlaces_Global[i].category)) {
                arr.push(allPlaces_Global[i].category)
              } 
              if (!arr.includes(allPlaces_Global[i].serves)) {
                arr.push(allPlaces_Global[i].serves)
              } 
              if (!arr.includes(allPlaces_Global[i].area)) {
                arr.push(allPlaces_Global[i].area)
              }  
            }
            setPlaces_InCity(arr);
          }
          dropdown.style.display = "flex";
        }
      },
      handleClicksOutside_ofInputs: function (e) {
        if (e.target !== searchInput.current && e.target !== cityInput.current) {
          if (cityDD && searchDD && cityDD.current.style.display !== 'none') {
            cityDD.current.style.display = "none";
            searchDD.current.style.display = "none";
          } else {
            return
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
    <div id="home-searchbar" ref={advSearchBar}>
        <div id="cityDD-input">
          <input ref={cityInput} style={{borderRadius: '20px 0px 0px 20px'}} placeholder="Choose A City" onClick={() => {
            
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
              cities.map(city => 
                <li className="city-dd-item" onClick={(e) => {
                  cityInput.current.value = e.target.textContent;
                  cityDD.current.style.display = "none"
                  searchInput.current.value = '';
                  searchBarFunctions.setDropdownContent()
                }}>{city}</li>
              )
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
          <button style={window.location.pathname === '/Search-Results' ? {backgroundColor: '#8a05ff'} : null} onClick={searchPlaces}><FontAwesomeIcon icon={faMagnifyingGlassLocation} /></button>
        </div>
        </>
  )
}

export default AdvancedSearch