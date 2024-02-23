import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faAngleDown,
  faHouse,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { applied_filters } from "./getPlaceInfo.mjs";
import "./styles/Navbar.css";
import allPlaces from "./allMarkers.mjs";
import { Link } from "react-router-dom";
import { learnMoreAboutPlace } from "./getPlaceInfo.mjs";
import { useAuth } from "./contexts/AuthContext";
import Hamburger from "./Hamburger";
import XButton from "./XButton";

function PlaceHome() {
  const areasCon = useRef();
  const plane = useRef();

  const anchor = document.getElementsByClassName("anchor");
  const logo = useRef();
  const navElements = useRef();
  const header = useRef();
  const placeSearch = useRef();
  let typeScore = 0;
  let areaScore = 0;
  let catScore = 0;

  const { currentUser, info, logout } = useAuth();
  const [firstname, setFirstname] = useState("");
  const helloUser = useRef();
  const tripsBtn = useRef();
  const homeBtn = useRef();

  useEffect(() => {
    if (currentUser) {
      setTimeout(() => {
        setFirstname(info.name);
      }, 500);
    }
  });

  const currCity = allPlaces.filter(
    (place) => place.city === sessionStorage.getItem("city")
  );

  let overlay_on = false;

  let newArr;
  var count = 0;

  window.addEventListener("click", (e) => {
    if (e.target.id === "overlay") {
      overlay_on = false;

      const overlay = document.getElementById("overlay");
      if (overlay) {
        overlay.remove();
      }
      const dropdownDiv = document.getElementsByClassName("dropdown-div");
      if (dropdownDiv) {
        for (let i = 0; i < dropdownDiv.length; i++) {
          dropdownDiv[i].remove();
        }
      }
    }
    if (e.target.type === "checkbox" && e.target.closest(".filter-container")) {
      var str = e.target.previousSibling.textContent;
      if (e.target.checked === true) {
        if (e.target.closest("#types-filter")) {
          typeScore = 1;
        }
        if (e.target.closest("#categories-filter")) {
          catScore = 1;
        }
        if (e.target.closest("#areas-filter")) {
          areaScore = 1;
        }
        applied_filters.push(str);
        newArr = applied_filters.filter(
          (item, index) => applied_filters.indexOf(item) === index
        );
      } else if (e.target.checked === false) {
        applied_filters.splice(applied_filters.indexOf(str), 1);
        newArr.splice(newArr.indexOf(str), 1);

        if (e.target.closest("#types-filter")) {
          let checked;
          for (
            let i = 0;
            i < e.target.closest("#types-container").children.length;
            i++
          ) {
            if (
              e.target.closest("#types-container").children[i].childNodes[1]
                .checked
            ) {
              checked = true;
            }
            if (
              i === e.target.closest("#types-container").children.length - 1 &&
              checked !== true
            ) {
              typeScore = 0;
            }
          }
        }
        if (e.target.closest("#categories-filter")) {
          let checked;
          for (
            let i = 0;
            i < e.target.closest("#categories-container").children.length;
            i++
          ) {
            if (
              e.target.closest("#categories-container").children[i]
                .childNodes[1].checked
            ) {
              checked = true;
            }
            if (
              i ===
                e.target.closest("#categories-container").children.length - 1 &&
              checked !== true
            ) {
              catScore = 0;
            }
          }
        }
        if (e.target.closest("#areas-filter")) {
          let checked;
          for (
            let i = 0;
            i < e.target.closest("#areas-container").children.length;
            i++
          ) {
            if (
              e.target.closest("#areas-container").children[i].childNodes[1]
                .checked
            ) {
              checked = true;
            }
            if (
              i === e.target.closest("#areas-container").children.length - 1 &&
              checked !== true
            ) {
              areaScore = 0;
            }
          }
        }
      }
    }
  });

  function searchResults() {
    document.body.append(document.getElementById("google-map"));
    if (newArr) {
      if (newArr.length > 0) {
        applied_filters.splice(0, applied_filters.length);
        newArr.map(
          (item) =>
            applied_filters.push(item.toLocaleUpperCase()) &&
            applied_filters.push(" / ")
        );
        applied_filters.pop();
        sessionStorage.setItem("total", catScore + typeScore + areaScore);
        sessionStorage.setItem("filters", applied_filters);
        window.location.replace(
          "https://travelsmart2-0.onrender.com/#/Search-Results"
        );
      }
    }
  }

  const showDropdown = () => {
    const star = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"style="
    height: 1rem;
    position: relative;
    top: 0.2rem;
"><path fill="#FFD43B" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`;
    if (overlay_on === false) {
      overlay_on = true;
      const overlay = document.createElement("div");
      overlay.setAttribute("id", "overlay");
      document.body.appendChild(overlay);
      const dropdownDiv = document.createElement("div");
      dropdownDiv.classList.add("dropdown-div");
      navElements.current.appendChild(dropdownDiv);
      for (let i = 0; i < currCity.length; i++) {
        const a = document.createElement("a");
        a.classList.add("anchor");
        a.innerHTML =
          `<div class="div-wrapper-search"><p class="DDtitle">${currCity[i].name}</p>` +
          `<div class="wrapper-place" style="
          display: flex;
          align-items: center;
      "><img src="${currCity[i].name}.jpg" />
           <div class="floater"><p class="DDp" style="display: flex;">${currCity[i].rating}${star}</p>` +
          `<p class="DDp">${currCity[i].area}</p>` +
          `<p class="DDp">${currCity[i].category}</p></div>
          </div></div>`;
        a.setAttribute("name", currCity[i].name);
        a.setAttribute("rating", currCity[i].rating);
        a.setAttribute("type", currCity[i].type);
        a.setAttribute("area", currCity[i].area);
        a.setAttribute("price", currCity[i].price);
        a.setAttribute("favorite", currCity[i].favorite);
        dropdownDiv.appendChild(a);
        dropdownDiv.classList.add("opacity1");
      }
    }
  };

  function searchPlaces(e) {
    for (let i = 0; i < anchor.length; i++) {
      const text = e.target.value;
      if (
        !anchor[i] ||
        !anchor[i].innerText.toLowerCase().includes(text.toLowerCase())
      ) {
        anchor[i].style.display = "none";

        if (anchor[i].style.display === "none") {
          count++;
          if (count >= anchor.length) {
            noMatches(text);
          }
        }
      } else {
        count = 0;
        anchor[i].style.display = "block";
        setTimeout(() => {
          noMatches(text);
        }, 400);
      }
    }
  }

  function noMatches(txt) {
    let noMatch = document.createElement("div");
    noMatch.classList.add("noMatch");
    document.getElementById("nav-elements").appendChild(noMatch);
    noMatch.innerHTML = `<p>Couldn't find anything for "${txt}"<p>`;
    const DD = document.getElementsByClassName("dropdown-div");
    for (let i = 0; i < DD.length; i++) {
      DD[i].classList.add("dropdown-downsize");
    }
    if (count < anchor.length) {
      noMatch = document.getElementsByClassName("noMatch");
      for (let i = 0; i < DD.length; i++) {
        DD[i].classList.remove("dropdown-downsize");
      }
      for (let i = 0; i < noMatch.length; i++) {
        if (document.getElementById("nav-elements").contains(noMatch[i])) {
          document.getElementById("nav-elements").removeChild(noMatch[i]);
          if (noMatch[i]) {
            noMatch[i].remove();
          }
        }
      }
    }
  }

  function chooseFromDropdown(e) {
    const parent = e.target.closest(".anchor");
    if (parent) {
      const name = parent.firstElementChild.firstElementChild.textContent;
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

  const areas = [];
  currCity.map((place) =>
    !areas.includes(place.area) ? areas.push(place.area) : null
  );
  const categories = [];
  currCity.map((place) =>
    !categories.includes(place.category)
      ? categories.push(place.category)
      : null
  );
  const types = [];
  currCity.map((place) =>
    !types.includes(place.style) ? types.push(place.style) : null
  );

  const areasFilter = useRef();
  const categoriesFilter = useRef();
  const typesFilter = useRef();
  const areaArrow = useRef();
  const categoryArrow = useRef();
  const typeArrow = useRef();
  const filterContainer = useRef();

  function filtersAnimation() {
    filterContainer.current.style.display = "flex";
    setTimeout(() => {
      areasFilter.current.style.bottom = 0;
      areaArrow.current.style.transform = "rotate(90deg)";
    }, 100);
    setTimeout(() => {
      categoriesFilter.current.style.bottom = "1rem";
      categoryArrow.current.style.transform = "rotate(90deg)";
    }, 200);
    setTimeout(() => {
      typesFilter.current.style.bottom = "2rem";
      typeArrow.current.style.transform = "rotate(90deg)";
    }, 400);
  }

  function filtersUndo() {
    areasFilter.current.style.bottom = "2rem";
    categoriesFilter.current.style.bottom = "6rem";
    typesFilter.current.style.bottom = "8rem";
    areaArrow.current.style.transform = "rotate(0deg)";
    categoryArrow.current.style.transform = "rotate(0deg)";
    typeArrow.current.style.transform = "rotate(0deg)";
    filterContainer.current.style.display = "none";
  }

  async function handleLogout() {
    try {
      await logout();
    } catch {
      alert("failed to log out");
    }
  }

  return (
    <>
      <div id="travel-smart" ref={header}>
        <div id="logo">
          <FontAwesomeIcon
            icon={faPaperPlane}
            ref={plane}
            className="fa-paper-plane"
          />
          <h1 ref={logo}>
            {sessionStorage.getItem("city").toLocaleUpperCase()}&nbsp;&nbsp;
          </h1>
        </div>

        <ul
          id="nav-elements"
          onClick={(e) => chooseFromDropdown(e)}
          ref={navElements}
        >
          <li>
            {!window.location.href.includes("/Trips") ? (
              <input
                ref={placeSearch}
                onClick={showDropdown}
                onKeyUp={(e) => searchPlaces(e)}
                type="text"
                id="placeSearch"
                placeholder="Search places"
              />
            ) : (
              <input
                style={{ opacity: 0 }}
                ref={placeSearch}
                onClick={showDropdown}
                onKeyUp={(e) => searchPlaces(e)}
                type="text"
                id="placeSearch"
                placeholder="Search places"
              />
            )}
          </li>
          <li className="filterDD">
            {!window.location.href.includes("/Trips") ? (
              <button
                className="b-1"
                onMouseOver={() => filtersAnimation()}
                onMouseLeave={() => filtersUndo()}
                value="Filter"
                id="filters-btn"
              >
                Filters &nbsp;
                <FontAwesomeIcon icon={faAngleDown} />
                <ul ref={filterContainer} className="filter-container">
                  <XButton />
                  <li className="filter" ref={areasFilter} id="areas-filter">
                    <p>
                      Area{" "}
                      <FontAwesomeIcon ref={areaArrow} icon={faChevronRight} />
                    </p>
                    <div className="filter-count"></div>
                    <div id="areas-container" ref={areasCon}>
                      {areas.map((area) => (
                        <div className="filters">
                          <p>{area}</p>
                          <input type="checkbox" name="" id="" />
                        </div>
                      ))}
                    </div>
                  </li>
                  <li
                    className="filter"
                    ref={categoriesFilter}
                    id="categories-filter"
                  >
                    <p>
                      Category{" "}
                      <FontAwesomeIcon
                        ref={categoryArrow}
                        icon={faChevronRight}
                      />
                    </p>
                    <div className="filter-count"></div>
                    <div id="categories-container">
                      {categories.map((cat) => (
                        <div className="filters">
                          <p>{cat}</p>
                          <input type="checkbox" name="" id="" />
                        </div>
                      ))}
                    </div>
                  </li>
                  <li className="filter" ref={typesFilter} id="types-filter">
                    <p>
                      Type{" "}
                      <FontAwesomeIcon ref={typeArrow} icon={faChevronRight} />
                    </p>
                    <div className="filter-count"></div>
                    <div id="types-container">
                      {types.map((type) => (
                        <div className="filters">
                          <p>{type}</p>
                          <input type="checkbox" name="" id="" />
                        </div>
                      ))}
                    </div>
                    <div
                      id="search-filters"
                      value="Search"
                      onClick={searchResults}
                    >
                      Search
                    </div>
                  </li>
                </ul>
              </button>
            ) : (
              ""
            )}
            <br />
          </li>
          <li>
            {window.innerWidth <= 881 ? <Hamburger /> : null}
            <button id="tripsBtn" className="b-1" value="My Trips">
              <Link
                onClick={() =>
                  setTimeout(() => {
                    window.location.reload();
                  }, 100)
                }
                to="/Home"
                ref={homeBtn}
              >
                Home&nbsp;&nbsp;
                <FontAwesomeIcon icon={faHouse} />
              </Link>
            </button>
            <br />
          </li>

          {currentUser ? (
            <div id="account-buttons">
              <p ref={helloUser}>Hello, {firstname}</p>
              <button className="accBtn" onClick={() => handleLogout()}>
                <Link to="/login">Log Out</Link>
              </button>
            </div>
          ) : (
            <div id="account-buttons">
              <button className="accBtn">
                <strong></strong>
              </button>
              <button className="accBtn">Log In</button>
            </div>
          )}
        </ul>
      </div>
      {/* <div id="body">{search == false ? <PlaceContent/> : <Results/>}</div>
    <div id="tripsSection">{trips === true ? <TripsPage/> : null}</div> */}
    </>
  );
}

export default PlaceHome;
