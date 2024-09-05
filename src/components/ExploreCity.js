import React, { useEffect, useState, useRef } from 'react'
import "./styles/Miami.css";

function ExploreCity ({places, search}) {

    const [filtersActive, setFiltersActive] = useState([])
    const [priceActive, setPriceActive] = useState([])
    const [filterDD, setFilterDD] = useState(false)
    const [priceDD, setPriceDD] = useState(false)
    const [filteredPlaces, setFilteredPlaces] = useState([])
    const [checkboxs, setCheckboxes] = useState(0)
    const [priceCheckboxes, setPriceCheckboxes] = useState(0)
    const [photoUrls, setPhotoUrls] = useState([])

    useEffect(() => {
        setFilteredPlaces(places)
        if (filteredPlaces.length > 0) {
          var geocoder = new window.google.maps.Geocoder();
      for (let i = 0; i < filteredPlaces.length; i++) {
      geocoder.geocode(
        { placeId: filteredPlaces[i].placeID },
        function (results, status) {
          if (status === window.google.maps.GeocoderStatus.OK) {
            const request = {
              placeId: filteredPlaces[i].placeID,
              fields: ["photo"],
            };
  
            var service = new window.google.maps.places.PlacesService(window.map);
            service.getDetails(request, function (place, status) {
              if (status == "OK") {
                console.log(place.photos[0])
                const arr = photoUrls;
                arr.push(photoUrls.push(place.photos[0].getUrl({ maxWidth: 400 })))
                setPhotoUrls(arr)
              }
            });
          }
        }
      );
      }
        }
    }, [])

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

      const [attr, setAttr] = useState("");
      const [checked, setChecked] = useState(null);
      const [type, setType] = useState("");

      useEffect(() => {
            for (let i = 0; i < places.length; i++) {
              if (places[i].category === attr && checked && type === "category") {
                places[i].score++
              }
              if (places[i].category === attr && !checked && type === "category") {
                places[i].score--
              } 
              if (type === "price") {
                const int = parseInt(attr)
              if (places[i].price === int && checked) {
                places[i].score++
                
              } 
              if (places[i].price === int && !checked) {
                places[i].score--
              }
            }
            }

            if (priceCheckboxes === 0 && checkboxs === 0) {
                setFilteredPlaces(places)
                return
            }
            
            let filtersOn = 0
            priceCheckboxes > 0 ? filtersOn++ : null;
            checkboxs > 0 ? filtersOn++ : null;
            const newResults = places.filter((place) => place.score === filtersOn)
    
            setFilteredPlaces(newResults)

      }, [checkboxs, priceCheckboxes]);

      
  return (
    <>
    <div id="filters-and-results">
        <div id="organizer">
          
          <div id="suggestions" ref={viewAll.suggestionsDiv}>
            <div id="title-city-options">
              <h1
                style={{ display: "flex" }}
                ref={viewAll.searchText}
                id="searchText"
              >
                Your Search - "{search}"
              </h1>

              <div id="filters-and-placecount">
               <div id="filters-placement-org">
                <h4 onClick={() => {
                  if (priceDD) {
                    setPriceDD(false)
                  } else {
                    setPriceDD(true)
                  }
                }}>Price ({priceCheckboxes}) ▼</h4>
                
                  
                    <ul style={priceDD ? {display: "block"} : {display:"none"}} onClick={(e) => {
                      if (e.target.tagName === 'INPUT') {
                        if (e.target.checked) {
                            setPriceCheckboxes(priceCheckboxes + 1)
                        } else if (!e.target.checked && priceCheckboxes !== 0) {
                            setPriceCheckboxes(priceCheckboxes - 1)
                          }
                          setAttr(e.target.getAttribute('price'))
                          setChecked(e.target.checked)
                          setType("price")
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
               
              </div>
             
            </div>
            <div
              ref={viewAll.allPlacesContainer}
              id="allPlacesContainer"
              onClick={(e) => viewAll.handleTripBtn_handleFavoritesBtn(e)}
            >
              {filteredPlaces.map((place, index) => (
                <div className='showAllDiv-Parent'>
                <img src={photoUrls[index]}></img>
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
                      place.placeID,
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