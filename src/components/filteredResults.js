import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
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

  const list = [];
  const topRatedArr = [];
  const budget = [];
  const [places, setPlaces] = useState([])
  const [listState, setListState] = useState([]);
  const [topRatedState, setTopRatedState] = useState([]);
  const [budgetState, setBudgetState] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [name, setName] = useState("")

  const { currentUser } = useAuth();

  useEffect(() => {
    setName(currentUser.name);
  }, [currentUser]);

  useEffect(() => {
    setPlaces(allPlaces.filter(
      (m) => m.city === sessionStorage.getItem("city")
    ));
  }, [])

  let counter = 0;

  let applied_filters = sessionStorage.getItem("filters").split("/ ,");

  const chevron = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><style>svg{fill:#2261ce}</style><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`;
  



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

  return (
    <>
      <HomeHeader name={name} />


      <section id="results-overall-org">
        <h5 id="filters-breakdown">Mexican</h5>
        <div id="best-rated-places">
          <h4>Best Rated</h4>
          <div>
            {
              places.map((place) => {
                if (place.rating > 3.5) {
                (
                  <div>
                  <div>
                  <h4>{place.rating}</h4>
                  <h3>{place.name}</h3>
                  </div>

                  <div>

                  </div>
                  </div>


                )
                }
              })
            }
          </div>
        </div>
        <div id="budget-friendly">
          <h4>Budget Friendly</h4>
          <div>
            {
              places.map((place) => {
                if (place.price <= 2) {
                  (
                    <div>
                      <h4>{place.rating}</h4>
                      <h3>{place.name}</h3>
                    </div>
                  )
                }
              })
            }
          </div>
        </div>

        <div id="all-results">
          <h4>Tacos In Miami</h4>
          <div id="all-results-filters">
            <button>Category ▼</button>
            <button>Price ▼</button>
            <button>Style ▼</button>
            <button>Serves ▼</button>
            <button>Area ▼</button>
          </div>

          <input type="text" placeholder="Search Places"></input>
          <div>
            {
              places.map((place) => (
                 <div className="place-div">
                   <div className="place-div-name-rating">
                    <h4>{place.rating}</h4>
                    <h3>{place.name}</h3>
                   </div>
                    <h4 className="place-div-category-area">{place.category} In {place.area}</h4>
                    <h4 className="place-div-style">{place.style}</h4>
                    <h5 className="place-div-serves">Serves {place.serves}</h5>
                    <p className="place-div-tags">Inexpensive</p>
                    <hr/>
                    <button>Add To Trip</button>
                    <button>Learn More</button>
                    <button>See Images</button>
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
