import "./styles/Miami.css";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { allmarkers } from "./Miami.mjs";
import {
  faHome,
  faX,
  faBars,
  faCar,
  faMap,
  faPersonWalking,
  faPersonBiking,
  faBarsStaggered,
  faBookmark,
  faNewspaper,
  faChevronRight,
  faLocationDot,
  faChevronUp,
  faChevronDown,
  faHeart,
  faMoneyBillWave,
  faBurst
} from "@fortawesome/free-solid-svg-icons";
import HomeHeader from "./HomeHeader";
import { citiesArray, allPlaces } from "./allMarkers.mjs";
import { useAuth } from "./contexts/AuthContext";
import { docMethods } from "./firebase/firebase";
import {
  learnMoreAboutPlace,
  handleFavoritesNotifications,
  handleTripAdderPopup,
} from "./getPlaceInfo.mjs";
import AddTrip_Button from "./AddTrip_Button";
import Notification from "./Notification";
import ExploreCity from "./ExploreCity";
import { generalScript } from "./Miami.mjs";
import TripsPage from "./Trips";
import Lottie from "lottie-react";
import animationData from "./assets/loading-page.json";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import icelandwater from "./assets/icelandwater.jpg"
import greeksunset from "./assets/greeksunset.jpg"
import miaminight from "./assets/miaminight.jpg"
import hawailighthouse from "./assets/hawailighthouse.jpg"
import spanishpillers from "./assets/spanishpillers.jpg"
import littolkiss from "./assets/littolkiss.jpg"
import spanishart from "./assets/spanishart.jpg"
import spanishwindow from "./assets/spanishwindow.jpg"
import spanishtunnel from "./assets/spanishtunnel.jpg"
import spanisharch from "./assets/spanisharch.jpg"
import greekruins from "./assets/greekruins.jpg"
import greekcoast from "./assets/greekcoast.jpg"
import greeekflowers from "./assets/greeekflowers.jpg"
import greekboats from "./assets/greekboats.jpg"
import maracanhouse from "./assets/maracanhouse.jpg"
import miamipalms from "./assets/miamipalms.jpg"
import lebanesecoast from "./assets/lebanesecoast.jpg"
import spanishwheel from "./assets/spanishwheel.jpg"
import maracanpaintings from "./assets/maracanpaintings.jpg"


