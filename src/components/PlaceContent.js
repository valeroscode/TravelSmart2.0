import "./styles/Miami.css";
import "./styles/Miami2.css";
import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faFireFlameCurved,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";
import { allPlaces } from "./allMarkers.mjs";
import PlaceHome from "./PlaceHome";
import AddTrip_Button from "./AddTrip_Button";
import {
  handleTripAdderPopup,
  handleFavoritesNotifications,
  learnMoreAboutPlace,
} from "./getPlaceInfo.mjs";
import Notification from "./Notification";
import { useAuth } from "./contexts/AuthContext";
import { docMethods } from "./firebase/firebase";
import Lottie from "lottie-react";
import animationData from "./assets/loading-page.json";
import Footer from "./footer";
import HomeHeader from "./HomeHeader";

function PlaceContent() {
  const [serves, setServes] = useState("");
  const [style, setStyle] = useState("");
  const addressText = useRef();
  const [name, setName] = useState("");

  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);

  const heart = useRef();

  useEffect(() => {
    for (let i = 0; i < allPlaces.length; i++) {
      if (localStorage.getItem("current").includes(allPlaces[i].name)) {
        const m = allPlaces[i];
        setServes(m.serves);
        setStyle(m.style);
      }
    }

    var geocoderRev = new window.google.maps.Geocoder();
    geocoderRev.geocode(
      { placeId: localStorage.getItem("ID") },
      function (results, status) {
        if (status === window.google.maps.GeocoderStatus.OK) {
          const request = {
            placeId: localStorage.getItem("ID"),
            fields: ["reviews", "formatted_address"],
          };

          var service = new window.google.maps.places.PlacesService(window.map);
          service.getDetails(request, function (place, status) {
            if (status == "OK") {
              addressText.current.textContent = place.formatted_address;
              for (let i = 0; i < place.reviews.length; i++) {
                renderReviews(place.reviews[i]);
              }
            }
          });
        }
      }
    );
  }, []);

  useEffect(() => {
    // if (currentUser.favorites.includes(heart.current.getAttribute("name"))) {
    //   heart.current.firstElementChild.classList.add("favorite");
    //   heart.current.lastChild.textContent = "ADDED!";
    // }
    setFavorites(currentUser.favorites);
    setName(currentUser.name);
  }, [currentUser]);

  function writeReview(e) {
    const rw = document.getElementById("reviewWriting");

    const yr = document.getElementById("your-review");
    if (e.target.id === "write" && rw) {
      rw.style.display = "block";
      rw.style.width = "30rem";
      setTimeout(() => {
        e.target.textContent = "Post";
      }, 200);
    }
    const ff = document.getElementById("freeform");
    const rf = document.getElementById("rating-field");
    const rc = document.getElementById("reviewsContainer");
    if (e.target.textContent === "Post") {
      if (ff && rf && rc && rw && rc.childNodes.length < 8) {
        if (!yr) {
          if (parseFloat(rf.value) > 5) {
            alert("rating must be out of 5");
            return;
          }
          const div = document.createElement("div");
          div.setAttribute("id", "your-review");
          rc.insertBefore(div, rw);
          div.innerHTML =
            `<h4>Your Review</h4>` +
            `<p>${ff.value}</p>` +
            `<p>Rating: ${rf.value}/5</p><br/>`;
        }
      }
      if (yr && ff && rf && rc && rw && rc.childNodes.length < 9) {
        if (parseFloat(rf.value) > 5) {
          alert("rating must be out of 5");
          return;
        }
        yr.innerHTML =
          `<h4>${
            currentUser ? currentUser.name + "  (You)" : "Your Review"
          }</h4>` +
          `<p>${ff.value}</p>` +
          `<p>Rating: ${rf.value}/5</p><br/>`;
      }
      setTimeout(() => {
        document.getElementById("write").textContent = "Update review";
        rw.style.display = "none";
      }, 200);

      //itegrate database here
    }
    if (e.target.textContent === "Update review") {
      if (yr) {
      }
    }
    if (!e.target.id === "write" && rw) {
      rw.style.display = "none";
      setTimeout(() => {
        e.target.textContent = "Write a review";
      }, 200);
    }
  }

  const reviewsCon = useRef();
  const lottie = useRef();
  const lottieBg = useRef();
  function renderReviews(item) {
    if (reviewsCon.current) {
      if (reviewsCon.current.childNodes.length < 12) {
        const div = document.createElement("div");
        reviewsCon.current.appendChild(div);
        div.innerHTML =
          `<h4>${item.author_name}</h4>` +
          `<p>${item.text}</p>` +
          `<p>Rating: ${item.rating}/5</p><br/>`;
      }
    }
    //}
    if (reviewsCon.current) {
      if (reviewsCon.current.childNodes.length === 5) {
        const button = document.createElement("div");
        const div = document.createElement("div");
        reviewsCon.current.appendChild(div);
        reviewsCon.current.appendChild(button);
        button.innerHTML = `<button id="write">Write a review</button>`;
        div.setAttribute("id", "reviewWriting");
        div.innerHTML = `
      <h4>What do you think of ${localStorage.getItem(
        "current"
      )}?</h4><div><textarea id="rating-field" rows="1" cols="2" placeholder="#"></textarea>/5</div>
      <textarea id="freeform" name="freeform" rows="10" cols="50" placeholder="Write your review"></textarea>
      `;
        const r_field = document.getElementById("rating-field");
        if (r_field) {
          if (parseFloat(r_field.value) > 5) {
            alert("Ratings are out of 5");
            r_field.value = "";
          }
        }
      }
    }
    lottie.current.style.display = "none";
    lottieBg.current.style.display = "none";
  }

  function handleFavoritesBtn(e) {
    if (currentUser) {
      handleFavoritesNotifications(
        favorites,
        e.target,
        e.target.firstElementChild
      );
      if (!favorites.includes(e.target.getAttribute("name"))) {
        favorites.push(e.target.getAttribute("name"));
      } else {
        favorites.splice(favorites.indexOf(e.target.getAttribute("name")), 1);
      }
      //In the case that the user is only clicking the heart, a notification pops up and the favorites class is toggled
      let string = currentUser.email.toString();
      string = currentUser.metadata.createdAt + string.substring(0, 8);
      docMethods.updateFavorites(string, favorites);
      setFavorites(favorites);
      if (!favorites.includes(e.target.getAttribute("name"))) {
        heart.current.lastChild.textContent = "ADD TO FAVORITES";
      } else {
        heart.current.lastChild.textContent = "ADDED!";
      }
    } else {
      alert("Log into your account to add this as a favorite");
    }
  }

  const suggestionIndexes = [];
  for (let i = 0; i < localStorage.getItem("suggestionAmount"); i++) {
    suggestionIndexes.push(i);
  }

  function middleFunction(name, e) {
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

  const priceLS = localStorage.getItem("price");

  const priceStyles = {
    1: { color: priceLS >= 1 ? "black" : "lightgray" },
    2: { color: priceLS >= 2 ? "black" : "lightgray" },
    3: { color: priceLS >= 3 ? "black" : "lightgray" },
    4: { color: priceLS >= 4 ? "black" : "lightgray" },
  };

  return (
    <>
      <HomeHeader name={name} />
      <div ref={lottie} id="lottie">
        <Lottie animationData={animationData} />
      </div>
      <div id="lottie-bg" ref={lottieBg}></div>
      <section id="overall-page" style={{ backgroundColor: "white" }}>
        <div id="top-page-organizer">
          <section id="upper-page-sec">
            <div id="place-container">
              <p className="citytxt">
                {sessionStorage.getItem("city").toLocaleUpperCase()}
              </p>
              <div id="placeImage">
                <img
                  src={require(`../../public/${localStorage.getItem(
                    "current"
                  )}.jpg`)}
                  alt=""
                />
                <div id="rating">
                  <h1 className="rating-yellow">
                    {localStorage.getItem("rating") % 1 === 0
                      ? `${localStorage.getItem("rating")}.0`
                      : localStorage.getItem("rating")}
                  </h1>
                </div>
              </div>

              <div id="placeName">
                <h1 id="h1">{localStorage.getItem("current")}</h1>
                <div id="typeANDarea">
                  <p className="type">
                    {localStorage.getItem("category")}&nbsp; |&nbsp;&nbsp;
                    {localStorage.getItem("area")}
                  </p>
                  <h6 className="perfectFor">
                    Perfect for: &nbsp;{localStorage.getItem("type")} &nbsp;{" "}
                    {serves} &nbsp; {style}
                  </h6>
                  <div className="money-place-div">
                    <p className="money">
                      <strong>
                        <a style={priceStyles[1]}>$</a>
                        <a style={priceStyles[2]}>$</a>
                        <a style={priceStyles[3]}>$</a>
                        <a style={priceStyles[4]}>$</a>
                      </strong>
                    </p>
                    <p ref={addressText} className="address">
                      {localStorage.getItem("address")}
                    </p>
                  </div>
                </div>
                <div id="webANDfave">
                  <hr className="tophr" />
                  <div className="inner">
                    <p
                      id="fave"
                      ref={heart}
                      name={localStorage.getItem("title")}
                      className="click-favorite"
                      onClick={(e) => handleFavoritesBtn(e)}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                      ADD TO FAVORITES
                    </p>
                    <p
                      className="addtotrip trip-adder"
                      name={localStorage.getItem("current")}
                      onClick={(e) => handleTripAdderPopup(e)}
                    >
                      ADD TO TRIP &nbsp;
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        style={{ color: "#2E64FE" }}
                      />
                    </p>
                  </div>
                  <hr className="btmhr" />
                </div>
              </div>
            </div>

            <div id="suggestionsSec">
              <h2>SUGGESTIONS</h2>
              <div className="line"></div>
              <div id="suggestionContainer">
                {suggestionIndexes.map((sugg, index) => (
                  <div
                    onClick={(e) =>
                      middleFunction(
                        localStorage.getItem(`suggestion${index}title`),
                        e
                      )
                    }
                    className={`suggestedPlace ${index}`}
                  >
                    <div></div>
                    <p className="suggfave">
                      {localStorage.getItem(`suggestion${index}favorite`)}
                    </p>
                    <h3 className="suggtitle">
                      {localStorage.getItem(`suggestion${index}title`)}
                      <p className="suggpop">
                        &nbsp;
                        {localStorage.getItem(`suggestion${index}popular`) ===
                        "Popular" ? (
                          <FontAwesomeIcon
                            icon={faFireFlameCurved}
                            style={{ color: "#c20000" }}
                          />
                        ) : (
                          ""
                        )}
                      </p>
                    </h3>
                    <img
                      src={require(`../../public/${localStorage.getItem(
                        `suggestion${index}title`
                      )}.jpg`)}
                      alt=""
                    />
                    <p className="suggarea">
                      {localStorage.getItem(`suggestion${index}area`)}
                    </p>
                    <p className="suggrating">
                      {localStorage.getItem(`suggestion${index}rating`)}
                    </p>
                    <p className="suggtype">
                      {localStorage.getItem(`suggestion${index}type`)}
                    </p>
                    <p className="suggprice">
                      {localStorage.getItem(`suggestion${index}price`)}
                    </p>
                    <hr />
                  </div>
                ))}
                <div className="fadeList-sugg"></div>
              </div>
            </div>
          </section>
        </div>
        <div id="bottom-page-container">
          <p id="reviews-sec-start">REVIEWS</p>

          <div
            id="reviewsContainer"
            onClick={(e) => writeReview(e)}
            ref={reviewsCon}
          ></div>
        </div>
      </section>

      <Notification />
      <AddTrip_Button />
      <Footer />
    </>
  );
}

export default PlaceContent;
