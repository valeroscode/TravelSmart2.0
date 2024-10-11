import React, { useEffect, useState, useRef } from 'react'
import "./styles/Miami.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass, faDiamond
} from "@fortawesome/free-solid-svg-icons";

function ExploreCity ({places, searchTerm, allPlaces}) {

    const smartSearchInput = useRef()
    const [priceDD, setPriceDD] = useState(false)
    const [filteredPlaces, setFilteredPlaces] = useState([])
    const [cbCount, setCbCount] = useState(0)

    useEffect(() => {
      setFilteredPlaces(places)    
      for (let i = 0; i < places.length; i++) {
        places[i].priceScore = 0
      }
      smartSearchInput.current.value = searchTerm
    }, [])

    useEffect(() => {
      if (filteredPlaces.length > 0) {
        var geocoder = new window.google.maps.Geocoder();
    for (let i = 0; i < filteredPlaces.length; i++) {
    geocoder.geocode(
      { placeId: filteredPlaces[i].placeid },
      function (results, status) {
        if (status === window.google.maps.GeocoderStatus.OK) {
          const request = {
            placeId: filteredPlaces[i].placeid,
            fields: ["photo"],
          };

          var service = new window.google.maps.places.PlacesService(window.map);
          service.getDetails(request, function (place, status) {
            if (status == "OK") {
              const imgTag = document.getElementsByClassName('showAllDiv-img')
              imgTag[i].src = place.photos[0].getUrl({ maxWidth: 400 })
            }
          });
        }
      }
    );
    }
      }
    }, [filteredPlaces])

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

      function handlePriceFilter(priceCheckboxes, checked, attr) {
        attr = parseInt(attr)
        if (priceCheckboxes === 0) {
          setFilteredPlaces(places)
          return
        }

        for (let i = 0; i < places.length; i++) {
          if (places[i].price === attr && checked) {
            places[i].priceScore = 1
          }
          if (places[i].price === attr && !checked) {
            places[i].priceScore = 0
          }
        }
        const newResults = places.filter((place) => place.priceScore === 1)
        setFilteredPlaces(newResults)
      }

      const citiesAvaliable = ['miami', 'new york', 'barcelona']

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
       
        const regexcase = new RegExp(`\\b${' and '}\\b`, 'g'); // 'g' for global match
        const matches = searchTerm.match(regexcase);
    
        let results;
    
        if (matches !== null) {
        results = allPlaces.filter(p => p.score === finalTerms.length - matches.length)
        } else {
        results = allPlaces.filter(p => p.score === finalTerms.length)
        }
    
        setFilteredPlaces(results)
    
      }

      
  return (
    <>
    <div id="filters-and-results">
        <div id="organizer">
          
          <div id="suggestions" ref={viewAll.suggestionsDiv}>
            <div id="title-city-options">
              <div id="hello-user-input-search-exp-city">
            <input placeholder="Sushi in Miami, Resturants in Orlando..." type='text' ref={smartSearchInput}></input>
            <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => smartSearch()}/>
            </div>
              <div id="filters-and-placecount">
               <div id="filters-placement-org">
                <h4 onClick={() => {
                  if (priceDD) {
                    setPriceDD(false)
                  } else {
                    setPriceDD(true)
                  }
                }}>Price ({cbCount}) ▼</h4>
                
                  
                    <ul style={priceDD ? {display: "block"} : {display:"none"}} onClick={(e) => {
                      if (e.target.tagName === 'INPUT') {
                        let boxes = 0; 
                        for (let i = 0; i < document.getElementsByClassName('price-checkbox').length; i++) {
                          if (document.getElementsByClassName('price-checkbox')[i].checked === true) {
                            boxes++
                          }
                        }
                        setCbCount(boxes)
                        handlePriceFilter(boxes, e.target.checked, e.target.getAttribute('price'))                    
                      }
                      
                  }}>
                    <li>$ <input type="checkbox" className='price-checkbox' price={1}
                   /></li>
                <li>$$ <input type="checkbox" className='price-checkbox' price={2}
                /></li>
                <li>$$$ <input type="checkbox" className='price-checkbox' price={3}
                /></li>
                <li>$$$$ <input type="checkbox" className='price-checkbox' price={4}
                /></li>
                </ul>
              
                  
                
                
               </div>

               <p>{filteredPlaces.length} Places</p>
               <div className='exp-line'></div>
              </div>
             
            </div>
            <div
              ref={viewAll.allPlacesContainer}
              id="allPlacesContainer"
              onClick={(e) => viewAll.handleTripBtn_handleFavoritesBtn(e)}
            >
              {filteredPlaces.map((place) => (
                <div className='showAllDiv-Parent'>
                <img className='showAllDiv-img'></img>
                <div
                  className="showAllDiv"
                  onClick={(e) =>{
                    if (!e.target.closest('.showall-tripbtn')) {
                    learnMoreAboutPlace(
                      place.name,
                      place.rating,
                      place.type,
                      place.area,
                      place.price,
                      place.name,
                      place.favorite,
                      place.category,
                      place.placeid,
                      e.target
                    )
                  }
                  }
                  }
                >
                  <a href="/place" target="_blank" className='anchor-nav'></a>
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
                    <p className="serves-showall">Serving {String(place.serves).replaceAll(',',' ∙ ')}</p>
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
                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"/></svg>
                    </p>
                  <div className="infoDiv-showall">
                    <p className="area-showall">{place.area}</p>
                    <p className="price-showall">
                      {"$".repeat(parseInt(place.price))}
                    </p>
                  </div>
                  </div>
                  <p className="instructions-showall">Click to learn more</p>
                  <div className='show-all-line'></div>
                </div>
                </div>
              ))}
            </div>
          </div>
        </div></div>
    </>
  )
}

export default ExploreCity