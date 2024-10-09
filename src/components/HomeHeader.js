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
import AdvancedSearch from "./AdvancedSearch.js"

function HomeHeader({ name }) {
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
        if (cityDD.current) {
          cityDD.current.style.display = "none";
        }
        if (searchDD.current)
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
      <div id="home-title" style={window.location.pathname === '/Search-Results' || window.location.pathname === '/MyTrip' ? {backgroundColor: 'black'} : (window.location.pathname === '/place' || window.location.pathname === '/plan' ? {background: 'unset', backgroundColor: 'white', borderBottom: '1px solid rgb(225, 225, 225)', paddingBottom: '0.3rem'} : null)}>
        <div id="home-org">
      <div id="home-h1" onClick={() => window.location.replace('http://localhost:3000/home')} style={window.location.pathname === '/home' ? {top: '2rem', fontSize: '2rem'} : null}>
        
      <FontAwesomeIcon icon={faPaperPlane} className="plane"  style={window.location.pathname === '/plan' ? {color: '#6d00cc'} : window.location.pathname === '/Search-Results' ? {color: 'white'} : {color: 'black'}}/>
      <h1 style={window.location.pathname === '/plan' ? {color: '#6d00cc'} : window.location.pathname === '/Search-Results' || window.location.pathname === '/MyTrip' ? {color: 'white'} : {color: 'black'}}>WANDR</h1>
         
        </div>

        {
          window.location.pathname !== '/home' ?
        <AdvancedSearch/>
        : null
        }

        <div id="acc-and-trip">
          
        <div ref={account} className="account" 
        onClick={() => {
          editUser.current.style.display = "flex";
          userNameDiv.current.style.backgroundColor = 'black';
          userNameDiv.current.firstElementChild.style.color = 'white';
       
        }}>
          <div ref={editUser} id="edit-user">
            <div>
            <FontAwesomeIcon icon={faUser} />
            <h4>{name === undefined ? "" : name}</h4>
            </div>
            <h5>avalero.software@gmail.com</h5>
            <hr/>

          <button onClick={() => handleLogout()}><FontAwesomeIcon icon={faArrowRightFromBracket}/> Sign Out</button>
          </div>
                {currentUser ? (
                  <div className="user-name" ref={userNameDiv}>
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
