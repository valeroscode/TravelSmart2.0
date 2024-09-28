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
  faMagnifyingGlass,
  faPersonBiking,
  faBarsStaggered,
  faBookmark,
  faNewspaper,
  faChevronRight,
  faLocationDot,
  faChevronUp,
  faChevronDown,
  faMagnifyingGlassLocation,
  faMoneyBillWave,
  faBurst,
  faMessage
} from "@fortawesome/free-solid-svg-icons";
import HomeHeader from "./HomeHeader";
import { useAuth } from "./contexts/AuthContext.js";
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
import wavesBg from "./assets/waves.jpg"

function TravelSmart() {
  const { currentUser, allPlaces } = useAuth();
  console.log(currentUser)
  const navigate = useNavigate()
  const cityDD = useRef();
  const cityDDAdv = useRef();
  const searchInput = useRef();
  const searchDD = useRef();
  const makeDefBtn = useRef();
  const helloUser = useRef();
  const chooseCityInput = useRef();
  const chooseCityInputField = useRef();
  const cityInputAdv = useRef();
  const setCityBtn = useRef();
  const cityBtn = useRef();
  const rotate = useRef();
  const selectCityUl = useRef();
  const defaultDiv = useRef();
  const mapInput = useRef();
  const mapInputSecond = useRef();
  const advFilters = useRef();
  const placeInfoReviews = useRef();
  const advSearchToggle = useRef();

  const smartSearchInput = useRef()

  const fivestar = useRef();
  const fourstar = useRef();
  const threestar = useRef();
  const twostar = useRef();
  const onestar = useRef();

  const [placesDropDown, setPlacesDropDown] = useState([]);
  const [city, setCity] = useState("Miami");
  const [cities, setCities] = useState([])
  const [confirmExpCity, setConfirmExpCity] = useState(false)
  const [avgRating, setAvgRating] = useState(0);
  const [expCityOn, setExpCityOn] = useState(false)
  const [mapDropDown, setMapDropdown] = useState([])
  const [mapDDActive, setMapDDActive] = useState(false)
  const [advSearch, setAdvSearch] = useState(false)
  const discMore = useRef();

  const ClubBtn = useRef();
  const RestBtn = useRef();
  const TheaterBtn = useRef();
  const ActbBtn = useRef();
  const lowCostBtn = useRef();
  const bestRatedBtn = useRef();
  const placeDetails = useRef();

  const overallRating = useRef();

  const [smartSearchPlaces, setSmartSearchPlaces] = useState([])
  const [areas, setAreas] = useState([])
  const [styles, setStyles] = useState([])
  const [serving, setServing] = useState([])
  const [ul1, setUl1] = useState(false)
  const [ul2, setUl2] = useState(false)
  const [ul3, setUl3] = useState(false)

  const searchBarFunctions = {
    setDropdownContent: function (e) {
      const array = [];
      for (let i = 0; i < allPlaces.length; i++) {
        if (allPlaces[i].city === cityInputAdv.current.value) {
        if (!array.includes(allPlaces[i].style)) {
          array.push(allPlaces[i].style)
        }
        if (!array.includes(allPlaces[i].category)) {
          array.push(allPlaces[i].category)
        }
        if (!array.includes(allPlaces[i].area)) {
          array.push(allPlaces[i].area)
        }
        if (!array.includes(allPlaces[i].serves)) {
          array.push(allPlaces[i].serves)
        }
      }
      }
      setPlacesDropDown(array)
    },
    handleClicksOutside_ofInputs: function (e) {
      if (e.target !== searchInput.current && e.target !== cityInputAdv.current) {
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

  function searchPlaces() {
    sessionStorage.setItem("city", cityInputAdv.current.value);
    if (searchInput.current.value !== "" && cityInputAdv.current.value !== "") {
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

  useEffect(() => {

      

  }, [allPlaces])

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
    7: {
      true: wavesBg,
    },
  }

  //This array is a copy of the favorites state hook and used
  //to make proper updates to the database without relying on a state change for the variable above.
  //Thus preventing the component from re-rendering. Also results in array changes to be global.

  //handler to update the city, which then makes an api call to get all places in that city
  const handleUpdateCity = (newCity) => {
    const newState = {
        city: newCity
    };
    dispatch({ type: 'SET_CITY', payload: newState });
  };

  const [favorites, setFavorites] = useState([]);
  useEffect(() => {

    if (currentUser.defCity !== '' && currentUser.defCity !== undefined) {
      setConfirmExpCity(true)
      setCity(currentUser.defCity)
      sessionStorage.setItem("city", currentUser.defCity);
      handleUpdateCity(currentUser.defCity)
    } else {
      sessionStorage.setItem("city", "Miami");
    }
       
    const citiesInShowAll = document.getElementsByClassName("city-in-show-all");
    for (let i = 0; i < citiesInShowAll.length; i++) {
      if (citiesInShowAll[i].textContent === sessionStorage.getItem("city")) {
        citiesInShowAll[i].style.fontWeight = 800;
        citiesInShowAll[i].style.color = "lightgray";
        citiesInShowAll[i].click();
      }
    }
  }, []);

  useEffect(() => {
    let citiesArr = [];
    const areasTemp = []
    const stylesTemp = []
    const servingTemp = []

    //Populates array with all cities
    console.log(allPlaces)

    for (let i = 0; i < allPlaces.length; i++) {
      if (!citiesArr.includes(allPlaces[i].city)) {
        citiesArr.push(allPlaces[i].city);
      }
      if (!areasTemp.includes(allPlaces[i].area)) {
        areasTemp.push(allPlaces[i].area);
      } 

      if (!stylesTemp.includes(allPlaces[i].style)) {
        stylesTemp.push(allPlaces[i].style);
      }

      if (!servingTemp.includes(allPlaces[i].serves)) {
        servingTemp.push(allPlaces[i].serves);
      }
    }

    setAreas(areasTemp)
    setStyles(stylesTemp)
    setServing(servingTemp)
    setCities(citiesArr)

  }, [allPlaces])
 
  useEffect(() => {
    let total = 0;
    const filtered = allPlaces.filter((p) => p.city === city);
    filtered.map((p) => (total = total + p.rating));
    setAvgRating(total / filtered.length);
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

 //REVIEWS
 const [reviews, setReviews] = useState([])
 useEffect(() => {
  let five = 0;
  let four = 0;
  let three = 0;
  let two = 0;
  let one = 0;
  for (let i = 0; i < reviews.length; i++) {
   switch (reviews[i].rating) {
     case 5:
       five++;
       break;
     case 4:
       four++;
       break;
     case 3:
       three++;
       break;
     case 2:
       two++;
       break;
     case 1:
       one++;
       break;
   }
  }

  fivestar.current.style.width = `${(five/reviews.length) * 100}%`
  fourstar.current.style.width = `${(four/reviews.length) * 100}%`
  threestar.current.style.width = `${(three/reviews.length) * 100}%`
  twostar.current.style.width = `${(two/reviews.length) * 100}%`
  onestar.current.style.width = `${(one/reviews.length) * 100}%`

}, [reviews])

 function getPlaceReviews(id) {
 var map = window.map;
 var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { placeId: id },
      function (results, status) {
        if (status === window.google.maps.GeocoderStatus.OK) {
          const request = {
            placeId: id,
            fields: ["reviews"],
          };

          var service = new window.google.maps.places.PlacesService(window.map);
          service.getDetails(request, function (place, status) {
            if (status == "OK") {
              let list = []
              for (let i = 0; i < place.reviews.length; i++) {
                list.push({
                  author: place.reviews[i].author_name,
                  time: place.reviews[i].relative_time_description,
                  rating: place.reviews[i].rating,
                  text: place.reviews[i].text
                })
              }
              setReviews(list)
              // addressText.current.textContent = place.formatted_address;
              // for (let i = 0; i < place.reviews.length; i++) {
              //   renderReviews(place.reviews[i]);
              // }
            }
          });
        }
      }
    );
  }

  const citiesAvaliable = ['miami', 'new york', 'barcelona']

  //okay, different algo. it will go by search terms, score each place according to those terms
  function smartSearch() {
    const searchTerm = String(smartSearchInput.current.value).toLocaleLowerCase();
    const category = String(searchTerm).split(" ")[0]
    const location = String(searchTerm).split(" ")[2]
    const locationIndex = searchTerm.indexOf(location);
    const place = searchTerm.slice(locationIndex)

    const regEx = searchTerm.split(/ and | in | /)

    const initialTerms = regEx.map((item) => ({
      term: item,
      changed: false
    }))

    let removeItem;

    //account for places with spaces in the name 
    let finalTerms = initialTerms.map((term, index, array) => term.term === 'beach' ? { term: `${array[index - 1].term} ${term.term}`, changed: true} : term)
    finalTerms = finalTerms.map((term, index, array) => term.term === 'york' ? { term:  `${array[index - 1].term} ${term.term}`, changed: true} : term)
    finalTerms = finalTerms.map((term, index, array) => term.term === 'gables' ? { term:  `${array[index - 1].term} ${term.term}`, changed: true} : term)
    finalTerms = finalTerms.map((term, index, array) => term.term === 'quarter' ? { term:  `${array[index - 1].term} ${term.term}`, changed: true} : term)

    for (let i = 0; i < finalTerms.length; i++) {
      if (finalTerms[i].changed === true) {
        finalTerms.splice(i - 1, 1)
      }
    }
    

    finalTerms = finalTerms.filter(term => term.term !== '')

    const cityInArray = finalTerms.filter(term => citiesAvaliable.includes(term.term))

    function wordAccuracy(word, value) {
      value = String(value).toLocaleLowerCase()
      if (word === value) {
        return
      } else {
      const calc = word.length - value.length

        if (calc === 0 || calc === 1 || calc === -1) {
          const minLength = Math.min(word.length, value.length)
            let misspellings = 0 
            for (let i = 0; i < minLength; i++) {
              if (word[i] !== value[i]) {
                misspellings++
              }
            }
            if (misspellings <= 1) {
              console.log(value)
              finalTerms.map((term) => {
                if (term.term === word) {
                  term.term = value
                }
              })
            } 
          
        } else {
          return
        }
      }
    
    }

    //Correcting mispellings
    for (let i = 0; i < allPlaces.length; i++) {
    for (let j = 0; j < finalTerms.length; j++) {
      wordAccuracy(finalTerms[j].term, allPlaces[i].area)
      wordAccuracy(finalTerms[j].term, allPlaces[i].city)
      wordAccuracy(finalTerms[j].term, allPlaces[i].style)
      wordAccuracy(finalTerms[j].term, allPlaces[i].category)
      wordAccuracy(finalTerms[j].term, allPlaces[i].serves)
      }
    }

 

    for (let i = 0; i < allPlaces.length; i++) {
     
     allPlaces[i].score = 0
     if (cityInArray.length === 0) {
      if (finalTerms.some(term => term.term.includes(String(allPlaces[i].area).toLocaleLowerCase()))) {
        allPlaces[i].score++
      }
      } else {
        if (finalTerms.some(term => term.term.includes(String(allPlaces[i].city).toLocaleLowerCase()))) {
          allPlaces[i].score++
        }
      }
      if (finalTerms.some(term => term.term.includes(String(allPlaces[i].style).toLocaleLowerCase()))) {
        allPlaces[i].score++
      }
      if (finalTerms.some(term => term.term.includes(String(allPlaces[i].category).toLocaleLowerCase()))) {
        allPlaces[i].score++
      }
      let processed = allPlaces[i].serves.replace(/[,&]/g, ' ');
      processed = processed.replace(/\s+/g, ' ').trim();
      processed = processed.toLocaleLowerCase()
      const regexPattern = processed.split(' ').join('|');
      finalTerms.some(term => {
      const items = regexPattern.split('|').map(item => item.trim());
      if (items.includes(term.term)) {
        allPlaces[i].score++
      }
      })

      //When handling misspellings also account for 1 letter added and missing 1 letter
    }
    console.log(finalTerms)
    const regexcase = new RegExp(`\\b${' and '}\\b`, 'g'); // 'g' for global match
    const matches = searchTerm.match(regexcase);

    let results;

    if (matches !== null) {
    results = allPlaces.filter(p => p.score === finalTerms.length - matches.length)
    } else {
    results = allPlaces.filter(p => p.score === finalTerms.length)
    }

    setSmartSearchPlaces(results)

    console.log(results)

    
    // if (place.includes(' and ')) {

    //   const termsArray = place.split(' and ')
      
      

    // } else {
    //   const filterByLocation = allPlaces.filter(p => String(p.city).toLocaleLowerCase() === place)
    //   if (citiesAvaliable.includes(place)) {
    //   if (categoryTypes.includes(category)) {
    //   const filterByCategory = filterByLocation.filter(p => String(p.category).toLocaleLowerCase() === category)
    //   setSmartSearchPlaces(filterByCategory)
    //   } else {
    //   const filterByStyle = filterByLocation.filter(p => String(p.style).toLocaleLowerCase() === category)
    //   setSmartSearchPlaces(filterByStyle)
    //   if (filterByStyle.length === 0) {
    //     const filterByServes = filterByLocation.filter(p =>  String(p.serves).toLocaleLowerCase().includes(category))
    //     setSmartSearchPlaces(filterByServes)
    //   }
    //   }
    // } else {
    //   const filterByArea = allPlaces.filter(p => String(p.area).toLocaleLowerCase() === place)
    //   if (categoryTypes.includes(category)) {
    //     const filterByCategory = filterByArea.filter(p => String(p.category).toLocaleLowerCase() === category)
    //     setSmartSearchPlaces(filterByCategory)
    //     } else {
    //     const filterByStyle = filterByArea.filter(p => String(p.style).toLocaleLowerCase() === category)
    //     setSmartSearchPlaces(filterByStyle)
    //     if (filterByStyle.length === 0) {
    //       const filterByServes = filterByArea.filter(p =>  String(p.serves).toLocaleLowerCase().includes(category))
    //       setSmartSearchPlaces(filterByServes)
    //     }
    //     }
    // }

    //   //remember to handle misspellings!!!
    // }

    setConfirmExpCity(true)

  }

  function wordAccuracy(index, term, value) {
    value = String(value).toLocaleLowerCase()
    if (term === value) {
      return
    } else {
    const calc = term.length - value.length
      if (calc === 0 || calc === 1 || calc === -1) {
        const minLength = Math.min(term.length, value.length)
        if (calc === 0) {
          let misspellings = 0 
          for (let i = 0; i < minLength; i++) {
            if (term[i] !== value[i]) {
              misspellings++
              term[i] = value[i]
              console.log(term)
            }
          }
          if (misspellings <= 1) {
            //FIX THE WORD AND MODIFY THE ARRAY
          } 
        }
      } else {
        return
      }
    }
  }

  return (
    <>
      <HomeHeader name={currentUser.name} />

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

        <div id="photo-credits">
        <a href="https://knt-travel.squarespace.com/" target="_blank">Photography by Karina N Tohmé</a>
        </div>
        
        <div id="hello-user" ref={helloUser}>
            <h2>Hello {currentUser.name === undefined ? "" : String(currentUser.name).split(" ")[0]},</h2>
            <h4>What would you like to do today?</h4>
            {
            !advSearch ?
            <div id="hello-user-input-search">
            <input placeholder="Sushi in Miami, Resturants in Orlando..." ref={smartSearchInput} style={{borderRadius: '30rem'}}></input>
            <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => smartSearch()}/>
            </div>
            : 
            <div id="home-searchbar">
        <div id="cityDD-input">
          <input ref={cityInputAdv} style={{borderRadius: '20px 0 0 7px'}} placeholder="Choose A City" onClick={() => {
            
            cityDDAdv.current.style.display = "flex"
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
          <ul ref={cityDDAdv}>
            {
              cities.map((city) => (
                <li className="city-dd-item" onClick={(e) => {
                  cityInputAdv.current.value = e.target.textContent;
                  cityDDAdv.current.style.display = "none"
                  searchInput.current.value = '';
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
          <button style={window.location.pathname === '/Search-Results' ? {backgroundColor: '#8a05ff'} : null} onClick={searchPlaces}><FontAwesomeIcon icon={faMagnifyingGlassLocation} /></button>
        </div>
       
            }

            <div id="home-buttons">
            <button id="adv-search" ref={advSearchToggle} onClick={(e) => {
                if (e.target.textContent === 'Advanced Search') {
                setAdvSearch(true)
                e.target.textContent = 'Back to Smart Search'
                } else {
                setAdvSearch(false)
                e.target.textContent = 'Advanced Search'
                }

              }}>Advanced Search</button>
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
        <ExploreCity places={smartSearchPlaces} searchTerm={smartSearchInput.current.value} allPlaces={allPlaces}/>
        : null}

<TripsPage/>

        <section id="cities">
          <div id="middle-organizer">
            <div id="background-img"></div>
            <div id="organizer-city-rundown">
              <h2>Get To Know Your City</h2>

              <div id="avaliable-cities">
         
                {
                  cities.map((city) => (
                  <div className="city-div">
                  <img></img>
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
                          className="info-rating-bar"
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
          <div id="placeInfo" onClick={(e) => {
            if (e.target.id === 'show-me-reviews') {
              console.log(reviews.length)
              if (reviews.length === 0) {
                getPlaceReviews(e.target.getAttribute('placeId'))
                placeInfoReviews.current.style.display = 'flex'
                overallRating.current.textContent = e.target.getAttribute('overallRating')
              } else {
                placeInfoReviews.current.style.display = 'flex'
              }
            }
          }}>
          </div>
          <div id="placeInfo-reviews" style={{display: 'none'}} ref={placeInfoReviews}>
            <div id="placeInfo-reviews-nav">

              <button onClick={() => {
                    placeInfoReviews.current.style.display = 'none'
                  }}>Overview</button>
              <button>Reviews</button>

              <FontAwesomeIcon icon={faX} onClick={() => {
                    placeInfoReviews.current.display = 'none'
                  }} className="exit-reviews"/>

            </div>
            <div id="reviews-overview-container">
            <div id="reviews-overview">
             
      <div id='info-review-ratings-summary'>
       <div id='info-overall-rating'>
       <h1 ref={overallRating}></h1>
       </div>
       <div id='info-review-ratings-bars'>
       <div className='info-review-rating'>
        <p>5</p>
        <div className='info-rating-bar'>
          <div className='rating-bar-fill' ref={fivestar}></div>
        </div>
       </div>
       <div className='info-review-rating'>
       <p>4</p>
       <div className='info-rating-bar'>
       <div className='rating-bar-fill' ref={fourstar}></div>
       </div>
       </div>
       <div className='info-review-rating'>
       <p>3</p>
       <div className='info-rating-bar'>
       <div className='rating-bar-fill' ref={threestar}></div>
       </div>
       </div>
       <div className='info-review-rating'>
       <p>2</p>
       <div className='info-rating-bar'>
       <div className='rating-bar-fill' ref={twostar}></div>
       </div>
       </div>
       <div className='info-review-rating'>
       <p>1</p>
       <div className='info-rating-bar'>
       <div className='rating-bar-fill' ref={onestar}></div>
       </div>
       </div>
       </div>
      </div>
              </div>
              
              {
                reviews.map((review) => <div className='place-user-review'>
                <h5>{review.author} | {review.time}</h5>
                <h4 className='place-review-rating' rating={review.rating}>{`◆`.repeat(Math.round(parseInt(review.rating)))} {review.rating}/5</h4>
                <p className='place-review-text'>{review.text}</p>
                </div>)
              }
            </div>
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
                const filteredAllplacesincity = allPlaces.filter(place => place.category === text)
                const newAreas = []
                const newStyles = []
                const newServing = []
                for (let i = 0; i < filteredAllplacesincity.length; i++) {
                  if (!newAreas.includes(filteredAllplacesincity[i].area)) {
                    newAreas.push(filteredAllplacesincity[i].area);
                  } 
          
                  if (!newStyles.includes(filteredAllplacesincity[i].style)) {
                    newStyles.push(filteredAllplacesincity[i].style);
                  }
          
                  if (!newServing.includes(filteredAllplacesincity[i].serves)) {
                    newServing.push(filteredAllplacesincity[i].serves);
                  }
          
                  setAreas(newAreas)
                  setStyles(newStyles)
                  setServing(newServing)
                }
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
                const filteredAllplacesincity = allPlaces.filter(place => place.category === text)
                const newAreas = []
                const newStyles = []
                const newServing = []
                for (let i = 0; i < filteredAllplacesincity.length; i++) {
                  if (!newAreas.includes(filteredAllplacesincity[i].area)) {
                    newAreas.push(filteredAllplacesincity[i].area);
                  } 
                  if (!newStyles.includes(filteredAllplacesincity[i].style)) {
                    newStyles.push(filteredAllplacesincity[i].style);
                  }
                  if (!newServing.includes(filteredAllplacesincity[i].serves)) {
                    newServing.push(filteredAllplacesincity[i].serves);
                  }
                  setAreas(newAreas)
                  setStyles(newStyles)
                  setServing(newServing)
                }
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
                      areas.map(area => <li><input type="checkbox" className="adv-checkbox area-filters-map" area={area}></input> <p>{area}</p></li>)
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
                      styles.map(style => <li><input type="checkbox" className="adv-checkbox type-filters-map"></input> <p>{style}</p></li>)
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
                      serving.map(serve => <li><input type="checkbox" className="adv-checkbox serve-filters-map"></input> <p>{serve}</p></li>)
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

      <FontAwesomeIcon id="notification-center-btn" icon={faMessage} />

      <Footer name={name} />
    </>
  );
}

export default TravelSmart;