import React, { useEffect, useState, useRef } from 'react'
import "./styles/Miami.css";

function ExploreCity ({places}) {

    const [filtersActive, setFiltersActive] = useState([])
    const [priceActive, setPriceActive] = useState([])
    const [filterDD, setFilterDD] = useState(false)
    const [priceDD, setPriceDD] = useState(false)
    const [filteredPlaces, setFilteredPlaces] = useState([])
    const [checkboxs, setCheckboxes] = useState(0)
    const [priceCheckboxes, setPriceCheckboxes] = useState(0)

    useEffect(() => {
        setFilteredPlaces(places)
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

      function matchKeyboardInput(e) {
         const value = e.target.value;
    
         const title = document.getElementsByClassName('showall-text')
         const style = document.getElementsByClassName('style-showall')
         const serves = document.getElementsByClassName('serves-showall')
         const area = document.getElementsByClassName('area-showall')
         const parentDiv = document.getElementsByClassName('showAllDiv')

         for (let i = 0; i < title.length; i++) {

            if (String(title[i].textContent).toLocaleLowerCase().includes(String(value).toLocaleLowerCase()) 
                || String(style[i].textContent).toLocaleLowerCase().includes(String(value).toLocaleLowerCase())
                || String(serves[i].textContent).toLocaleLowerCase().includes(String(value).toLocaleLowerCase())
            || String(area[i].textContent).toLocaleLowerCase().includes(String(value).toLocaleLowerCase())) {
                parentDiv[i].style.display = "block"
            } else {
                parentDiv[i].style.display = "none"
            }
         }
      }

      
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
                Results In {sessionStorage.getItem('city')}
              </h1>

              <div id="filters-and-placecount">
               <div id='filters-placement-org'>
                <h4 onClick={() => {
                  if (filterDD) {
                    setFilterDD(false)
                  } else {
                    setFilterDD(true)
                  }
                }}>Filters ({checkboxs}) ▼</h4>
                
                  
                    <ul style={filterDD ? {display: "block"} : {display:"none"}} onClick={(e) => {
            
                        if (e.target.tagName === 'INPUT') {
                          if (e.target.checked) {
                            setCheckboxes(checkboxs + 1)
                          } else if (!e.target.checked) {
                            setCheckboxes(checkboxs - 1)
                          }
                          setAttr(e.target.getAttribute('name'))
                          setChecked(e.target.checked)
                          setType("category")
                        }
                        
                    }}>
                <li>Resturants <input type="checkbox" className='category-checkbox' name="Resturant"
                /></li>
                <li>Parks <input type="checkbox" className='category-checkbox' name="Park"
                /></li>
                <li>Bars <input type="checkbox" className='category-checkbox' name="Bar"
                /></li>
                <li>Meuseums <input type="checkbox" className='category-checkbox' name="Museum"
                /></li>
                <li>Clubs <input type="checkbox" className='category-checkbox' name="Club"
                /></li>
                <li>Coffee Shops <input type="checkbox" className='category-checkbox' name="Cafe"
                /></li>
                </ul>
    
               </div>

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
              <p id='for-search'>For a more complete search use the searchbar above</p>
            </div>
            <input
                id="searchInput"
                type="text"
                placeholder="Place name, tacos, gourmet..."
                name="search"
                ref={viewAll.searchAll}
                onKeyUp={(e) => {
                    matchKeyboardInput(e)
                }}
              />
            <div
              ref={viewAll.allPlacesContainer}
              id="allPlacesContainer"
              onClick={(e) => viewAll.handleTripBtn_handleFavoritesBtn(e)}
            >
              {filteredPlaces.map((place) => (
                <div
                  className="showAllDiv"
                  onClick={(e) =>{
                    if (!e.target.closest('.see-imgs') && !e.target.closest('.showall-tripbtn')) {
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
                  <a className="see-imgs" target="_blank" href={`https://www.google.com/search?q=${place.name + ' ' + place.city}&sca_esv=03047b03c4b9cd9d&sca_upv=1&sxsrf=ADLYWILgzRTFudLq4zqNYw8eEFajutqqOA:1717445774174&source=hp&biw=1536&bih=730&ei=jiReZsKECOLfp84Pt5OM2Q4&iflsig=AL9hbdgAAAAAZl4yntxQz9UCBdnIlSkmNMW5d3qcFKh-&ved=0ahUKEwjCg6eKoMCGAxXi78kDHbcJI-sQ4dUDCA8&uact=5&oq=tatam&gs_lp=EgNpbWciBXRhdGFtMggQABiABBixAzIIEAAYgAQYsQMyCBAAGIAEGLEDMggQABiABBixAzIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABEjED1DuA1jKDXABeACQAQCYAVGgAYIDqgEBNbgBA8gBAPgBAYoCC2d3cy13aXotaW1nmAIGoAKfA6gCCsICBxAjGCcY6gLCAgQQIxgnwgILEAAYgAQYsQMYgwGYAweSBwE2oAeKGw&sclient=img&udm=2`}>See Images</a>
                  <p className="instructions-showall">Click to learn more</p>
                  <div className='show-all-line'></div>
                </div>
              ))}
            </div>
          </div>
        </div></div>
    </>
  )
}

export default ExploreCity