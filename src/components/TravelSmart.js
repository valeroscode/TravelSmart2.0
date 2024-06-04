import "./styles/Miami.css";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faX,
  faBars,
  faChevronDown,
  faCar,
  faMap,
  faPersonWalking,
  faPersonBiking,
  faBarsStaggered,
  faMagnifyingGlass,
  faNewspaper,
  faChevronRight,
  faLocationDot,
  faCompass,
  faPlane,
  faHeart,
  faMoneyBillWave,
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
import { generalScript } from "./Miami.mjs";
import TripsPage from "./Trips";
import Lottie from "lottie-react";
import animationData from "./assets/loading-page.json";
import Footer from "./footer";
import { useCookies } from "react-cookie";

function TravelSmart() {
  const { currentUser } = useAuth();

  const cityDD = useRef();
  const helloUser = useRef();
  const chooseCityInput = useRef();
  const chooseCityInputField = useRef();
  const expCityBtn = useRef();
  const setCityBtn = useRef();
  const cityBtn = useRef();
  const rotate = useRef();
  const [name, setName] = useState("");
  const [city, setCity] = useState("Miami");
  const [cities, setCities] = useState([])
  const [confirmExpCity, setConfirmExpCity] = useState(false)
  const [avgRating, setAvgRating] = useState(0);
  const [expCityOn, setExpCityOn] = useState(false)
  const [filtersActive, setFiltersActive] = useState([])
  const [priceActive, setPriceActive] = useState([])
  const [filterDD, setFilterDD] = useState(false)
  const [priceDD, setPriceDD] = useState(false)
  const [filteredPlaces, setFilteredPlaces] = useState([])
  const [checkboxs, setCheckboxes] = useState(0)
  const [priceCheckboxes, setPriceCheckboxes] = useState(0)
  const cityImg = useRef();
  const discMore = useRef();
  const descBg = useRef();
  const [cookies, setCookies, removeCookie] = useCookies([
    "access_token",
    "has_account",
  ]);
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
    markFavorites();
  }

  //This array is a copy of the favorites state hook and used
  //to make proper updates to the database without relying on a state change for the variable above.
  //Thus preventing the component from re-rendering. Also results in array changes to be global.

  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    let citiesArr = [];

  //Populates array with all cities
  for (let i = 0; i < allPlaces.length; i++) {
    if (!citiesArr.includes(allPlaces[i].city)) {
      citiesArr.push(allPlaces[i].city);
    }
  }

  allPlaces_inCity.map((place) => place.score = 0)
  setAllPlaces_inCity(allPlaces_inCity)

  setFilteredPlaces(allPlaces_inCity)

  setCities(citiesArr)
    //Sets the default city
    sessionStorage.setItem("city", "Miami");
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

    cityImg.current.style.filter = "blur(3px)";

    setTimeout(() => {
      cityImg.current.style.filter = "blur(0px)";
    }, 300);
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
    document.documentElement.style.overflowY = "hidden";
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
  function findPlacePicture() {
    const gallery = document.getElementById("gallery");
    gallery.src = `${gallery.getAttribute("url")}`;
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

        if (e.target.classList.contains("trip-adder")) {
          handleTripAdderPopup(e);
        }
      }
    },
  };

  const mapOverlay = useRef();

  function bringUpMobileModal(e) {
    if (e.target.childNodes[0].textContent === "pull up") {
      mapOverlay.current.style.height = "77%";
      document.getElementById("top-reccomendations-container").style.height =
        "58%";
      document.getElementById("map-btn-map").style.bottom = "79%";
      e.target.childNodes[0].textContent = "pull down";
    } else {
      mapOverlay.current.style.height = "40%";
      document.getElementById("top-reccomendations-container").style.height =
        "30%";
      document.getElementById("map-btn-map").style.bottom = "37%";
      e.target.childNodes[0].textContent = "pull up";
    }
  }

  function compareScores(attr, checked, type) {
  
    for (let i = 0; i < allPlaces_inCity.length; i++) {
      if (allPlaces_inCity[i].category === attr && checked && type === "category") {
        allPlaces_inCity[i].score++
      } else if (allPlaces_inCity[i].category === attr && !checked && type === "category") {
        allPlaces_inCity[i].score--
      } else if (allPlaces_inCity[i].price === attr && checked && type === "price") {
        allPlaces_inCity[i].score++
      } else if (allPlaces_inCity[i].price === attr && !checked && type === "price") {
        allPlaces_inCity[i].score--
      }
    }
    setAllPlaces_inCity(allPlaces_inCity)
    const newResults = allPlaces_inCity.filter((place) => place.score === priceCheckboxes + checkboxs)
    setFilteredPlaces(newResults)

    console.log(checkboxs + priceCheckboxes)

    console.log(filteredPlaces)
  }

  return (
    <>
      <HomeHeader name={name} />
      <div id="lottie">
        <Lottie animationData={animationData} />
      </div>
      <div id="lottie-bg"></div>

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
        <div id="hello-user" ref={helloUser}>
            <h2>Hello {name.split(" ")[0]},</h2>
            <h4>What would you like to do today?</h4>
            <div id="home-buttons">
              <button id="plan-a-trip">Plan a new trip</button>
              <button ref={expCityBtn} id="exp-a-city" onClick={() => {
                if (!expCityOn) {
helloUser.current.style.paddingBottom = "3rem"
chooseCityInput.current.style.opacity = 1;
expCityBtn.current.style.backgroundColor = "black";
expCityBtn.current.style.color = "white";
setExpCityOn(true)
                } else {
                  helloUser.current.style.paddingBottom = "0rem"
chooseCityInput.current.style.opacity = 0;
expCityBtn.current.style.backgroundColor = "white";
expCityBtn.current.style.color = "black";
setExpCityOn(false)
                }
              }}>Explore a city</button>
            </div>

            <div id="choosing-city" ref={chooseCityInput}>
              <div id="input-DD-choose-city">
             <input ref={chooseCityInputField}  onKeyUp={(e) => {
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
  sessionStorage.setItem("city", chooseCityInputField.current.value)
  setCityBtn.current.style.backgroundColor = "black"
                    chooseCityInputField.current.style.border = "3px solid black"
                    setConfirmExpCity(true)
                    viewAll.suggestionsDiv.current.style.opacity = 1;
                    viewAll.suggestionsDiv.current.style.top = "0rem";
}}>Set</button>
             
              
              </div>
              <ul onClick={(e) => {
                console.log(e.target.classList.contains("city-to-exp"))
                  if (e.target.classList.contains("city-to-exp")) {
                    chooseCityInputField.current.value = e.target.textContent;
                    e.target.style.display = 'none';
                    setCityBtn.current.style.backgroundColor = "#8A05FF"
                    chooseCityInputField.current.style.border = "3px solid #8A05FF"
                  }
              }}>
                <li className="city-to-exp">Miami</li>
                <li className="city-to-exp">New York</li>
                <li className="city-to-exp">Copenhegan</li>
                 {
                  cities.map((city) => (
                    <li className="city-to-exp">{city}</li>
                  ))
                 }
              </ul>
             
            </div>
        </div>

        <TripsPage/>

        { confirmExpCity ?
        <div id="filters-and-results">
        <div id="organizer">
          
          <div id="suggestions" ref={viewAll.suggestionsDiv}>
            <div id="title-city-options">
              <h1
                style={{ display: "flex" }}
                ref={viewAll.searchText}
                id="searchText"
              >
                Results In {sessionStorage.getItem('city')}
              </h1>

              

              <div id="filters-and-placecount">
               <div>
                <h4 onClick={() => {
                  if (filterDD) {
                    setFilterDD(false)
                  } else {
                    setFilterDD(true)
                  }
                }}>Filters ({filtersActive.length}) ▼</h4>
                
                  {
                    
                    filterDD ?
                    <ul onClick={(e) => {
                      console.log(e.target.tagName)
                        if (e.target.tagName === 'INPUT') {
                          if(checkboxs === 0) {
                          setCheckboxes(1)
                          }
                          compareScores(e.target.getAttribute('name'), e.target.checked, "category")
                        }
                        
                    }}>
                <li>Resturants <input type="checkbox" name="Resturant"/></li>
                <li>Parks <input type="checkbox" name="Park"/></li>
                <li>Bars <input type="checkbox" name="Bar"/></li>
                <li>Meuseums <input type="checkbox" name="Museum"/></li>
                <li>Clubs <input type="checkbox" name="Club"/></li>
                <li>Coffee Shops <input type="checkbox" name="Cafe"/></li>
                </ul>
                : null
                  }
               </div>

               <div>
                <h4 onClick={() => {
                  if (priceDD) {
                    setPriceDD(false)
                  } else {
                    setPriceDD(true)
                  }
                }}>Price ({priceActive.length}) ▼</h4>
                
                  {
                    
                    priceDD ?
                    <ul onClick={(e) => {
                      if (e.target.tagName === 'li') {
                        if (checkboxs === 0) {
                        setPriceCheckboxes(1)
                        }
                        compareScores(e.target.getAttribute('price'), e.target.checked, "price")
                      }
                      
                  }}>
                    <li>$ <input type="checkbox" price={1}/></li>
                <li>$$ <input type="checkbox" price={2}/></li>
                <li>$$$ <input type="checkbox" price={3}/></li>
                <li>$$$$ <input type="checkbox" price={4}/></li>
                </ul>
                : null
                  }
                
                
               </div>

               <p>{filteredPlaces.length} Places</p>
              </div>
          
            </div>
            <input
                id="searchInput"
                type="text"
                placeholder="Place name, tacos, gourmet..."
                name="search"
                ref={viewAll.searchAll}
                style={{ width: "60%" }}
              />
            <div
              ref={viewAll.allPlacesContainer}
              id="allPlacesContainer"
              onClick={(e) => viewAll.handleTripBtn_handleFavoritesBtn(e)}
            >
              {filteredPlaces.map((place) => (
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
                  <div className="name-and-rating">
                  <p className="showall-text">{place.name}</p>
                  <p className="ratingdd">
                    {parseFloat(place.rating) % 1 !== 0
                      ? place.rating
                      : `${place.rating}.0`}
                  </p>
                  </div>
                  <div className="lowerDiv">
                    <p className="cat-showall">{place.category}</p>
                    <p className="style-showall">{place.style}</p>
                    <p className="serves-showall">{place.serves}</p>
                  </div>
                  <div className="interactable-showall">
                  <button
                    className="showall-tripbtn trip-adder"
                    name={place.name}
                  >
                    Add to Trip
                  </button>
                  <p
                      className="click-favorite showall-heart"
                      name={place.name}
                      aria-hidden="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 512 512"
                        className="favorite"
                      >
                        <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"></path>
                      </svg>
                    </p>
                  <div className="infoDiv-showall">
                    <p className="area-showall">{place.area}</p>
                    <p className="price-showall">
                      {"$".repeat(parseInt(place.price))}
                    </p>
                  </div>
                  </div>
                  <a className="see-imgs" target="_blank" href={`https://www.google.com/search?q=${place.name}&sca_esv=03047b03c4b9cd9d&sca_upv=1&sxsrf=ADLYWILgzRTFudLq4zqNYw8eEFajutqqOA:1717445774174&source=hp&biw=1536&bih=730&ei=jiReZsKECOLfp84Pt5OM2Q4&iflsig=AL9hbdgAAAAAZl4yntxQz9UCBdnIlSkmNMW5d3qcFKh-&ved=0ahUKEwjCg6eKoMCGAxXi78kDHbcJI-sQ4dUDCA8&uact=5&oq=tatam&gs_lp=EgNpbWciBXRhdGFtMggQABiABBixAzIIEAAYgAQYsQMyCBAAGIAEGLEDMggQABiABBixAzIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABEjED1DuA1jKDXABeACQAQCYAVGgAYIDqgEBNbgBA8gBAPgBAYoCC2d3cy13aXotaW1nmAIGoAKfA6gCCsICBxAjGCcY6gLCAgQQIxgnwgILEAAYgAQYsQMYgwGYAweSBwE2oAeKGw&sclient=img&udm=2`}>See Images</a>
                  <p className="instructions-showall">Click to learn more</p>
                </div>
              ))}
            </div>
          </div>
        </div></div>
        : null}

        <section id="cities">
          <div id="middle-organizer">
            <img id="background-img" src="waves.jpg"></img>
            <div id="organizer-city-rundown">
              <h2>Explore here and abroad</h2>
              <p>
                Discover new places using our map and finder, add them to your
                itinerary, and find the next one
              </p>

              <div id="avaliable-cities">
                <div>
                  <img src="Miami.jpg"></img>
                  <p>Miami, FL, USA</p>
                  <h6
                    city="Miami"
                    onClick={(e) => setCity(e.target.getAttribute("city"))}
                  >
                    Explore City{" "}
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      style={{ color: "black" }}
                    />
                  </h6>
                </div>
                <div>
                  <img src="Chicago.jpg"></img>
                  <p className="city-name">Chicago, IL, USA</p>
                  <h6
                    city="Chicago"
                    onClick={(e) => setCity(e.target.getAttribute("city"))}
                  >
                    <h4 className="number-of-places">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        style={{ color: "#e00000" }}
                      />{" "}
                      {allPlaces.filter((p) => p.city === city).length} places
                    </h4>
                    <div id="avg-rating">
                      <div id="avg-rating-org">
                        <div id="rating-bg"></div>
                        <div
                          id="rating-bar"
                          style={{ width: `${(avgRating / 5) * 100}%` }}
                        ></div>
                      </div>
                      <h4>{Math.round(avgRating * 10) / 10}/5</h4>
                    </div>
                    Explore City{" "}
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      style={{ color: "black" }}
                    />
                  </h6>
                </div>
                <div>
                  <img src="New York.jpg"></img>
                  <p>New York City, NY, USA</p>
                  <h6
                    city="New York"
                    onClick={(e) => setCity(e.target.getAttribute("city"))}
                  >
                    Explore City{" "}
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      style={{ color: "black" }}
                    />
                  </h6>
                </div>
                <div>
                  <img src="North Pole.jpg"></img>
                  <p>North Pole, AK, USA</p>
                  <h6
                    city="North Pole"
                    onClick={(e) => setCity(e.target.getAttribute("city"))}
                  >
                    Explore City{" "}
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      style={{ color: "black" }}
                    />
                  </h6>
                </div>
                <div>
                  <img src="Barcelona.jpg"></img>
                  <p>Barcelona, Spain</p>
                  <h6
                    city="Barcelona"
                    onClick={(e) => setCity(e.target.getAttribute("city"))}
                  >
                    Explore City{" "}
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      style={{ color: "black" }}
                    />
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <img id="city-disc-more-bg" ref={descBg} src={`${city}.jpg`}></img>
          <div id="middle-organizer-discover">
            <img src={`${city}.jpg`} ref={cityImg}></img>
            <div id="disc-more-div" ref={discMore}>
              <p id="location-name">
                {citiesArray.map((c) => (c.city === city ? c.location : null))}
              </p>
              <h3>Explore {city}</h3>
              <div id="avg-rating">
                <div id="avg-rating-org">
                  <p>Average Rating</p>
                  <div id="rating-bg"></div>
                  <div
                    id="rating-bar"
                    style={{ width: `${(avgRating / 5) * 100}%` }}
                  ></div>
                </div>
                <p>{Math.round(avgRating * 10) / 10}/5</p>
              </div>
              <p id="number-of-places">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={{ color: "#e00000" }}
                />{" "}
                {allPlaces.filter((p) => p.city === city).length} places
              </p>
              <p>
                {citiesArray.map((c) =>
                  c.city === city ? c.description : null
                )}
              </p>
             
            </div>
          </div>

          <div id="middle-organizer-2">
            <div className="middle-org-h2">
              <h2>Why </h2>{" "}
              <h2 style={{ color: "#2E64FE", marginLeft: "0.8rem" }}>
                {" "}
                Choose Us
              </h2>
            </div>
            <div id="why-choose-us">
              <div id="col-1">
                <div className="col-div">
                  <div>
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      style={{ color: "#ffffff" }}
                    />
                  </div>
                  <div>
                    <h4>Find New Places</h4>
                    <p>Using our map or search features and filters.</p>
                  </div>
                </div>

                <div className="col-div">
                  <div>
                    <FontAwesomeIcon
                      icon={faNewspaper}
                      style={{ color: "#ffffff" }}
                    />
                  </div>
                  <div>
                    <h4>Get All The Info</h4>
                    <p>
                      From opening times to ratings, reviews, contact
                      information and more.
                    </p>
                  </div>
                </div>

                <div className="col-div">
                  <div>
                    <FontAwesomeIcon
                      icon={faCompass}
                      style={{ color: "#ffffff" }}
                    />
                  </div>
                  <div>
                    <h4>Get Directions</h4>
                    <p>
                      See how far your favorites places are from your hotel or
                      next destination.
                    </p>
                  </div>
                </div>
              </div>
              <div id="col-2">
                <div className="col-div">
                  <div>
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{ color: "#ffffff" }}
                    />
                  </div>
                  <div>
                    <h4>Save for later</h4>
                    <p>
                      Using the hearts, add places to your favorites to save
                      them for later.
                    </p>
                  </div>
                </div>

                <div className="col-div">
                  <div>
                    <FontAwesomeIcon
                      icon={faPlane}
                      style={{ color: "#ffffff" }}
                    />
                  </div>
                  <div>
                    <h4>Create Trips</h4>
                    <p>
                      Create trips with just a few clicks and plan as you go.
                    </p>
                  </div>
                </div>

                <div className="col-div">
                  <div>
                    <FontAwesomeIcon
                      icon={faMoneyBillWave}
                      style={{ color: "#ffffff" }}
                    />
                  </div>
                  <div>
                    <h4>Plan everything</h4>
                    <p>
                      Add places to your trip, plan your trips budget and get
                      detailed breakdowns.
                    </p>
                  </div>
                </div>
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
          </li>
          <button id="filters-cancel">Done</button>
        </ul>
        <div id="map-organizer">
          <div id="map-overlay" ref={mapOverlay}>
            <div id="mobile-pull-up-bd" onClick={(e) => bringUpMobileModal(e)}>
              <p id="mobile-pull-up">pull up</p>
            </div>
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
                <a key={city}>{city}</a>
              ))}
            </div>
            <h2 id="best-places-text">Best places in Miami</h2>
            <h6>according to your preferances</h6>
            <div className="button-div-map">
              <button id="show-filtersList">
                <FontAwesomeIcon icon={faBarsStaggered} />
                &nbsp;Filters
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
      <div id="map-btn" ref={showMapBtn} onClick={(e) => showMap(e)}>
        <h4>
          <FontAwesomeIcon icon={faMap} /> Show Map
        </h4>
      </div>

      <Footer />
    </>
  );
}

export default TravelSmart;