function TravelSmart() {
  const { currentUser } = useAuth();
  const navigate = useNavigate()
  const cityDD = useRef();
  const makeDefBtn = useRef();
  const helloUser = useRef();
  const chooseCityInput = useRef();
  const chooseCityInputField = useRef();
  const setCityBtn = useRef();
  const cityBtn = useRef();
  const rotate = useRef();
  const selectCityUl = useRef();
  const defaultDiv = useRef();
  const mapInput = useRef();
  const mapInputSecond = useRef();
  const advFilters = useRef();

  const [name, setName] = useState("");
  const [city, setCity] = useState("Miami");
  const [cities, setCities] = useState([])
  const [confirmExpCity, setConfirmExpCity] = useState(false)
  const [avgRating, setAvgRating] = useState(0);
  const [expCityOn, setExpCityOn] = useState(false)
  const [mapDropDown, setMapDropdown] = useState([])
  const [mapDDActive, setMapDDActive] = useState(false)
  const discMore = useRef();

  const ClubBtn = useRef();
  const RestBtn = useRef();
  const TheaterBtn = useRef();
  const ActbBtn = useRef();
  const lowCostBtn = useRef();
  const bestRatedBtn = useRef();
  const placeDetails = useRef();

  //Array containing all places in the current city
  const [allPlaces_inCity, setAllPlaces_inCity] = useState(
    allPlaces.filter((m) => m.city === sessionStorage.getItem("city"))
  );
  const [areas, setAreas] = useState([])
  const [styles, setStyles] = useState([])
  const [serving, setServing] = useState([])
  const [ul1, setUl1] = useState(false)
  const [ul2, setUl2] = useState(false)
  const [ul3, setUl3] = useState(false)

  useEffect(() => {

      for (let i = 0; i < allPlaces_inCity.length; i++) {
        if (!areas.includes(allPlaces_inCity[i].area)) {
          areas.push(allPlaces_inCity[i].area);
        } 

        if (!styles.includes(allPlaces_inCity[i].style)) {
          styles.push(allPlaces_inCity[i].style);
        }

        if (!serving.includes(allPlaces_inCity[i].serves)) {
          serving.push(allPlaces_inCity[i].serves);
        }

        setAreas(areas)
        setStyles(styles)
        setServing(serving)
      }

  }, [allPlaces_inCity])

  //Function sets the current city, used at various points
  function switchCity() {
    setAllPlaces_inCity(
      allPlaces.filter((m) => m.city === sessionStorage.getItem("city"))
    );
    const city = cityDD.current.children;

    for (let i = 0; i < city.length; i++) {
      if (city[i].textContent === sessionStorage.getItem("city")) {
        city[i].click();
      }
    }
    markFavorites();
  }

  const backgroundImgList = {
    1: {
      false: icelandwater,
      true: greekboats,
    },
    2: {
      false: greeksunset,
      true: maracanhouse,
    },
    3: {
      false: miaminight,
      true: miamipalms,
    },
    4: {
      false: hawailighthouse,
      true: lebanesecoast,
    },
    5: {
      false: littolkiss,
      true: spanishwheel,
    },
    6: {
      false: spanishpillers,
      true: maracanpaintings,
    },
  }

  //This array is a copy of the favorites state hook and used
  //to make proper updates to the database without relying on a state change for the variable above.
  //Thus preventing the component from re-rendering. Also results in array changes to be global.

  const [favorites, setFavorites] = useState([]);
  useEffect(() => {

    if (currentUser.defCity !== '' && currentUser.defCity !== undefined) {
      setConfirmExpCity(true)
      setCity(currentUser.defCity)
      sessionStorage.setItem("city", currentUser.defCity);
    } else {
      sessionStorage.setItem("city", "Miami");
    }

    let citiesArr = [];

  //Populates array with all cities
  for (let i = 0; i < allPlaces.length; i++) {
    if (!citiesArr.includes(allPlaces[i].city)) {
      citiesArr.push(allPlaces[i].city);
    }
  }

  allPlaces_inCity.map((place) => place.score = 0)
  setAllPlaces_inCity(allPlaces_inCity)

  setCities(citiesArr)
   
    
    const citiesInShowAll = document.getElementsByClassName("city-in-show-all");
    for (let i = 0; i < citiesInShowAll.length; i++) {
      if (citiesInShowAll[i].textContent === sessionStorage.getItem("city")) {
        citiesInShowAll[i].style.fontWeight = 800;
        citiesInShowAll[i].style.color = "lightgray";
        citiesInShowAll[i].click();
      }
    }

    setTimeout(() => {
      generalScript();
      window.history.pushState(
        null,
        null,
        "https://travelsmart2-0.onrender.com/Home"
      );
    }, 2000);
  }, []);

  useEffect(() => {
    setName(currentUser.name);
  }, [currentUser]);

  useEffect(() => {
    let total = 0;
    const filtered = allPlaces.filter((p) => p.city === city);
    filtered.map((p) => (total = total + p.rating));
    setAvgRating(total / filtered.length);
    setAllPlaces_inCity(allPlaces.filter((m) => m.city === city))
  }, [city]);

  setTimeout(() => {
    markFavorites();
  }, 2500);

  function markFavorites() {
    //Ensures that favorite hearts are consistant acorss several sections
    const favorite_btns = document.getElementsByClassName("click-favorite");
    for (let i = 0; i < favorite_btns.length; i++) {
      if (favorites.includes(favorite_btns[i].getAttribute("name"))) {
        //fills in hearts in the top picks section
        favorite_btns[i].firstElementChild.firstElementChild.classList.add(
          "favorite"
        );
      } else if (
        !favorites.includes(favorite_btns[i].getAttribute("name")) &&
        favorite_btns[i].firstElementChild.firstElementChild.classList.contains(
          "favorite"
        )
      ) {
        favorite_btns[i].firstElementChild.firstElementChild.classList.remove(
          "favorite"
        );
      }
    }
  }

  //Handles showing and hiding the dropdown
  function selectCity() {
    if (
      cityDD.current.style.display === "" ||
      cityDD.current.style.display === "none"
    ) {
      rotate.current.style.transform = "rotate(180deg)";
      cityDD.current.style.display = "block";
    } else if (cityDD.current.style.display === "block") {
      rotate.current.style.transform = "rotate(0deg)";
      cityDD.current.style.display = "none";
    }
  }

  function handleCityChange(e) {
    const citySelectText = document.getElementById("citySelect-text");
    citySelectText.innerHTML = `Choose City: ${e.target.textContent} `;
  }

  const mapPage = useRef();
  const homePage = useRef();
  const hideMapBtn = useRef();
  const showMapBtn = useRef();

  //Shows map
  function showMap(e) {
    setTimeout(() => {
      showMapBtn.current.style.display = "none";
    }, 50);
    hideMapBtn.current.style.display = "flex";
    setTimeout(() => {
      hideMapBtn.current.style.opacity = 1;
    }, 300);
    mapPage.current.classList.toggle("mapUp");
    mapPage.current.style.top = "0vh";
    document.getElementById('home-title').style.top = '-7rem'
    document.documentElement.style.overflowY = "hidden";
    if (mapDropDown.length === 0) {
    showMapContentDD()
    } else {
      return
    }
  }

  //Hides Map
  function hideMap(e) {
    hideMapBtn.current.style.opacity = 0;
    setTimeout(() => {
      hideMapBtn.current.style.display = "none";
    }, 50);
    showMapBtn.current.style.display = "flex";
    mapPage.current.classList.toggle("mapUp");
    mapPage.current.style.top = "105vh";
    document.documentElement.style.overflowY = "visible";
    document.getElementById('home-title').style.top = '0rem'
  }

  function showMapContentDD() {
    const array = [];
      for (let i = 0; i < allPlaces.length; i++) {
        if (allPlaces[i].city === sessionStorage.getItem('city')) {
        if (!array.includes(`📍 ${allPlaces[i].name}`)) {
          array.push(`📍 ${allPlaces[i].name}`)
        }
        if (!array.includes(`🔎 ${allPlaces[i].category}`)) {
          array.push(`🔎 ${allPlaces[i].category}`)
        }
      }
      }
      setMapDropdown(array)
  }

  function renderImages_OnTopPicks() {
    //Renders images for the new top picks
    const recImg = document.getElementsByClassName("rec-item-image");
    const nodeLength = recImg.length;

    for (let i = 0; i < nodeLength; i++) {
      recImg[i].src = `${recImg[i].getAttribute("url")}`;
    }

    //Colors in hearts for favorites that are in the top picks & everywhere else
    markFavorites();
  }

  const gallery = useRef();

  const viewAll = {
    //Refs to elements
    allPlacesContainer: useRef(),
    gridViewBtn: useRef(),
    searchText: useRef(),
    citiesShowAll: useRef(),
    arrows: useRef(),
    searchAll: useRef(),
    suggSection: useRef(),
    handleTripBtn_handleFavoritesBtn: function (e) {
      let string = currentUser.email.toString();
      string = currentUser.metadata.createdAt + string.substring(0, 8);
      if (
        !e.target.classList.contains("click-favorite") &&
        !e.target.classList.contains("trip-adder")
      ) {
        return;
      } else {
        if (e.target.classList.contains("trip-adder")) {
          handleTripAdderPopup(e);
          return
        }
        if (currentUser && e.target.classList.contains("click-favorite")) {
          if (!favorites.includes(e.target.getAttribute("name"))) {
            handleFavoritesNotifications(
              favorites,
              e.target,
              e.target.firstElementChild.firstElementChild
            );
            favorites.push(e.target.getAttribute("name"));
            //In the case that the user is only clicking the heart, a notification pops up and the favorites class is toggled
            setFavorites(favorites);
          } else {
            handleFavoritesNotifications(
              favorites,
              e.target,
              e.target.firstElementChild.firstElementChild
            );
            favorites.splice(
              favorites.indexOf(e.target.getAttribute("name")),
              1
            );
            setFavorites(favorites);
          }
          docMethods.updateFavorites(string, favorites);
        }
      }
    },
  };

  const mapOverlay = useRef();

  function bringUpMobileModal(e) {
    if (e.target.childNodes[0].direction === "pull up") {
      mapOverlay.current.style.height = "77%";
      document.getElementById("top-reccomendations-container").style.height =
        "58%";
      document.getElementById("map-btn-map").style.bottom = "79%";
      e.target.childNodes[0].direction = "pull down";
      e.target.childNodes[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>'
    } else {
      mapOverlay.current.style.height = "40%";
      document.getElementById("top-reccomendations-container").style.height =
        "30%";
      document.getElementById("map-btn-map").style.bottom = "37%";
      e.target.childNodes[0].direction = "pull up";
      e.target.childNodes[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg>'
    }
  }

  function matchKeyboardInput(e) {
    const value = e.target.value;
    const item = document.getElementsByClassName('map-start-dd-item');
    setMapDDActive(true)
    if (value === '') {
      const checkboxes = document.getElementsByClassName('checkbox');
      for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked === true) {
          checkboxes[i].checked = false;
        }
      }
    }
    for (let i = 0; i < item.length; i++) {
       if (value === '') {
        item[i].style.display = "none";
       } else {
       if (String(item[i].textContent).toLocaleLowerCase().includes(String(value).toLocaleLowerCase())) {
        item[i].style.display = "block"
       } else {
        item[i].style.display = "none"
       }
      }
    }
 }

  return (
    <>
      <HomeHeader name={name} />

      {/* this button is programatically clicked by the renderTopPicks() function in the Miami.mjs file in order to load in images 
    of places. */}
      <button
        id="simulateClick-btn"
        onClick={() => renderImages_OnTopPicks()}
      ></button>

      <section ref={homePage} id="homePage">
        <div>
          <div id="travelInfo">
            <button id="directions-X">
              <FontAwesomeIcon icon={faX} />
            </button>
            <center>
              <button className="directions-p">Directions</button>
            </center>
            <div id="userLocation">
              <input type="text" placeholder="Address" id="autocomplete" />
              <button id="submit">
                <strong>Set Your Location</strong>
              </button>
            </div>
            <div id="userDestination">
              <input
                type="text"
                placeholder="Click a marker"
                id="destination"
              />
              <div id="transportation">
                <p>Select Your Mode of Transit</p>
                <div id="trans-btns">
                  <button value="DRIVING">
                    <FontAwesomeIcon icon={faCar} />
                  </button>
                  <button value="BICYCLING">
                    <FontAwesomeIcon icon={faPersonBiking} />
                  </button>
                  <button value="WALKING">
                    <FontAwesomeIcon icon={faPersonWalking} />
                  </button>
                </div>
              </div>
            </div>
            <button id="routeButton">
              <strong>Get Directions</strong>
            </button>
            <div id="durationANDdistance"></div>
          </div>
        </div>

        <section id="hello-user-section">
        <img src={backgroundImgList[1].false} className="hello-user-img"></img>
        <img src={backgroundImgList[2].false}  className="hello-user-img"></img>
        <img src={backgroundImgList[3].false}   className="hello-user-img"></img>
        <img src={backgroundImgList[4].false} className="hello-user-img"></img>
        <img src={backgroundImgList[5].false} className="hello-user-img"></img>
        <img src={backgroundImgList[6].false} className="hello-user-img"></img>
        <img src={spanishart} className="hello-user-img"></img>
        <img src={spanisharch} className="hello-user-img"></img>
        <img src={spanishtunnel} className="hello-user-img"></img>
        <img src={spanishwindow} className="hello-user-img"></img>
<img src={greekruins} className="hello-user-img"></img>
<img src={greekcoast} className="hello-user-img"></img>
<img src={greeekflowers} className="hello-user-img"></img>

<FontAwesomeIcon icon={faBurst} />

        <div id="photo-credits">
        <a href="https://knt-travel.squarespace.com/" target="_blank">Photography by Karina N Tohmé</a>
        </div>
        
        <div id="hello-user" ref={helloUser}>
            <h2>Hello {name.split(" ")[0]},</h2>
            <h4>What would you like to do today?</h4>
            <input placeholder="Sushi in Miami, Resturants in Orlando..."></input>
            <div id="home-buttons">
              <button id="plan-a-trip" onClick={() => {
                navigate('/plan')
              }}>Plan a new trip</button>
            </div>

            <div id="choosing-city" ref={chooseCityInput}>
              <div id="input-DD-choose-city">
             <input ref={chooseCityInputField}  onKeyUp={(e) => {
              selectCityUl.current.style.display = "block"
              const citieslist = document.getElementsByClassName('city-to-exp');
              const inputValue = String(e.target.value).toLocaleLowerCase();
                 for (let i = 0; i < citieslist.length; i++) {
                  if (e.target.value !== "") {
                  if (String(citieslist[i].textContent).toLocaleLowerCase().includes(inputValue)) {
                           citieslist[i].style.display = "block";
                  } else {
                    citieslist[i].style.display = "none"
                  }
                } else {
                  citieslist[i].style.display = "none"
                }
                 }
             }} type="text" placeholder="Choose City"/>

<button ref={setCityBtn} onClick={() => {
                    setCity(chooseCityInputField.current.value)
                    sessionStorage.setItem("city", chooseCityInputField.current.value);
                    setCityBtn.current.style.backgroundColor = "black";
                    chooseCityInputField.current.style.border = "3px solid black";
                    setConfirmExpCity(true);
                    window.scrollTo({
                      top: 800,
                      behavior: "smooth",
                    });
}}>Set</button> 
              
              </div>

              
              <ul ref={selectCityUl} onClick={(e) => {
                  if (e.target.classList.contains("city-to-exp")) {
                    chooseCityInputField.current.value = e.target.textContent;
                    setCityBtn.current.style.backgroundColor = "#8A05FF"
                    chooseCityInputField.current.style.border = "3px solid #8A05FF"
                    selectCityUl.current.style.display = 'none'
                    defaultDiv.current.style.opacity = 1;
                    makeDefBtn.current.textContent = `Make ${e.target.textContent} my home city`
                  }
              }}>
        
                 {
                  cities.map((city) => (
                    <li className="city-to-exp">{city}</li>
                  ))
                 }
              </ul>

              <div id="make-default-div" ref={defaultDiv}>
                {
                 chooseCityInputField.current && chooseCityInputField.current.value !== currentUser.DefCity ?
                
              <button id="make-default" ref={makeDefBtn} onClick={(e) => {
                async function updateDefCity() {
                await fetch("http://localhost:8080/updateDefCity", {
                  method: 'POST',
                  headers: {
                    Authorization: "Bearer " + cookies.access_token,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    city: sessionStorage.getItem('city')
                  }),
                }).then((res) => {
                  return res.json();
                }).catch((err) => {
                  console.error(err)
                });
              }

              updateDefCity();

              e.target.textContent = `Your Default City Is Now ${sessionStorage.getItem('city')}!`;

              }}></button>
              
              : 
              <button id="make-default" onClick={() => {
                fetch("http://localhost:8080/updateDefCity", {
                  method: "POST",
                  headers: {
                    Authorization: "Bearer " + cookies.access_token,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    city: ''
                  }),
                }).then((res) => {
                  return res.json();
                }).catch((err) => {
                  console.error(err)
                });
              }}>
                Remove {sessionStorage.getItem('city')} as your home city
              </button>
            }
            <p>note: by doing this you wont need to set the city anymore, you can change your default city anytime.</p>
              </div>
             
            </div>
        </div>
        </section>

        { confirmExpCity ?
        <ExploreCity places={allPlaces_inCity}/>
        : null}

