import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./styles/Miami.css";
import "./styles/Miami2.css";
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

function Results() {
  const budgetF = useRef();
  const budgetSec = useRef();
  const highlyRatedSec = useRef();
  const lottie = useRef();
  const lottieBg = useRef();
  const ul = useRef();
  const topRated = useRef();

  const list = [];
  const topRatedArr = [];
  const budget = [];

  const [listState, setListState] = useState([]);
  const [topRatedState, setTopRatedState] = useState([]);
  const [budgetState, setBudgetState] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const { currentUser, info } = useAuth();

  let counter = 0;

  let applied_filters = sessionStorage.getItem("filters").split("/ ,");

  const chevron = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><style>svg{fill:#2261ce}</style><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`;
  let allPlaces_inCity = allPlaces.filter(
    (m) => m.city === sessionStorage.getItem("city")
  );

  function renderResults(parent, data) {
    lottie.current.style.display = "none";
    lottieBg.current.style.display = "none";

    let placeScore = 0;

    const filters = applied_filters.map((filter) => filter.replace(", ", ""));

    filters.map((filter) =>
      filter.includes(data.area.toUpperCase()) ||
      filter.includes(data.category.toUpperCase()) ||
      filter.includes(data.style.toUpperCase())
        ? placeScore++
        : null
    );

    if (placeScore === parseInt(sessionStorage.getItem("total"))) {
      populateWithInfo(parent, data);
    }

    function populateWithInfo(parent, data) {
      var geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ placeId: data.placeID }, function (results, status) {
        //All that is needed is the reviews because all other attributes can be retrieved from the allPlaces array
        if (status === window.google.maps.GeocoderStatus.OK) {
          const request = {
            placeId: data.placeID,
            fields: ["reviews"],
          };
          var service = new window.google.maps.places.PlacesService(window.map);
          service.getDetails(request, function (place, status) {
            if (status === "OK") {
              if (parent === undefined) {
                return;
              }
              if (!parent.innerText.includes(data.name)) {
                data.reviews = place.reviews[0].text;
                data.author_name = place.reviews[0].author_name;
                if (parent === budgetF.current) {
                  budget.push(data);
                }

                if (parent === topRated.current) {
                  topRatedArr.push(data);
                }

                if (parent === ul.current) {
                  list.push(data);
                }

                if (counter === allPlaces_inCity.length) {
                  setListState([...list]);
                  setTopRatedState([...topRatedArr]);
                  setBudgetState([...budget]);
                }
              }
            }
          });
        }
      });
    }
  }

  useEffect(() => {
    document.getElementById("google-map").style.display = "none";
    //Array containing all places in the current city
    for (let i = 0; i < allPlaces_inCity.length; i++) {
      counter++;
      renderResults(ul.current, allPlaces_inCity[i]);
      if (allPlaces[i].rating >= 3.5) {
        renderResults(topRated.current, allPlaces_inCity[i]);
      }
      if (allPlaces[i].price <= 2) {
        renderResults(budgetF.current, allPlaces_inCity[i]);
      }
    }

    if (currentUser) {
      function loadPage() {
        if (!info.favorites) {
          window.setTimeout(loadPage, 200);
        } else {
          setFavorites(info.favorites);
          markFavorites();
        }
      }
      loadPage();
    }
  }, []);

  useEffect(() => {
    console.log("state changed ooooo");
  }, [listState, topRatedState, budgetState]);

  //Handles clicks for each card
  function handleCardClicks(e, name) {
    console.log(e.target.classList);
    if (e.target.classList.contains("trip-adder")) {
      handleTripAdderPopup(e);
    } else if (e.target.classList.contains("fa-heart")) {
      if (currentUser) {
        if (!favorites.includes(name)) {
          handleFavoritesNotifications(
            favorites,
            e.target,
            e.target.firstElementChild
          );
          favorites.push(name);
          //In the case that the user is only clicking the heart, a notification pops up and the favorites class is toggled
          setFavorites(favorites);
        } else {
          handleFavoritesNotifications(
            favorites,
            e.target,
            e.target.firstElementChild
          );
          favorites.splice(favorites.indexOf(name), 1);
          setFavorites(favorites);
        }
        let string = currentUser.email.toString();
        string = currentUser.metadata.createdAt + string.substring(0, 8);
        docMethods.updateFavorites(string, favorites);
      }
    } else {
      const place = allPlaces.filter((place) => place.name === name);
      learnMoreAboutPlace(
        place[0].name,
        place[0].rating,
        place[0].type,
        place[0].area,
        place[0].price,
        place[0].name,
        place[0].favorite,
        place[0].category,
        place[0].placeID,
        e.target
      );
    }
  }

  function markFavorites() {
    //Ensures that favorite hearts are consistant acorss several sections

    const favorite_btns = document.getElementsByClassName("fa-heart");
    for (let i = 0; i < favorite_btns.length; i++) {
      console.log(favorite_btns[i]);
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

  return (
    <>
      <PlaceHome />
      <div id="lottie" ref={lottie}>
        <Lottie animationData={animationData} />
      </div>
      <div id="lottie-bg" ref={lottieBg}></div>
      <section id="parent-section" style={{ backgroundColor: "white" }}>
        <section
          id="budget-best-section"
          style={
            budgetState.length === 0 && topRatedState.length === 0
              ? { display: "none" }
              : null
          }
        >
          <section
            ref={budgetSec}
            id="budget-section"
            style={budgetState.length === 0 ? { display: "none" } : null}
          >
            <h5 id="budget-text">
              <p>MOST BUDGET FRIENDLY</p>
              <div></div>
            </h5>
            <ul
              ref={budgetF}
              id="budget-f"
              onClick={(e) =>
                handleCardClicks(
                  e,
                  e.target.closest(".results-div").getAttribute("name")
                )
              }
            >
              {budgetState.map((place) => (
                <li className="slideFadeIn">
                  <div
                    area={place.area}
                    name={place.name}
                    type={place.type}
                    rating={place.rating}
                    price={place.price}
                    favorite={place.favorite}
                    className="results-div"
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{ color: "lightgray" }}
                    />
                    <div className="line"></div>
                    <div className="results-img">
                      <img
                        className="place-img"
                        src={require(`../../public/${place.name}.jpg`)}
                      ></img>
                      <div id="rating-div">
                        <p>{place.rating}</p>
                      </div>
                    </div>
                    <div id="results-content">
                      <h5 className="place-name">{place.name}</h5>
                      <h6>{place.reviews}</h6>
                      <h6 className="author-name">- {place.author_name}</h6>
                      <div className="div-btm">
                        <p>
                          {place.category} · {place.area}
                        </p>
                        <h4 id="adder" className="trip-adder" name={place.name}>
                          Add to trip
                        </h4>
                      </div>
                    </div>
                    <hr />
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section
            ref={highlyRatedSec}
            id="highly-rated-section"
            style={topRatedState.length === 0 ? { display: "none" } : null}
          >
            <h5 id="top-rated-text">
              TOP RATED SPOTS
              <div></div>
            </h5>
            <ul
              id="top-rated"
              ref={topRated}
              onClick={(e) =>
                handleCardClicks(
                  e,
                  e.target.closest(".results-div").getAttribute("name")
                )
              }
            >
              {topRatedState.map((place) => (
                <li className="slideFadeIn">
                  <div
                    area={place.area}
                    name={place.name}
                    type={place.type}
                    rating={place.rating}
                    price={place.price}
                    favorite={place.favorite}
                    className="results-div"
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{ color: "lightgray" }}
                    />
                    <div className="line"></div>
                    <div className="results-img">
                      <img
                        className="place-img"
                        src={require(`../../public/${place.name}.jpg`)}
                      ></img>
                      <div id="rating-div">
                        <p>{place.rating}</p>
                      </div>
                    </div>
                    <div id="results-content">
                      <h5 className="place-name">{place.name}</h5>
                      <div className="div-btm">
                        <p>
                          {place.category} · {place.area}
                        </p>
                        <h4 id="adder" className="trip-adder" name={place.name}>
                          Add to trip
                        </h4>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </section>
        <section
          id="placeList"
          style={
            budgetState.length === 0 && topRatedState.length === 0
              ? { top: "6rem" }
              : null
          }
        >
          <ul
            id="filteredResults_List"
            ref={ul}
            onClick={(e) =>
              handleCardClicks(
                e,
                e.target.closest(".results-div").getAttribute("name")
              )
            }
          >
            <h6 className="filter-summary">
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="fa-paper-plane backdrop-plane"
                style={{ color: "#2e64fe" }}
              />
              {applied_filters}
            </h6>

            {listState.map((place) => (
              <li className="slideFadeIn">
                <div
                  area={place.area}
                  name={place.name}
                  type={place.type}
                  rating={place.rating}
                  price={place.price}
                  favorite={place.favorite}
                  className="results-div"
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    style={{ color: "lightgray" }}
                  />
                  <div className="line"></div>
                  <div className="results-img">
                    <img
                      className="place-img"
                      src={require(`../../public/${place.name}.jpg`)}
                    ></img>
                    <div id="rating-div">
                      <p>{place.rating}</p>
                    </div>
                  </div>
                  <div id="results-content">
                    <h5 className="place-name">{place.name}</h5>
                    <h6 className="review-text">{place.reviews}</h6>
                    <h6 className="author-name">- {place.author_name}</h6>
                    <div className="div-btm">
                      <p>
                        {place.category} · {place.area}
                      </p>
                      <h4 id="adder" className="trip-adder" name={place.name}>
                        Add to trip
                      </h4>
                    </div>
                  </div>
                  <hr />
                </div>
              </li>
            ))}

            {listState.length !== 0 ? null : (
              <p className="no-results-text">
                OOPS! There's no places that match the filters you chose. Try a
                different search.
              </p>
            )}
          </ul>
        </section>

        <Notification />
        <AddTrip_Button />
      </section>
      <Footer />
    </>
  );
}

export default Results;
