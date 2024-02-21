import React, { useEffect, useRef, useState } from "react";
import allPlaces from "./allMarkers.mjs";
import { useAuth } from "./contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faHeart,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  learnMoreAboutPlace,
  handleFavoritesNotifications,
  handleTripAdderPopup,
} from "./getPlaceInfo.mjs";
import { docMethods } from "./firebase/firebase";
import "./styles/Miami.css";

function Suggestions() {
  const { currentUser, info } = useAuth();
  const user = currentUser.currentUser;
  const [favoritesArr, setFavoritesArr] = useState([]);
  const [finalRender, setFinalRender] = useState([]);

  //State is used to render the component 2500 milliseconds after loading. This delay is for the data to be loaded from AuthContext. This matches the time it takes for the
  //loading screen to go away and the delay for the script in the Miami.mjs file

  //Once rendered, a 2.5 second counter takes place. At the end of the counter the data has been recieved and the component is re-rendered if there is a user logged in
  useEffect(() => {
    if (currentUser) {
      setTimeout(() => {
        info.favorites.map((place) =>
          !favoritesArr.includes(place) ? favoritesArr.push(place) : null
        );
        setFavoritesArr(favoritesArr);
        createSuggestions();
      }, 2500);
    }
  }, []);

  function handleTripBtn_handleFavoritesBtn(e) {
    if (
      !e.target.classList.contains("click-favorite") &&
      !e.target.classList.contains("trip-adder")
    ) {
      return;
    } else {
      if (currentUser && e.target.classList.contains("click-favorite")) {
        //In the case that the user is only clicking the heart, a notification pops up and the favorites class is toggled
        handleFavoritesNotifications(
          e.target,
          e.target.firstElementChild.firstElementChild
        );
        let string = currentUser.email.toString();
        string = currentUser.metadata.createdAt + string.substring(0, 8);
        docMethods.updateFavorites(string, favoritesArr);
      }
      if (e.target.classList.contains("trip-adder")) {
        handleTripAdderPopup(e);
      }
    }
  }

  //arr is used to store the place types and styles of the users favorites
  let arr = [];

  function createSuggestions() {
    //Grabs all the places within the current city
    const placesIn_City = allPlaces.filter(
      (place) => place.city === sessionStorage.getItem("city")
    );

    //Suggestions go by matching place types and styles
    placesIn_City.map((marker) =>
      favoritesArr.includes(marker.name) && arr.indexOf(marker.type) === -1
        ? arr.push(marker.type)
        : null
    );
    placesIn_City.map((marker) =>
      favoritesArr.includes(marker.name) && arr.indexOf(marker.style) === -1
        ? arr.push(marker.style)
        : null
    );

    placesIn_City.map((marker) =>
      finalRender.indexOf(marker.name) === -1 &&
      marker.rating >= 4 &&
      arr.includes(marker.type) &&
      arr.includes(marker.style)
        ? finalRender.push(marker)
        : null
    );
    placesIn_City.map((marker) =>
      finalRender.indexOf(marker.name) === -1 &&
      marker.rating >= 4 &&
      arr.includes(marker.type) &&
      !arr.includes(marker.style)
        ? finalRender.push(marker)
        : null
    );
    placesIn_City.map((marker) =>
      finalRender.indexOf(marker.name) === -1 &&
      marker.rating < 4 &&
      marker.rating >= 3.3 &&
      arr.includes(marker.type)
        ? finalRender.push(marker)
        : null
    );

    finalRender.map((marker) =>
      favoritesArr.includes(marker.name)
        ? finalRender.splice(finalRender.indexOf(marker), 1)
        : null
    );

    const trimArray = (number) => {
      if (finalRender.length > number) {
        finalRender = finalRender.filter((place, index) => index < number);
      }
    };

    const w = window.innerWidth;
    switch (true) {
      case w > 1800:
        trimArray(20);
        break;
      case w < 1800 && w >= 1600:
        trimArray(16);
        break;
      case w < 1600 && w >= 1400:
        trimArray(14);
        break;
      case w < 1400 && w >= 1300:
        trimArray(12);
        break;
      case w < 1300 && w >= 1200:
        trimArray(10);
        break;
      case w < 1200:
        trimArray(8);
        break;
    }

    setFinalRender(finalRender);
  }

  function writeDatabaseFavorites(e) {
    if (!e.target.classList.contains("click-favorite")) {
      return;
    } else {
      if (currentUser) {
        //In the case that the user is only clicking the heart, a notification pops up and the favoritesArr class is toggled
        handleFavoritesNotifications(
          e.target,
          e.target.firstElementChild.firstElementChild
        );
        let string = currentUser.email.toString();
        string = currentUser.metadata.createdAt + string.substring(0, 8);
        docMethods.updateFavorites(string, favoritesArr);
      }
    }
  }

  //Array containing all places in the current city
  let allPlaces_inCity = allPlaces.filter(
    (m) => m.city === sessionStorage.getItem("city")
  );
  //Function sets the current city, used at various points
  function switchCity() {
    allPlaces_inCity = allPlaces.filter(
      (m) => m.city === sessionStorage.getItem("city")
    );
  }

  //Object that handles everything having to do with viewing all places within a city within the suggestions section
  const viewAll = {
    //Refs to elements
    allPlacesContainer: useRef(),
    gridViewBtn: useRef(),
    suggestionsDiv: useRef(),
    searchText: useRef(),
    cities: [],
    citiesShowAll: useRef(),
    arrows: useRef(),
    searchAll: useRef(),
    suggSection: useRef(),
    //Dynamically renders all avaliable cities for selection when viewing all places
    renderCities_andSelect: function () {
      if (this.cities.length === 0) {
        for (let i = 0; i < allPlaces.length; i++) {
          if (!this.cities.includes(allPlaces[i].city)) {
            this.cities.push(allPlaces[i].city);
          }
        }
        for (let i = 0; i < this.cities.length; i++) {
          const citytext = document.createElement("p");
          citytext.innerHTML = `${this.cities[i]}`;
          this.citiesShowAll.current.appendChild(citytext);
        }
      }
    },
    //Handles what happens once the grid-view button is pressed
    toggleGridView: function () {
      //Handles all of the styling of the div and prepares it for content to be rendered onto it
      this.gridViewBtn.current.textContent = "Hide Places";
      var hidePlaces = this.gridViewBtn.current.cloneNode(true);
      this.gridViewBtn.current.style.display = "none";
      this.suggestionsDiv.current.insertBefore(
        hidePlaces,
        this.allPlacesContainer.current
      );
      this.searchText.current.appendChild(hidePlaces);
      hidePlaces.setAttribute("id", "hideplaces-btn");
      hidePlaces.classList.add("seachNode");
      this.renderCities_andSelect();
      switchCity();
      this.allPlacesContainer.current.style.height = "40rem";
      this.suggSection.current.style.position = "relative";
      this.suggSection.current.style.display = "flex";
      this.suggSection.current.style.justifyContent = "space-between";
      this.suggSection.current.style.bottom = "2rem";
      this.suggSection.current.style.left = "7%";
      this.arrows.current.style.left = "7%";
      if (window.innerWidth <= 1300) {
        this.suggSection.current.style.left = 0;
      }
      //Resets the #allPlaces container preparing it for the next call of the showAll function
      this.allPlacesContainer.current.innerHTML = "";
      this.searchAll.current.style.display = "flex";
      this.searchText.current.style.display = "flex";
      document.getElementById("change-city-showall").style.display = "block";
      this.suggestionsDiv.current.insertBefore(
        this.searchAll.current,
        this.allPlacesContainer.current
      );
      //Creates all places within the current city and places them in #allPlacesContainer
      this.showAll();
      //The boolean at line 254 becomes true and the code after it is executed
    },
    //The following function manipulates elements in 2 places within the page
    handleCitySwitch_ViewAll: function (e) {
      //resets the #allPlacesContainer so that theres no places from multiple different cities
      this.allPlacesContainer.current.innerHTML = "";
      //Handles places within a city being rendered in the div once the user clicks on a different city
      if (this.cities.includes(e.target.textContent)) {
        //Pans the map to the new city
        //document.getElementById('map').panTo(options[e.target.textContent]);
        //Sets the new city is session sessionstorage
        sessionStorage.setItem("city", e.target.textContent);
        //Changes text of map modal
        document.getElementById(
          "best-places-text"
        ).innerHTML = `Best Places in ${e.target.textContent}`;
        //Loops through the children of the dropdown menu in the map modal and bolds the new city's text
        for (let i = 0; i < e.target.parentNode.children.length; i++) {
          e.target.parentNode.childNodes[i].style.fontWeight = 400;
        }
        e.target.style.fontWeight = 800;

        //Sets current city in the variable
        switchCity();

        //Creates all places within the current city and places them in #allPlacesContainer
        this.showAll();

        //renderSponsoredPlaces();

        //Boldens the city that was just selected within the #allPlacesContainer
        for (let i = 0; i < this.citiesShowAll.current.childNodes.length; i++) {
          this.citiesShowAll.current.childNodes[i].style.fontWeight = 200;
          this.citiesShowAll.current.childNodes[i].style.color = "white";
        }
        e.target.style.fontWeight = 800;
        e.target.style.color = "lightgray";
      }
    },
    showAll: function () {
      //Creats a document fragment which will be used to append all of the showAllDiv elements, this was done for performance reasons
      //The fragment enables the code to only append to the DOM once vs appending to the DOM on each iteration
      const fragment = document.createDocumentFragment();
      //TODO: Consider using document.createElement() instead of element.innerHTML to enable the code below to run faster
      allPlaces_inCity.map((place) => {
        const base64encodeAsset = require(`./assets/${place.name}.jpg`);
        const showAllDiv = document.createElement("div");
        showAllDiv.classList.add("showAllDiv");
        showAllDiv.innerHTML = `
            <a href="/place" target="_blank"></a>
            <img src=${base64encodeAsset} class="carousel-image"></img>
            <p class="showall-text">${place.name}</p>
            <p class="ratingdd">${place.rating}</p>
            <div class="lowerDiv"><p class="cat-showall">${
              place.category
            }</p><p class="click-favorite showall-heart" name=${
          place.name
        } aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" class="favorite"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"></path></svg></p></div>
            <button class="showall-tripbtn trip-adder" name="${
              place.name
            }">Add to Trip</button>
            <div class="infoDiv-showall"><p class="area-showall">${
              place.area
            }</p><p class="price-showall">${"$".repeat(
          parseInt(place.price)
        )}</p></div>
            <p class="instructions-showall">Click to learn more</p>`;
        fragment.appendChild(showAllDiv);
      });
      this.allPlacesContainer.current.appendChild(fragment);
      this.hidePlaces();
    },
    //Handles hiding the #allPlacesContainer and styling elements
    hidePlaces: function () {
      document
        .getElementById("hideplaces-btn")
        .addEventListener("click", (e) => {
          this.citiesShowAll.current.style.display = "none";
          this.allPlacesContainer.current.style.height = 0;
          this.searchAll.current.style.display = "none";
          this.searchText.current.style.display = "none";
          this.suggestionsDiv.current.removeChild(this.searchAll.current);
          this.allPlacesContainer.current.innerHTML = "";
          this.gridViewBtn.current.textContent = "View All Places";
          this.gridViewBtn.current.style.display = "block";
          this.gridViewBtn.current.style.top = "5rem";
          this.allPlacesContainer.current.style.height = 0;
          this.suggSection.current.style.left = 0;
          this.arrows.current.style.left = 0;
          this.suggSection.current.style.bottom = "1rem";
          this.suggSection.current.style.paddingTop = "2rem";
          e.target.remove();
        });
    },
  };

  const handleCarousel = {
    slideCarousel: function (e) {
      const slide = document.getElementsByClassName("inner_carousel");
      const left_arrow = document.getElementById("left_arrow");
      const right_arrow = document.getElementById("right_arrow");
      for (let i = 0; i < slide.length; i++) {
        if (e.target === right_arrow) {
          right_arrow.style.opacity = 0.5;
          left_arrow.style.opacity = 1;
          right_arrow.style.pointerEvents = "none";
          left_arrow.style.pointerEvents = "all";

          const slide_frames = new KeyframeEffect(
            slide[i],
            [
              {
                transform: `translateX(0)`,
              },
              {
                transform: `translateX(${(window.innerWidth / 3.5) * -1}%)`,
              },
            ],
            {
              duration: 400,
              fill: "forwards",
              easing: "ease-in-out",
            }
          );

          const slidesAnimation = new Animation(
            slide_frames,
            document.timeline
          );
          slidesAnimation.play();
        } else if (e.target === left_arrow) {
          left_arrow.style.opacity = 0.5;
          right_arrow.style.opacity = 1;
          right_arrow.style.pointerEvents = "all";
          left_arrow.style.pointerEvents = "none";

          const slide_framesBack = new KeyframeEffect(
            slide[i],
            [
              {
                transform: `translateX(${(window.innerWidth / 3.5) * -1}%)`,
              },
              {
                transform: `translateX(0)`,
              },
            ],
            {
              duration: 400,
              fill: "forwards",
              easing: "ease-in-out",
            }
          );

          const slideBackAnimation = new Animation(
            slide_framesBack,
            document.timeline
          );
          slideBackAnimation.play();
        }
      }
    },
  };

  return (
    <>
      <div id="suggestions" ref={viewAll.suggestionsDiv}>
        <h1
          style={{ display: "none" }}
          ref={viewAll.searchText}
          id="searchText"
        >
          Where we goin'?
        </h1>
        <div
          ref={viewAll.citiesShowAll}
          onClick={(e) => viewAll.handleCitySwitch_ViewAll(e)}
          id="change-city-showall"
        ></div>
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
          onClick={(e) => handleTripBtn_handleFavoritesBtn(e)}
        ></div>
        <div ref={viewAll.suggSection} id="suggestions-section">
          <h4 id="suggH4" style={{}}>
            Have you checked these out?
          </h4>
          <button
            onClick={(e) => viewAll.toggleGridView(e)}
            className="seachNode"
            id="grid-view"
            ref={viewAll.gridViewBtn}
            style={{ display: "inline" }}
          >
            View All Places
          </button>
        </div>
        <div id="outerCarousel">
          {finalRender.length === 0 ? (
            <div className="no-suggestions">
              Add places to your favoritesArr and get suggestions!
            </div>
          ) : null}
          <div>
            <div
              ref={viewAll.arrows}
              id="arrows"
              onClick={(e) => handleCarousel.slideCarousel(e)}
            >
              <FontAwesomeIcon
                icon={faAngleDown}
                className="c-arr-l"
                id="left_arrow"
              />{" "}
              <FontAwesomeIcon
                icon={faAngleDown}
                className="c-arr-r"
                id="right_arrow"
              />
            </div>
            <div id="carousel">
              {finalRender.map((item) => (
                <div
                  onClick={(e) =>
                    learnMoreAboutPlace(
                      item.name,
                      item.rating,
                      item.type,
                      item.area,
                      item.price,
                      item.name,
                      item.favorite,
                      item.category,
                      item.placeID,
                      e.target
                    )
                  }
                  key={item.name}
                  className="inner_carousel carousel_fadeIn2"
                >
                  <img
                    className="carousel-image carousel_fadeIn2"
                    src={require(`./assets/${item.name}.jpg`)}
                    alt=""
                  />
                  <div className="lowerDiv carousel_fadeIn">
                    <p className="carousel-text carousel_fadeIn">{item.name}</p>
                    <p className="carousel-cat">
                      {item.category}
                      <div className="infoDiv_">
                        <p className="carousel-info carousel_fadeIn c_area">
                          {item.area}
                        </p>
                        {item.price === "NA" ? null : (
                          <p className="carousel-info carousel_fadeIn c_price">
                            {"$".repeat(item.price)}
                          </p>
                        )}
                      </div>
                    </p>
                    <p className="instruction-carousel">Click to learn more</p>
                    <p
                      className="carousel-heart click-favorite"
                      onClick={(e) => writeDatabaseFavorites(e)}
                      name={item.name}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                    </p>
                    <button
                      className="carousel-addtrip trip-adder"
                      name={item.name}
                      onClick={(e) => handleTripAdderPopup(e)}
                    >
                      Add to Trip
                    </button>
                  </div>
                  <p className="carousel_fadeIn c_rating carousel-info">
                    {item.rating % 1 === 0 ? `${item.rating}.0` : item.rating}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Suggestions;