<TripsPage/>

        <section id="cities">
          <div id="middle-organizer">
            <img id="background-img" src="waves.jpg"></img>
            <div id="organizer-city-rundown">
              <h2>Explore here and abroad</h2>

              <div id="avaliable-cities">
         
                {
                  cities.map((city) => (
                  <div className="city-div">
                  <img src={`${city}.jpg`}></img>
                  <p className="city-name">{city}</p>
                  <div className="city-explore-div"
                    city={city}
                    onClick={(e) => setCity(e.target.getAttribute("city"))}
                  >
                    <h4 className="number-of-places">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        style={{ color: "#e00000" }}
                      />{" "}
                      {allPlaces.filter((p) => p.city === city).length} places
                    </h4>
                    <div className="avg-rating">
                      <div className="avg-rating-org">
                        <div className="rating-bg"></div>
                        <div
                          className="rating-bar"
                          style={{ width: `${(avgRating / 5) * 100}%` }}
                        ></div>
                      </div>
                      <h4 className="avg-rating-number">{Math.round(avgRating * 10) / 10}/5</h4>
                    </div>
                    
                  </div>
                  <button className="explore-city-button"
                  city={city}
                  onClick={(e) => {
                      document.body.append(document.getElementById("google-map"));
                      sessionStorage.setItem("city", e.target.getAttribute('city'))
                      sessionStorage.setItem("filters", 'none');
                      sessionStorage.setItem("total", 0);
                       window.location.replace(
                      "http://localhost:3000/Search-Results"
                      );
                    }} 
                    >
                    Explore City{" "}
                    
                    
                    <FontAwesomeIcon
                      icon={faChevronRight}   
                    />
                    </button>
                </div>
                  ))
                }
              
              </div>
            </div>
          </div>

    
        </section>

       
      </section>
      <Notification />
      <AddTrip_Button />

      <section ref={mapPage} id="mapPage">
        <ul id="filtersList">
          <strong style={{ fontFamily: `"Roboto Condensed", sans-serif` }}>
            Filters
          </strong>
          <li className="prefs">
            <hr />
            <div id="sort-by">
              <h4>Sort By</h4>
              <div>
                <input
                  type="checkbox"
                  className="checkbox"
                  id="Inexpensive"
                  value="Inexpensive"
                  condition1="Inexpensive_Condition_live_markers"
                  condition2="Inexpensive_Condition_all_markers"
                  name="checkbox"
                  ref={lowCostBtn}
                />
                Inexpensive&nbsp;&nbsp;
              </div>
              <div>
                <input
                  type="checkbox"
                  className="checkbox"
                  id="Best"
                  name="checkbox"
                  value="Best"
                  condition1="Best_Condition_live_markers"
                  condition2="Best_Condition_all_markers"
                  ref={bestRatedBtn}
                />
                Best Rated&nbsp;&nbsp;
              </div>
            </div>
            <hr />

            <div id="dropdown2">
              <h4>Category</h4>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-map"
                  id="Start-Your-Day"
                  value="Start Your Day"
                  category="type"
                  condition1="Inexpensive_Condition_live_markers"
                  condition2="Inexpensive_Condition_all_markers"
                  name="checkbox"
                />
                <p>Start Your Day&nbsp;&nbsp;</p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-map"
                  id="A-Night-Out"
                  value="A Night Out"
                  category="type"
                  condition1="Inexpensive_Condition_live_markers"
                  condition2="Inexpensive_Condition_all_markers"
                  name="checkbox"
                  ref={ClubBtn}
                />
                <p>A Night Out&nbsp;&nbsp;</p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-map"
                  id="Dining"
                  value="Dining"
                  category="type"
                  condition1="Inexpensive_Condition_live_markers"
                  condition2="Inexpensive_Condition_all_markers"
                  name="checkbox"
                  ref={RestBtn}
                />

                <p>Dining&nbsp;&nbsp;</p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-map"
                  id="Chill-Night"
                  value="Chill Night"
                  category="type"
                  condition1="Inexpensive_Condition_live_markers"
                  condition2="Inexpensive_Condition_all_markers"
                  name="checkbox"
                  ref={TheaterBtn}
                />
                <p>Chill Night&nbsp;&nbsp;</p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-map"
                  id="Activities"
                  value="Activites"
                  category="type"
                  condition1="Inexpensive_Condition_live_markers"
                  condition2="Inexpensive_Condition_all_markers"
                  name="checkbox"
                  ref={ActbBtn}
                />
                <p>Activities&nbsp;&nbsp;</p>
              </div>
            </div>
          </li>
          <button id="filters-cancel">Done</button>
        </ul>
        <div id="placeDetails" ref={placeDetails}>
        <FontAwesomeIcon icon={faX} id="exit-details-btn" onClick={() => {
          placeDetails.current.style.display = "none";
          placeDetails.current.style.opacity = 0;
          placeDetails.current.style.left = '-8rem';
        }}/>
          <img id="gallery" ref={gallery}></img>
          <div id="placeInfo">
            <button id="ReviewsBtn">See Reviews</button>
            <button id="write_a_review">Write a Review</button>
          </div>
        </div>
        <div id="map-organizer">
        <div id="map-start-interface">
        <div id="map-start-input">
        <input className="map-input-search" placeholder="Resturant, Miami Beach" style={{width: "21rem"}} ref={mapInput}
        onKeyUp={(e) => matchKeyboardInput(e)}></input>
        <ul id="map-search-dd">
          {
            mapDropDown.map((item) => <li className="map-start-dd-item"
            onClick={(e) => {
               const fr = document.getElementsByClassName('map-start-dd-item');
               for (let i = 0; i < fr.length; i++) {
                 fr[i].style.display = 'none'
               }
               const text = String(e.target.textContent).slice(3);
               mapInput.current.value = text;
               mapInputSecond.current.value = text;
               
               if (String(e.target.textContent).split(' ')[0] === '🔎') {
                document.getElementById('map-start-interface').style.display = 'none'
                const placeDetails = document.getElementById('placeDetails');
                if (placeDetails.style.display === 'flex') {
                  placeDetails.style.display = "none";
                  placeDetails.style.opacity = 0;
                  placeDetails.style.left = '-8rem';
                }
                window.map.setZoom(12)
                switch (text) {
                  case 'Club':
                  ClubBtn.current.click();
                  break;
                  case 'Resturant':
                  RestBtn.current.click();
                  break;
                  case 'Theater':
                  TheaterBtn.current.click();
                  break;                  
                }
                mapOverlay.current.style.left = '0rem';
               } else if (String(e.target.textContent).split(' ')[0] === '📍') {
                 const place = allPlaces.filter(place => place.name === text);
                 window.map.panTo(place[0].coords)
                 window.map.setZoom(15)
                 const placeName = allmarkers.filter(m => m.name === text);
                 google.maps.event.trigger(placeName[0], 'click');
                 if (document.getElementById('map-overlay').style.left !== '0rem') {
                 document.getElementById('placeDetails').style.left = '-1rem';
                 document.getElementById('placeDetails').style.top = '0rem';
                 }

               }
              
            }
          }
            >{item}</li>)
          }
        </ul>
        <FontAwesomeIcon icon={faBookmark} />
        </div>
        </div>  
          <div id="map-overlay" ref={mapOverlay}>
            <div id="mobile-pull-up-bd" onClick={(e) => bringUpMobileModal(e)}>
              
              <FontAwesomeIcon id="mobile-pull-up" direction="pull up" icon={faChevronUp} />
            </div>

            <div id="cityDD" ref={cityDD} onClick={handleCityChange}>
              {cities.map((city) => (
                <a key={city}>{city}</a>
              ))}
            </div>

            <div className="map-secondary-input-div">
            <input className="map-input-search" ref={mapInputSecond} placeholder="Search Travel Smart"
            onKeyUp={(e) => matchKeyboardInput(e)}></input>
            <FontAwesomeIcon icon={faBookmark} />
            </div>

            
            <ul className="map-search-dd">
          {
            mapDropDown.map((item) => <li className="map-start-dd-item"
            onClick={(e) => {
              //FINISH THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
               const fr = document.getElementsByClassName('map-start-dd-item');
               for (let i = 0; i < fr.length; i++) {
                 fr[i].style.display = 'none'
               }
               const text = String(e.target.textContent).slice(3);
               mapInput.current.value = text;
               mapInputSecond.current.value = text;
               
               if (String(e.target.textContent).split(' ')[0] === '🔎') {
                document.getElementById('map-start-interface').style.display = 'none'
                const placeDetails = document.getElementById('placeDetails');
                if (placeDetails.style.display === 'flex') {
                  placeDetails.style.display = "none";
                  placeDetails.style.opacity = 0;
                  placeDetails.style.left = '-8rem';
                }
                window.map.setZoom(12)
                const boxes = document.getElementsByClassName('checkbox-map')

                //The reason this doesnt seem like it works as intended is because of somehting in the miami.mjs file
                for (let i = 0; i < boxes.length; i++) {
                  if (boxes[i].checked === true)
                    console.log(boxes[i])
                  boxes[i].click()
                  }

                switch (text) {
                  case 'Club':
                  ClubBtn.current.click();
                  break;
                  case 'Resturant':
                  RestBtn.current.click();
                  break;
                  case 'Theater':
                  TheaterBtn.current.click();
                  break;                  
                }
                mapOverlay.current.style.left = '0rem';
               } else if (String(e.target.textContent).split(' ')[0] === '📍') {
                
                const place = allPlaces.filter(place => place.name === text);
                window.map.panTo(place[0].coords)
                window.map.setZoom(15)
                const placeName = allmarkers.filter(m => m.name === text);
                google.maps.event.trigger(placeName[0], 'click');
                if (document.getElementById('map-overlay').style.left !== '0rem') {
                document.getElementById('placeDetails').style.left = '-1rem';
                document.getElementById('placeDetails').style.top = '0rem';
                }
               }
              
            }
          }
            >{item}</li>)
          }
        </ul>
            <div id="filters-for-map">
              <div id="filters-text-line">
                <h5>Filters</h5>
                <hr></hr>
              </div>
              <div id="sidepanel-filters">
              <button id="filters-price" 
              onClick={(e) => {
                lowCostBtn.current.click()
                if (e.target.style.backgroundColor !== 'black') {
                  e.target.style.backgroundColor = 'black';
                  e.target.style.color = 'white';
                } else {
                  e.target.style.backgroundColor = 'whitesmoke';
                  e.target.style.color = 'black';
                }
              }}>Low Cost</button>
              <button id="filters-rating"
              onClick={(e) => {
                bestRatedBtn.current.click()
                if (e.target.style.backgroundColor !== 'black') {
                  e.target.style.backgroundColor = 'black';
                  e.target.style.color = 'white';
                } else {
                  e.target.style.backgroundColor = 'whitesmoke';
                  e.target.style.color = 'black';
                }
              }}>Best Rated</button>
              <button id="more-filters" onClick={() => {
                advFilters.current.style.display = 'flex';
              }}>More Filters</button>
              <div id="filters-for-category" ref={advFilters}>
                  <FontAwesomeIcon icon={faX} onClick={() => {
                    advFilters.current.style.display = 'none';
                  }} className="exit-adv-filters"/>
                  <h3>Advanced Filters</h3>
                  <div>
                    <h5 onClick={(e) => {
                      setUl1(!ul1)
                    }}>Area <FontAwesomeIcon icon={faChevronDown} style={ul1 === false ? {transform:'rotate(-90deg)'} : {transform:'rotate(0deg)'}} /></h5>
                    <ul style={ul1 === false ? {display:'none'} : {display:'flex'}}>
                    {
                      areas.map(area => <li><input type="checkbox"></input> <p>{area}</p></li>)
                    }
                    </ul>
                  </div>

                  <div>
                    <h5 onClick={(e) => {
                      setUl2(!ul2)
                    }}>Type <FontAwesomeIcon icon={faChevronDown} style={ul2 === false ? {transform:'rotate(-90deg)'} : {transform:'rotate(0deg)'}}
                    /></h5>
                    <ul style={ul2 === false ? {display:'none'} : {display:'flex'}}>
                    {
                      styles.map(style => <li><input type="checkbox"></input> <p>{style}</p></li>)
                    }
                    </ul>
                  </div>

                  <div>
                    <h5 onClick={(e) => {
                      setUl3(!ul3)
                    }}>Serving <FontAwesomeIcon icon={faChevronDown} style={ul3 === false ? {transform:'rotate(-90deg)'} : {transform:'rotate(0deg)'}}
                    /></h5>
                    <ul style={ul3 === false ? {display:'none'} : {display:'flex'}}>
                    {
                      serving.map(serve => <li><input type="checkbox"></input> <p>{serve}</p></li>)
                    }
                    </ul>
                  </div>

                  <div>
                    
                  </div>
              </div>
              </div>

            </div>
            <div className="button-div-map">
              <button id="show-filtersList">
                <FontAwesomeIcon icon={faBarsStaggered} />
                &nbsp;Filters
              </button>
            </div>

            <div id="filters-disclosed" className="disclosed-sponsor"></div>
            <div
              id="top-reccomendations-container"
              // onClick={(e) => viewAll.handleTripBtn_handleFavoritesBtn(e)}
            ></div>
          </div>
          <button id="show-menu">
            <FontAwesomeIcon icon={faBars} />
            &nbsp;&nbsp;Show Menu
          </button>
          <div id="map"></div>
        </div>
        <footer id="footer-map">
          <div ref={hideMapBtn} id="map-btn-map" onClick={(e) => hideMap(e)}>
            <h4>
              <FontAwesomeIcon icon={faHome} /> Hide Map
            </h4>
          </div>
        </footer>
      </section>
      <div id="map-btn" ref={showMapBtn} onClick={(e) => showMap(e)}>
        <h4>
          <FontAwesomeIcon icon={faMap} /> Show Map
        </h4>
      </div>

      <Footer name={name} />
    </>
  );
}

export default TravelSmart;