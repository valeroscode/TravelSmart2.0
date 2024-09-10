import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPaperPlane,faStarOfLife, faDiamond } from "@fortawesome/free-solid-svg-icons";
import "./styles/ResultsPage.css";
import {allPlaces} from "./allMarkers.mjs";
import Lottie from "lottie-react";
import animationData from "./assets/loading-page.json";
import AddTrip_Button from "./AddTrip_Button";
import {
  handleTripAdderPopup,
  learnMoreAboutPlace,
  handleFavoritesNotifications,
} from "./getPlaceInfo.mjs";
import Notification from "./Notification";
import PlaceHome from "./PlaceHome";
import Footer from "./footer";
import { set } from "react-hook-form";
import { useAuth } from "./contexts/AuthContext";
import { docMethods } from "./firebase/firebase";
import HomeHeader from "./HomeHeader";

function Results() {
  const budgetF = useRef();
  const budgetSec = useRef();
  const highlyRatedSec = useRef();
  const lottie = useRef();
  const lottieBg = useRef();
  const ul = useRef();
  const topRated = useRef();
  const filterDescription = useRef();

  const list = [];
  const topRatedArr = [];
  const budget = [];
  const [places, setPlaces] = useState([])
  const [listState, setListState] = useState([]);
  const [topRatedState, setTopRatedState] = useState([]);
  const [budgetState, setBudgetState] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [name, setName] = useState("")
  const [categories, setCategories] = useState([])
  const [prices, setPrices] = useState([])
  const [areas, setAreas] = useState([])
  const [styles, setStyles] = useState([])
  const [serves, setServes] = useState([])
  const [awards, setAwards] = useState([])
  
  const [catScore, setCatScore] = useState(0)
  const [styleScore, setStyleScore] = useState(0)
  const [priceScore, setPriceScore] = useState(0)
  const [servesScore, setServesScore] = useState(0)
  const [areaScore, setAreaScore] = useState(0)
  const [awardsScore, setAwardsScore] = useState(0)
  const [attr, setAttr] = useState("");
  const [type, setType] = useState("")
  const [checked, setChecked] = useState(false)
  const [filteredPlaces, setFilteredPlaces] = useState([])

  const { currentUser } = useAuth();

  useEffect(() => {
    setName(currentUser.name);
  }, [currentUser]);

  let applied_filters = sessionStorage.getItem("filters").split("/ ,");

  useEffect(() => {
    const city = sessionStorage.getItem("city");
    let placesInCity = allPlaces.filter((place) => place.city === city);
    placesInCity.map((place) => place.score = 0);
    if (sessionStorage.getItem("filters") === 'none') {
      setPlaces(placesInCity.filter(
        (m) => m.city === city
      ));
    } else {
    setPlaces(placesInCity.filter(
      (m) => m.city === city  && String(m.serves).toLocaleUpperCase() === String(applied_filters) || 
      String(m.style).toLocaleUpperCase() === String(applied_filters) || String(m.category).toLocaleUpperCase() === String(applied_filters)
      || String(m.area).toLocaleUpperCase() === String(applied_filters)
    ));
  }
  }, [])

  useEffect(() => {
      setFilteredPlaces(places)
  }, [places])

  useEffect(() => {

    const categoriesArr = []
    const pricesArr = []
    const areasArr = []
    const stylesArr = []
    const servesArr = []
    const awardsArr = []
   
    for (let i = 0; i < places.length; i++) {
      if (!categoriesArr.includes(places[i].category)) {
        categoriesArr.push(places[i].category)
      }
      if (!pricesArr.includes(places[i].price)) {
        pricesArr.push(places[i].price)
      }
      if (!areasArr.includes(places[i].area)) {
        areasArr.push(places[i].area)
      }
      if (!stylesArr.includes(places[i].style)) {
        stylesArr.push(places[i].style) 
      }
      if (!servesArr.includes(places[i].serves)) {
        servesArr.push(places[i].serves)
        // const items = String(places[i].serves).split(',');
        // for (let i = 0; i < items.length; i++) {
        //   if (!servesArr.includes(items[i]) && items[i] !== 'MichelinStar') {
        //       servesArr.push(items[i])
        //   }
        // }
      }
      if (!stylesArr.includes(places[i].awards) && places[i].awards !== "") {
        stylesArr.push(places[i].awards) 
      }
    }
    setCategories(categoriesArr)
    setPrices(pricesArr)
    setAreas(areasArr)
    setStyles(stylesArr)
    setServes(servesArr)
    setAwards(awardsArr)

  }, [places])

  useEffect(() => {
    //Array containing all places in the current city
  

    // if (currentUser) {
    //   function loadPage() {
    //     if (!info.favorites) {
    //       window.setTimeout(loadPage, 200);
    //     } else {
    //       setFavorites(info.favorites);
    //       markFavorites();
    //     }
    //   }
    //   loadPage();
    // }
  }, []);

  //Handles clicks for each card
  // function handleCardClicks(e, name) {
  //   console.log(e.target.classList);
  //   if (e.target.classList.contains("trip-adder")) {
  //     handleTripAdderPopup(e);
  //   } else if (e.target.classList.contains("fa-heart")) {
  //     if (currentUser) {
  //       if (!favorites.includes(name)) {
  //         handleFavoritesNotifications(
  //           favorites,
  //           e.target,
  //           e.target.firstElementChild
  //         );
  //         favorites.push(name);
  //         //In the case that the user is only clicking the heart, a notification pops up and the favorites class is toggled
  //         setFavorites(favorites);
  //       } else {
  //         handleFavoritesNotifications(
  //           favorites,
  //           e.target,
  //           e.target.firstElementChild
  //         );
  //         favorites.splice(favorites.indexOf(name), 1);
  //         setFavorites(favorites);
  //       }
  //       let string = currentUser.email.toString();
  //       string = currentUser.metadata.createdAt + string.substring(0, 8);
  //       docMethods.updateFavorites(string, favorites);
  //     }
  //   } else {
  //     const place = allPlaces.filter((place) => place.name === name);
  //     learnMoreAboutPlace(
  //       place[0].name,
  //       place[0].rating,
  //       place[0].type,
  //       place[0].area,
  //       place[0].price,
  //       place[0].name,
  //       place[0].favorite,
  //       place[0].category,
  //       place[0].placeID,
  //       e.target
  //     );
  //   }
  // }

  function markFavorites() {
    //Ensures that favorite hearts are consistant acorss several sections

    const favorite_btns = document.getElementsByClassName("fa-heart");
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

  function toggleFilterDisplay(e) {
    const ul = e.target.nextElementSibling;

    if (ul.style.display === 'none') {
      ul.style.display = 'flex'
    } else {
      ul.style.display = 'none'
    }
  }

  function matchKeyboardInput(e) {
    const value = e.target.value;

    const title = document.getElementsByClassName('place-div-name')
    const style = document.getElementsByClassName('place-div-style')
    const serves = document.getElementsByClassName('place-div-serves')
    const area = document.getElementsByClassName('place-div-category-area')
    const parentDiv = document.getElementsByClassName('place-div')

    for (let i = 0; i < title.length; i++) {

       if (String(title[i].textContent).toLocaleLowerCase().includes(String(value).toLocaleLowerCase()) 
           || String(style[i].textContent).toLocaleLowerCase().includes(String(value).toLocaleLowerCase())
           || String(serves[i].textContent).toLocaleLowerCase().includes(String(value).toLocaleLowerCase())
       || String(area[i].textContent).toLocaleLowerCase().includes(String(value).toLocaleLowerCase())) {
           parentDiv[i].style.display = "flex"
       } else {
           parentDiv[i].style.display = "none"
       }
    }
 }

 useEffect(() => {
  
  for (let i = 0; i < places.length; i++) {
    if (type !== 'price') {
      if (places[i][type] === attr && checked) {
        places[i].score++
      }
      if (places[i][type] === attr && !checked) {
        places[i].score--
      }
    } else {
      const int = parseInt(attr)
    if (places[i].price === int && checked) {
      places[i].score++
      console.log(places[i])
    } 
    if (places[i].price === int && !checked) {
      places[i].score--
    }
    }
  }

  if (catScore === 0 && servesScore === 0 && priceScore === 0 && styleScore === 0 && areaScore === 0) {
      setFilteredPlaces(places)
      return
  }
  
  let filtersOn = 0
  catScore > 0 ? filtersOn++ : null;
  servesScore > 0 ? filtersOn++ : null;
  priceScore > 0 ? filtersOn++ : null;
  styleScore > 0 ? filtersOn++ : null;
  areaScore > 0 ? filtersOn++ : null;
  const newResults = places.filter((place) => place.score === filtersOn)

  setFilteredPlaces(newResults)

}, [catScore, servesScore, priceScore, styleScore, areaScore]);

  return (
    <>
      <HomeHeader name={name} />


      <section id="results-overall-org">
        
        <div id="best-rated-places">
          <h4 id="best-rated-h4">Best Rated</h4>
          <div id="best-rated-places-row">
            {
              places.map((place) => {
                if (place.rating >= 4) {
                  return (
                    <div className="best-rated-place">
                      <div>
                      
                        <h4><FontAwesomeIcon icon={faDiamond} />{place.rating}</h4>
                        <h3>{place.name}</h3>
                      </div>
                      <div>
                        <h5>{place.category} in {place.area}</h5>
                        <h5>Serving {String(place.serves).replaceAll(',',' ')}</h5>
                        <div className="buttons-container">
                          <button>Add To Trip</button>
                          <button onClick={(e) => learnMoreAboutPlace(place.name, place.rating, place.type, place.area, place.price, place.name, place.favorite, place.category, place.placeID, e.target, place.coords.lat, place.coords.lng)}>Learn More</button>
                        
                        </div>
                      
                      </div>
                      <div className="res-line"></div>
                    </div>
                  );
                } 
              })
            }
          </div>
        </div>
        <div id="budget-friendly">
          <h4 id="budget-h4">Budget Friendly</h4>
          <div id="budget-friendly-places-row">
            {
              places.map((place) => {
                if (place.price <= 2) {
                  return (
                    <div className="budget-friendly-place">
                      <div>
                        <h4>{'$'.repeat(place.price)}</h4>
                        <h3>{place.name}</h3>
                      </div>
                      <div>
                        <h5>Rated {place.rating}/5</h5>
                        <h5>{place.category} In {place.area}</h5>
                        <h5>Serving {String(place.serves).replaceAll(',',' ')}</h5>
                        <div className="buttons-container">
                          <button>Add To Trip</button>
                          <button onClick={(e) => learnMoreAboutPlace(place.name, place.rating, place.type, place.area, place.price, place.name, place.favorite, place.category, place.placeID, e.target, place.coords.lat, place.coords.lng)}>Learn More</button>
                        
                        </div>
                        
                      </div>
                      <div className="res-line"></div>
                    </div>
                  );
                } 
              })
            }
          </div>
        </div>

        <div id="all-results">
          {
            sessionStorage.getItem("filters") === 'none' ? <h4 ref={filterDescription} id="filter-desc">ALL OF {String(sessionStorage.getItem('city')).toLocaleUpperCase()}</h4> : <h4 ref={filterDescription} id="filter-desc">{applied_filters} IN {String(sessionStorage.getItem('city')).toLocaleUpperCase()}</h4> }
                   
          <div id="all-results-filters">
            {
              categories.length > 1 ?
            <div className="res-filter">
            <button onClick={(e) => toggleFilterDisplay(e)}>Category ▼ {catScore > 0 ? `(${catScore})` : null}</button>
            <ul style={{display: 'none'}}>
              {
                categories.map((item) => (<li><p>{item}</p> <input type="checkbox" item={item}
                  onClick={(e) => {
                    if (e.target.checked === true) {
                      setCatScore(catScore + 1)
                    } else if (e.target.checked === false) {
                      setCatScore(catScore - 1)
                    }
                    setAttr(e.target.getAttribute('item'))
                    setType('category')
                    setChecked(e.target.checked)
                  }}></input></li>))
              }
            </ul>
            </div>
            : null
            }

            {
              prices.length > 1 ?
            <div className="res-filter">
            <button onClick={(e) => toggleFilterDisplay(e)}>Price ▼ {priceScore > 0 ? `(${priceScore})` : null}</button>
            <ul style={{display: 'none'}}>
              <li><p>$</p> <input type="checkbox" item={1} onClick={(e) => {
                  if (e.target.checked === true) {
                    setPriceScore(priceScore + 1)
                  } else if (e.target.checked === false) {
                    setPriceScore(priceScore - 1)
                  }
                  setAttr(e.target.getAttribute('item'))
                  setType('price')
                  setChecked(e.target.checked)
                }}></input></li>
              <li><p>$$</p> <input type="checkbox" item={2} onClick={(e) => {
                  if (e.target.checked === true) {
                    setPriceScore(priceScore + 1)
        
                  } else if (e.target.checked === false) {
                    setPriceScore(priceScore - 1)
                  }
                  setAttr(e.target.getAttribute('item'))
                    setType('price')
                    setChecked(e.target.checked)
                }}></input></li>
              <li><p>$$$</p> <input type="checkbox" item={3} onClick={(e) => {
                  if (e.target.checked === true) {
                    setPriceScore(priceScore + 1)
             
                  } else if (e.target.checked === false) {
                    setPriceScore(priceScore - 1)
                  }
                  setAttr(e.target.getAttribute('item'))
                    setType('price')
                    setChecked(e.target.checked)
                }}></input></li>
              <li><p>$$$$</p> <input type="checkbox" item={4} onClick={(e) => {
                  if (e.target.checked === true) {
                    setPriceScore(priceScore + 1)
         
                  } else if (e.target.checked === false) {
                    setPriceScore(priceScore - 1)
                  }
                  setAttr(e.target.getAttribute('item'))
                    setType('price')
                    setChecked(e.target.checked)
                }}></input></li>
            </ul>
            </div>
            : null
            }
            {
              styles.length > 1 ?
            <div className="res-filter">
            <button onClick={(e) => toggleFilterDisplay(e)}>Style ▼ {styleScore > 0 ? `(${styleScore})` : null}</button>
            <ul style={{display: 'none'}}>
              {
                styles.map((item) => (<li><p>{item}</p> <input type="checkbox" item={item}
                  onClick={(e) => {
                    if (e.target.checked === true) {
                      setStyleScore(styleScore + 1)
                  
                    } else if (e.target.checked === false) {
                      setStyleScore(styleScore - 1)
                    }
                    setAttr(e.target.getAttribute('item'))
                    setType('style')
                    setChecked(e.target.checked)
                  }}></input></li>))
              }
            </ul>
            </div>
            : null
            } 
            {
              serves.length > 1 ?
            <div className="res-filter">
            <button onClick={(e) => toggleFilterDisplay(e)}>Serves ▼ {servesScore > 0 ? `(${servesScore})` : null}</button>
            <ul style={{display: 'none'}}>
              {
                serves.map((item) => (<li><p>{item}</p> <input type="checkbox" item={item}
                  onClick={(e) => {
                    if (e.target.checked === true) {
                      setServesScore(servesScore + 1)
                     
                    } else if (e.target.checked === false) {
                      setServesScore(servesScore - 1)
                    }
                    setAttr(e.target.getAttribute('item'))
                    setType('serves')
                    setChecked(e.target.checked)
                  }}></input></li>))
              }
            </ul>
            </div>
            : null
            }
            {
              areas.length > 1 ?
            <div className="res-filter">
            <button onClick={(e) => toggleFilterDisplay(e)}>Area ▼ {areaScore > 0 ? `(${areaScore})` : null}</button>
            <ul style={{display: 'none'}}>
              {
                areas.map((item) => (<li><p>{item}</p> <input type="checkbox" item={item}
                  onClick={(e) => {
                    if (e.target.checked === true) {
                      setAreaScore(areaScore + 1)
           
                    } else if (e.target.checked === false) {
                      setAreaScore(areaScore - 1)
                    }
                    setAttr(e.target.getAttribute('item'))
                    setType('area')
                    setChecked(e.target.checked)
                  }}></input></li>))
              }
            </ul>
            </div>
            : null
            }
            {
              awards.length > 1 ?
            <div className="res-filter">
            <button onClick={(e) => toggleFilterDisplay(e)}>Awards ▼ {awardsScore > 0 ? `(${awardsScore})` : null}</button>
            <ul style={{display: 'none'}}>
              {
                areas.map((item) => (<li><p>{item}</p> <input type="checkbox" item={item}
                  onClick={(e) => {
                    if (e.target.checked === true) {
                      setAwardsScore(awardsScore + 1)
           
                    } else if (e.target.checked === false) {
                      setAwardsScore(awardsScore - 1)
                    }
                    setAttr(e.target.getAttribute('item'))
                    setType('awards')
                    setChecked(e.target.checked)
                  }}></input></li>))
              }
            </ul>
            </div>
            : null
            }
          </div>

          <input type="text" placeholder="Type whatever. Disco? Mediterranean? Anything." id="res-searchbar" onKeyUp={(e) => matchKeyboardInput(e)}></input>
          <div id="place-div-container">
            {
              filteredPlaces.map((place) => (
                 <div className="place-div">
                   <div className="place-div-name-rating">
                   <h4><FontAwesomeIcon icon={faDiamond} />{place.rating}</h4>
                    <h3 className="place-div-name">{place.name}</h3>
                   </div>
                    <h4 className="place-div-category-area">{place.category} In {place.area} | {'$'.repeat(place.price)}</h4>
                    <h4 className="place-div-style">{place.style}</h4>
                    
                      <h5 className="place-div-serves">Serves {String(place.serves).replaceAll(',',' ')}</h5>
                    { 
                    place.awards !== "" ?
                    <div className="place-div-awards">
                    <FontAwesomeIcon icon={faStarOfLife} />
                    </div>
                    : null
                    }
               
                    <div className="all-places-buttons">
                    <button>Add To Trip</button>
                    <button onClick={(e) => learnMoreAboutPlace(place.name, place.rating, place.type, place.area, place.price, place.name, place.favorite, place.category, place.placeID, e.target, place.coords.lat, place.coords.lng)}>Learn More</button>
                   
                    </div>
                    <div className="place-div-tags">
                      {
                        place.price <= 2 ? <p className="inexpensive-place">Inexpensive</p> : null
                      }
                      {
                        place.rating >= 4 ? <p className="highly-rated-place">Highly Rated</p> : null
                      }
                    </div>
                    <div className="filteredplaces-line"></div>
                 </div>
              ))
            }
          </div>
        </div>
      </section>
      

        <Notification />
        <AddTrip_Button />
      <Footer />
    </>
  );
}

export default Results;
