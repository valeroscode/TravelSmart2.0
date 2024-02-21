import "./styles/Miami.css";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faAngleDown,
  faHome,
  faX,
  faBars,
  faChevronDown,
  faMagnifyingGlass,
  faCar,
  faPlaneDeparture,
  faMap,
  faCompass,
  faPersonWalking,
  faPersonBiking,
  faBarsStaggered,
} from "@fortawesome/free-solid-svg-icons";
import HomeHeader from "./HomeHeader";
import allPlaces from "./allMarkers.mjs";
import { useAuth } from "./contexts/AuthContext";
import { docMethods } from "./firebase/firebase";
import {
  learnMoreAboutPlace,
  favoritesArr,
  handleFavoritesNotifications,
  handleTripAdderPopup,
} from "./getPlaceInfo.mjs";
import AddTrip_Button from "./AddTrip_Button";
import Notification from "./Notification";
import { generalScript } from "./Miami.mjs";
import TripsPage from "./Trips";

function TravelSmart() {
  const { currentUser, info } = useAuth();
  const cityDD = useRef();
  const cityBtn = useRef();
  const rotate = useRef();
  const [trips, setTrips] = useState([]);
  const [dbTrips, setDbTrips] = useState();
  const [loading, setLoading] = useState(true);
  const [f, setF] = useState([]);
  const [seed, setSeed] = useState(sessionStorage.getItem("city"));
  //Array containing all places in the current city
  const [allPlaces_inCity, setAllPlaces_inCity] = useState(
    allPlaces.filter((m) => m.city === sessionStorage.getItem("city"))
  );
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
  }

  // window.addEventListener('click', (e) => {
  //   const target = e.target.parentNode.parentNode
  //   if (target.classList.contains('click-favorite')) {
  //   target.style.color = 'red'
  //   docMethods.updateFavorites(string, e.target.getAttribute('name'))
  //   }
  // })

  //This array is a copy of the favorites state hook and used
  //to make proper updates to the database without relying on a state change for the variable above.
  //Thus preventing the component from re-rendering. Also results in array changes to be global.

  const txtArr = {
    txt0: "PLAN YOUR TRIPS",
    txt1: "BROWSE A CITY'S BEST",
    txt2: "DISCOVER NEW PLACES",
    txt3: "FIND YOUR NEXT FAVORITE",
  };

  let i = 0;

  const handleBackgroundImg = {
    homeImg: useRef(),
    introBackground: useRef(),
    intro: useRef(),
    fillerClicked: false,
    handleFillerClick: function () {
      const filler = document.getElementsByClassName("filler");
      const length = filler.length;
      for (let i = 0; i < length; i++) {
        filler[i].addEventListener("click", () => {
          this.fillerClicked = true;
          filler[i].style.transition = "none";
          filler[i].style.height = "100%";

          this.intro.current.firstElementChild.innerHTML = txtArr[`txt${i}`];
          const image = require(`./assets/backgroundimg${i}.jpg)`);
          this.homeImg.current.src = image;
        });
      }
    },
    handleFillers: function (index, text, img) {
      const filler = document.getElementsByClassName("filler");
      for (let i = 0; i < filler.length; i++) {
        filler[index].style.height = "100%";
      }

      this.intro.current.firstElementChild.innerHTML = text;
      const image = require(`./assets/backgroundimg${img}.jpg`);
      this.homeImg.current.src = image;

      if (i === 3) {
        this.intro.current.firstElementChild.style.opacity = 1;
        this.intro.current.childNodes[1].style.opacity = 1;
      }
    },
    loopTopPage: function () {
      if (this.fillerClicked === true) {
        return;
      }
      setTimeout(() => {
        this.intro.current.firstElementChild.style.opacity = 0;
        this.intro.current.childNodes[1].style.opacity = 0;
        setTimeout(() => {
          this.handleFillers(i, txtArr[`txt${i}`], i);
          this.intro.current.firstElementChild.style.opacity = 1;
          this.intro.current.childNodes[1].style.opacity = 1;
        }, 500);
        if (i < 3) {
          i = i + 1;
          this.loopTopPage();
        }
      }, 5000);
    },
  };

  useEffect(() => {
    if (currentUser) {
      function loadPage() {
        if (!info.trips) {
          window.setTimeout(loadPage, 200);
        } else {
          info.favorites.map((place) =>
            !favoritesArr.includes(place) ? favoritesArr.push(place) : null
          );
          setTrips(Object.entries(info.trips));
          setDbTrips(info.trips);
          setLoading(false);
          setF(favoritesArr);
          checkElements();
          function checkElements() {
            if (!handleBackgroundImg.intro.current.firstElementChild) {
              window.setTimeout(checkElements, 200);
            } else {
              handleBackgroundImg.handleFillerClick();
              handleBackgroundImg.handleFillers(0, txtArr.txt0, 0);
              handleBackgroundImg.loopTopPage();
            }
          }
        }
      }
      loadPage();
      //Sets the default city
      sessionStorage.setItem("city", "Miami");
      const citiesInShowAll =
        document.getElementsByClassName("city-in-show-all");
      for (let i = 0; i < citiesInShowAll.length; i++) {
        if (citiesInShowAll[i].textContent === sessionStorage.getItem("city")) {
          citiesInShowAll[i].style.fontWeight = 800;
          citiesInShowAll[i].style.color = "lightgray";
          citiesInShowAll[i].click();
        }
      }

      setTimeout(() => {
        generalScript();
      }, 2000);
    } else {
      window.location.replace("https://travelsmartweb.onrender.com/login");
    }
  }, []);

  setTimeout(() => {
    markFavorites();
  }, 2500);

  function markFavorites() {
    //Ensures that favorite hearts are consistant acorss several sections
    const favorite_btns = document.getElementsByClassName("click-favorite");
    for (let i = 0; i < favorite_btns.length; i++) {
      if (info.favorites.includes(favorite_btns[i].getAttribute("name"))) {
        //fills in hearts in the top picks section
        favorite_btns[i].firstElementChild.firstElementChild.classList.add(
          "favorite"
        );
      }
    }
  }

  let cities = [];

  //Populates array with all cities
  for (let i = 0; i < allPlaces.length; i++) {
    if (!cities.includes(allPlaces[i].city)) {
      cities.push(allPlaces[i].city);
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

  const home = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512"><path fill="#ffffff" d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>`;
  const map = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512"><path fill="#ffffff" d="M384 476.1L192 421.2V35.9L384 90.8V476.1zm32-1.2V88.4L543.1 37.5c15.8-6.3 32.9 5.3 32.9 22.3V394.6c0 9.8-6 18.6-15.1 22.3L416 474.8zM15.1 95.1L160 37.2V423.6L32.9 474.5C17.1 480.8 0 469.2 0 452.2V117.4c0-9.8 6-18.6 15.1-22.3z"/></svg>`;

  //Shows map
  function showMap(e) {
    setTimeout(() => {
      showMapBtn.current.style.display = "none";
    }, 50);
    hideMapBtn.current.style.display = "flex";
    mapPage.current.classList.toggle("mapUp");
    mapPage.current.style.top = "0vh";
  }

  //Hides Map
  function hideMap(e) {
    setTimeout(() => {
      hideMapBtn.current.style.display = "none";
    }, 50);
    showMapBtn.current.style.display = "flex";
    mapPage.current.classList.toggle("mapUp");
    mapPage.current.style.top = "105vh";
  }

  function renderImages_OnTopPicks() {
    //Renders images for the new top picks
    const recImg = document.getElementsByClassName("rec-item-image");
    const nodeLength = recImg.length;
    console.log(recImg);
    for (let i = 0; i < nodeLength; i++) {
      recImg[i].src = require(`./assets/${recImg[i].getAttribute("name")}.jpg`);
    }

    //Colors in hearts for favorites that are in the top picks & everywhere else
    markFavorites();
  }

  const gallery = useRef();
  function findPlacePicture() {
    const gallery = document.getElementById("gallery");
    gallery.src = require(`./assets/${gallery.getAttribute("name")}.jpg`);
  }

  const viewAll = {
    //Refs to elements
    allPlacesContainer: useRef(),
    gridViewBtn: useRef(),
    suggestionsDiv: useRef(),
    searchText: useRef(),
    citiesShowAll: useRef(),
    arrows: useRef(),
    searchAll: useRef(),
    suggSection: useRef(),
    handleCitySwitch_ViewAll: function (e) {
      //Handles places within a city being rendered in the div once the user clicks on a different city
      if (cities.includes(e.target.textContent)) {
        //Sets the new city is session sessionstorage
        sessionStorage.setItem("city", e.target.textContent);
        //Loops through the children of the dropdown menu in the map modal and bolds the new city's text
        for (let i = 0; i < e.target.parentNode.children.length; i++) {
          e.target.parentNode.childNodes[i].style.fontWeight = 400;
        }
        e.target.style.fontWeight = 800;

        //Sets current city in the variable
        switchCity();

        //Boldens the city that was just selected within the #allPlacesContainer
        for (let i = 0; i < this.citiesShowAll.current.childNodes.length; i++) {
          this.citiesShowAll.current.childNodes[i].style.fontWeight = 200;
          this.citiesShowAll.current.childNodes[i].style.color = "black";
        }
        e.target.style.fontWeight = 800;
        e.target.style.color = "lightgray";
      }
    },
    handleTripBtn_handleFavoritesBtn: function (e) {
      let string = currentUser.email.toString();
      string = currentUser.metadata.createdAt + string.substring(0, 8);
      if (
        !e.target.classList.contains("click-favorite") &&
        !e.target.classList.contains("trip-adder")
      ) {
        return;
      } else {
        if (currentUser && e.target.classList.contains("click-favorite")) {
          if (!info.favorites.includes(e.target.getAttribute("name"))) {
            info.favorites.push(e.target.getAttribute("name"));
            //In the case that the user is only clicking the heart, a notification pops up and the favorites class is toggled
            handleFavoritesNotifications(
              e.target,
              e.target.firstElementChild.firstElementChild
            );
          } else {
            info.favorites.splice(
              info.favorites.indexOf(e.target.getAttribute("name")),
              1
            );
          }
          docMethods.updateFavorites(string, info.favorites);
        }

        if (e.target.classList.contains("trip-adder")) {
          handleTripAdderPopup(e);
        }
      }
    },
  };

  return (
    <>
      <HomeHeader />

      {/* this button is programatically clicked by the renderTopPicks() function in the Miami.mjs file in order to load in images 
    of places. */}
      <button
        id="simulateClick-btn"
        onClick={() => renderImages_OnTopPicks()}
      ></button>
      <button id="find-picture" onClick={() => findPlacePicture()}></button>

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

        <div id="placeDetails">
          <div id="back-and-out">
            <button id="backBtn">
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
          <img id="gallery" ref={gallery}></img>
          <div id="placeInfo">
            <button id="ReviewsBtn">See Reviews</button>
            <button id="write_a_review">Write a Review</button>
          </div>
        </div>
        <div id="intro" ref={handleBackgroundImg.introBackground}>
          <div ref={handleBackgroundImg.intro} id="intro-text">
            <h1></h1>
            <div id="img-tracker">
              <div>
                <div className="filler"></div>
              </div>
              <div>
                <div className="filler"></div>
              </div>
              <div>
                <div className="filler"></div>
              </div>
              <div>
                <div className="filler"></div>
              </div>
            </div>
          </div>

          <img ref={handleBackgroundImg.homeImg} />
        </div>

        <section id="cities">
          <p id="whyTravel">
            In the embrace of dawn's golden hues, one embarks on a journey that
            transcends the boundaries of ordinary existence, venturing forth to
            traverse the tapestry of our wondrous world. Each step echoes with
            the rhythmic heartbeat of ancient lands, where whispers of the past
            dance with the promises of the future. From the majesty of towering
            peaks to the serenity of azure seas, the canvas of Earth unfolds
            like a symphony, inviting the intrepid traveler to immerse
            themselves in the harmonious melodies of diversity. Beneath the
            celestial canopy, where constellations weave tales untold, cultures
            intertwine like threads of an ethereal tapestry. The bustling
            markets of Marrakech, the serene temples of Kyoto, and the vibrant
            rhythms of Rio de Janeiro become chapters in an ever-expanding epic.
            With each encounter, one discovers not just the beauty of landscapes
            but the profound beauty of humanity. In the embrace of foreign
            winds, beneath unfamiliar skies, the soul finds its resonance, and
            the heart learns the universal language of connection. For in
            traveling the world, one doesn't just explore the external; they
            embark on a transformative odyssey, where every horizon is an
            invitation to rediscover the boundless wonders that reside within.
          </p>
          <h2 id="explore-here">Explore here and abroad</h2>
          <div id="cities-list">
            <div className="city-container">
              <img src={require("./assets/Miami.jpg")} loading="lazy" alt="" />
              <div className="city-info">
                <h5>Miami</h5>
                <p>United States of America</p>
              </div>
            </div>

            <div className="city-container">
              <img
                src={require("./assets/New York.jpg")}
                loading="lazy"
                alt=""
              />
              <div className="city-info">
                <h5>New York City</h5>
                <p>United States of America</p>
              </div>
            </div>

            <div className="city-container">
              <img src={require("./assets/North Pole.jpg")} alt="" />
              <div className="city-info">
                <h5>North Pole</h5>
                <p>United States of America</p>
              </div>
            </div>

            <div className="city-container">
              <img
                src={require("./assets/Barcelona.jpg")}
                loading="lazy"
                alt=""
              />
              <div className="city-info">
                <h5>Barcelona</h5>
                <p>Spain</p>
              </div>
            </div>
          </div>
        </section>

        <TripsPage />

        <div id="organizer">
          <div id="suggestions" ref={viewAll.suggestionsDiv}>
            <div id="title-city-options">
              <h1
                style={{ display: "flex" }}
                ref={viewAll.searchText}
                id="searchText"
              >
                Where we goin'?
              </h1>
              <div
                ref={viewAll.citiesShowAll}
                onClick={(e) => viewAll.handleCitySwitch_ViewAll(e)}
                id="change-city-showall"
              >
                {cities.map((city) => (
                  <p className="city-in-show-all" key={city}>
                    {city}
                  </p>
                ))}
              </div>
            </div>
            <div ref={viewAll.searchAll} id="search">
              <input
                id="searchInput"
                type="text"
                placeholder="Search by place name, type of place, or area"
                name="search"
                style={{ width: "60%" }}
              />
            </div>
            <div
              ref={viewAll.allPlacesContainer}
              id="allPlacesContainer"
              onClick={(e) => viewAll.handleTripBtn_handleFavoritesBtn(e)}
            >
              {allPlaces_inCity.map((place) => (
                <div
                  className="showAllDiv"
                  onClick={(e) =>
                    learnMoreAboutPlace(
                      place.name,
                      place.rating,
                      place.type,
                      place.area,
                      place.price,
                      place.name,
                      place.favorite,
                      place.category,
                      place.placeID,
                      e.target
                    )
                  }
                >
                  <a href="/place" target="_blank"></a>
                  <img
                    src={require(`./assets/${place.name}.jpg`)}
                    className="carousel-image"
                    loading="lazy"
                  ></img>
                  <p className="showall-text">{place.name}</p>
                  <p className="ratingdd">
                    {parseFloat(place.rating) % 1 !== 0
                      ? place.rating
                      : `${place.rating}.0`}
                  </p>
                  <div className="lowerDiv">
                    <p className="cat-showall">{place.category}</p>
                    <p
                      className="click-favorite showall-heart"
                      name={place.name}
                      aria-hidden="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 512 512"
                        class="favorite"
                      >
                        <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"></path>
                      </svg>
                    </p>
                  </div>
                  <button
                    className="showall-tripbtn trip-adder"
                    name={place.name}
                  >
                    Add to Trip
                  </button>
                  <div className="infoDiv-showall">
                    <p className="area-showall">{place.area}</p>
                    <p className="price-showall">
                      {"$".repeat(parseInt(place.price))}
                    </p>
                  </div>
                  <p className="instructions-showall">Click to learn more</p>
                </div>
              ))}
            </div>
          </div>
        </div>
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
                />
                Best Rated&nbsp;&nbsp;
              </div>
            </div>
            <hr />

            <i className="fa fa-solid fa-angle-down">
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
                    className="checkbox"
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
                    className="checkbox"
                    id="A-Night-Out"
                    value="A Night Out"
                    category="type"
                    condition1="Inexpensive_Condition_live_markers"
                    condition2="Inexpensive_Condition_all_markers"
                    name="checkbox"
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
                    className="checkbox"
                    id="Dining"
                    value="Dining"
                    category="type"
                    condition1="Inexpensive_Condition_live_markers"
                    condition2="Inexpensive_Condition_all_markers"
                    name="checkbox"
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
                    className="checkbox"
                    id="Chill-Night"
                    value="Chill Night"
                    category="type"
                    condition1="Inexpensive_Condition_live_markers"
                    condition2="Inexpensive_Condition_all_markers"
                    name="checkbox"
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
                    className="checkbox"
                    id="Activities"
                    value="Activites"
                    category="type"
                    condition1="Inexpensive_Condition_live_markers"
                    condition2="Inexpensive_Condition_all_markers"
                    name="checkbox"
                  />
                  <p>Activities&nbsp;&nbsp;</p>
                </div>
              </div>
            </i>
          </li>
          {/* <i className="fa fa-solid fa-angle-down">
                <div id="dropdown">
                <h4 className="Area">Area</h4>
                  <div>
                    <input
                      type="checkbox"
                      id="Brickell"
                      className="checkboxA"
                      value="Brickell"
                      name="checkbox"
                    />
                    Brickell&nbsp;&nbsp;
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="Wynwood"
                      className="checkboxA"
                      value="Wynwood"
                      name="checkbox"
                    />
                    Wynwood&nbsp;&nbsp;
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="Miami Beach"
                      className="checkboxA"
                      value="Miami Beach"
                      name="checkbox"
                    />
                    Miami Beach&nbsp;&nbsp;
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="Coconut Grove"
                      className="checkboxA"
                      value="Coconut Grove"
                      name="checkbox"
                    />
                    Coconut Grove&nbsp;&nbsp;
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="Coral Gables"
                      className="checkboxA"
                      value="Coral Gables"
                      name="checkbox"
                    />
                    Coral Gables&nbsp;&nbsp;
                  </div>
                </div>
              </i>
             
          </li> */}
          <button id="filters-cancel">Hide</button>
        </ul>
        <div id="map-organizer">
          <div id="map-overlay">
            <button id="hide-menu">
              <FontAwesomeIcon icon={faBars} />
              &nbsp;&nbsp;Hide Menu
            </button>
            <div id="citySelect" ref={cityBtn} onClick={() => selectCity()}>
              <div id="citySelect-text">Choose City:&nbsp;Miami&nbsp;</div>
              <FontAwesomeIcon
                icon={faChevronDown}
                ref={rotate}
                id="rotating"
              />
            </div>
            <div id="cityDD" ref={cityDD} onClick={handleCityChange}>
              {cities.map((city) => (
                <a key={city} onClick={(e) => setSeed(e.target.textContent)}>
                  {city}
                </a>
              ))}
            </div>
            <h2 id="best-places-text">Best places in Miami</h2>
            <h6>according to your preferances</h6>
            <div className="button-div-map">
              <button id="show-filtersList">
                <FontAwesomeIcon icon={faBarsStaggered} />
                &nbsp;Filters
              </button>
              <button className="b-1" value="Directions" id="pullup_travelInfo">
                Get Directions
              </button>
            </div>

            <div id="filters-disclosed" className="disclosed-sponsor"></div>
            <hr />
            <div
              id="top-reccomendations-container"
              onClick={(e) => viewAll.handleTripBtn_handleFavoritesBtn(e)}
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
      <footer id="footer">
        <div id="map-btn" ref={showMapBtn} onClick={(e) => showMap(e)}>
          <h4>
            <FontAwesomeIcon icon={faMap} /> Show Map
          </h4>
        </div>
        <div className="row">
          <div className="social-icons">
            <p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
              </svg>
              &nbsp;&nbsp;
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 640 512"
              >
                <path d="M640 317.9C640 409.2 600.6 466.4 529.7 466.4C467.1 466.4 433.9 431.8 372.8 329.8L341.4 277.2C333.1 264.7 326.9 253 320.2 242.2C300.1 276 273.1 325.2 273.1 325.2C206.1 441.8 168.5 466.4 116.2 466.4C43.42 466.4 0 409.1 0 320.5C0 177.5 79.78 42.4 183.9 42.4C234.1 42.4 277.7 67.08 328.7 131.9C365.8 81.8 406.8 42.4 459.3 42.4C558.4 42.4 640 168.1 640 317.9H640zM287.4 192.2C244.5 130.1 216.5 111.7 183 111.7C121.1 111.7 69.22 217.8 69.22 321.7C69.22 370.2 87.7 397.4 118.8 397.4C149 397.4 167.8 378.4 222 293.6C222 293.6 246.7 254.5 287.4 192.2V192.2zM531.2 397.4C563.4 397.4 578.1 369.9 578.1 322.5C578.1 198.3 523.8 97.08 454.9 97.08C421.7 97.08 393.8 123 360 175.1C369.4 188.9 379.1 204.1 389.3 220.5L426.8 282.9C485.5 377 500.3 397.4 531.2 397.4L531.2 397.4z" />
              </svg>{" "}
              &nbsp;&nbsp;
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 448 512"
              >
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </svg>{" "}
              &nbsp;&nbsp;
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
              </svg>
            </p>
          </div>
        </div>
        <p
          className="copyright"
          style={{ marginBottom: 0, paddingBottom: "1rem" }}
        >
          © Copyright 2023 Travel Smart
        </p>
      </footer>
    </>
  );
}

export default TravelSmart;
