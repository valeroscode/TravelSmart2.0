import React, { useEffect, useState, createElement, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faHouse,
  faAngleDown,
  faUser,
  faBars,
  faChevronRight,
  faMagnifyingGlass,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/Miami.css";
import "./styles/Miami2.css";
import allPlaces from "./allMarkers.mjs";
import Lottie from "lottie-react";
import animationData from "./assets/loading-page.json";
import AddTrip_Button from "./AddTrip_Button";
import { handleTripAdderPopup, learnMoreAboutPlace } from "./getPlaceInfo.mjs";
import Notification from "./Notification";
import PlaceHome from "./PlaceHome";

function Results() {
  const budgetF = useRef();
  const budgetSec = useRef();
  const highlyRatedSec = useRef();
  const lottie = useRef();
  const lottieBg = useRef();

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
      populateWithInfo();
    }

    function populateWithInfo() {
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
            if (status == "OK") {
              if (!parent.innerText.includes(data.name)) {
                let li = document.createElement("li");
                const image = require(`./assets/${data.name}.jpg`);
                li.innerHTML =
                  `<div area='${data.area}' name='${data.name}' 
           type='${data.type}' rating='${data.rating}' price='${data.price}' 
           favorite='${data.favorite}'
            class="results-div">
            <i class="fa fa-regular fa-heart"></i>
            <div class="line"></div><div class="results-img">
            <img class='place-img' src='${image}'/>
            <div id='rating-div'><p>${data.rating}</p></div></div>` +
                  `<div id="results-content">` +
                  `<h5 class='place-name'>${data.name}</h5>` +
                  `<h6>${place.reviews[0].text}</h6>` +
                  `<div class='div-btm'>` +
                  `<p>${data.category} · ${data.area}</p>` +
                  `<h4 id='adder' class='trip-adder' name='${data.name}'>Add to trip ${chevron}` +
                  `</div></div>` +
                  `</div>` +
                  "<hr/>";

                parent.appendChild(li);
                li.classList.add("slideFadeIn");
              }
            }
          });
        }
      });
    }
  }

  const ul = useRef();
  const topRated = useRef();
  const sorryText = useRef();

  useEffect(() => {
    //Array containing all places in the current city
    for (let i = 0; i < allPlaces_inCity.length; i++) {
      renderResults(ul.current, allPlaces_inCity[i]);
      if (allPlaces[i].rating >= 3.5) {
        renderResults(topRated.current, allPlaces_inCity[i]);
      }
      if (allPlaces[i].price <= 2) {
        renderResults(budgetF.current, allPlaces_inCity[i]);
      }
      if (i === allPlaces_inCity.length - 1) {
        setTimeout(() => {
          if (ul.current.children.length === 2) {
            sorryText.current.style.display = "flex";
          }
        }, 1500);
      }
    }
  }, []);

  //Handles clicks for each card
  function handleCardClicks(e, name) {
    if (e.target.classList.contains("trip-adder")) {
      handleTripAdderPopup(e);
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

  return (
    <>
      <PlaceHome />
      <div id="lottie" ref={lottie}>
        <Lottie animationData={animationData} />
      </div>
      <div id="lottie-bg" ref={lottieBg}></div>
      <section id="parent-section" style={{ backgroundColor: "white" }}>
        <section id="budget-best-section">
          <section ref={budgetSec} id="budget-section">
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
            ></ul>
          </section>
          <section ref={highlyRatedSec} id="highly-rated-section">
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
            ></ul>
          </section>
        </section>
        <section id="placeList">
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
            <h6>
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="fa-paper-plane backdrop-plane"
              />
              {applied_filters}
            </h6>

            <p ref={sorryText} className="no-results-text">
              OOPS! There's no places that match the filters you chose. Try a
              different search.
            </p>
          </ul>
        </section>

        <Notification />
        <AddTrip_Button />
      </section>
    </>
  );
}

export default Results;
