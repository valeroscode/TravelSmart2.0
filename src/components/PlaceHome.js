import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faAngleDown, faHouse, faBars, faChevronRight, faTreeCity, faFire, faPlaneDeparture } from "@fortawesome/free-solid-svg-icons";
import allMarkers from "./allMarkers.mjs"
import PlaceContent from "./PlaceContent"
import Results from "./filteredResults"
import {applied_filters} from "./getPlaceInfo.mjs";
import TripsPage from "./Trips";
import TravelSmart from "./TravelSmart";
import './styles/Navbar.css'
import allPlaces from './allMarkers.mjs';
import { Link } from "react-router-dom";
import { learnMoreAboutPlace } from './getPlaceInfo.mjs';
import { useAuth } from './contexts/AuthContext';
import Hamburger from './Hamburger';
import XButton from './XButton';

function PlaceHome() {

  
  const areasCon = useRef();
    var plane = document.getElementsByClassName("fa-paper-plane");
    var b1 = document.getElementsByClassName("b-1");
    const anchor = document.getElementsByClassName("anchor");
    const logo = useRef();
    const navElements = useRef();
    const header = useRef();
    const placeSearch = useRef();
    let typeScore = 0
    let areaScore = 0;
    let catScore = 0;

    const { currentUser, info, logout } = useAuth();
    const [firstname, setFirstname] = useState('')
    const helloUser = useRef();
    const tripsBtn = useRef();
    const homeBtn = useRef();

    useEffect(() => {
    if (currentUser) {
      setTimeout(() => {
        setFirstname(info.name)
      }, 500)
    }
  })

    const lerp = function(a, b, u) {
        return (1 - u) * a + u * b;
    };
      function colorFade(property, start, end, duration, element, element2) {
        var interval = 10;
        var steps = duration / interval;
        var step_u = 1.0 / steps;
        var u = 0.0;
        var theInterval = setInterval(function() {
            if (u >= 1.0) {
                clearInterval(theInterval);
            }
            var r = Math.round(lerp(start.r, end.r, u));
            var g = Math.round(lerp(start.g, end.g, u));
            var b = Math.round(lerp(start.b, end.b, u));
            var colorname = 'rgb(' + r + ',' + g + ',' + b + ')';
           
            if (element) {
            element.style.setProperty(property, colorname);
            element2.style.setProperty(property, colorname);
            u += step_u;
            }
            
        }, interval);
        return
    };
  

      const currCity = allPlaces.filter((place) => place.city === sessionStorage.getItem('city'))

      let overlay_on = false 
      var blue = {r: 46, g: 100, b: 254 }
      var white = {r: 255, g: 255, b: 255}

      const changeColor = (text, background) => {
        navElements.current.style.backgroundColor = background;
        header.current.style.backgroundColor = background;
        for (let i = 0; i < plane.length; i++) {
          plane[i].style.color = text;
          }
          if (logo) {
          logo.current.style.color = text;
          }
          for (let i = 0; i < b1.length; i++) {
          b1[i].style.color = text ;
          }
          helloUser.current.style.color = text;
          if (!window.location.href.includes('/Trips')) {
            tripsBtn.current.style.color = text;
          } else {
            homeBtn.current.style.color = text
          }
          
      }
    
    let newArr;
    var count = 0

    window.addEventListener("scroll", function() {
      if (overlay_on === true) {
        return
      }
      // We add pageYOffset for compatibility with IE.
      if (window.scrollY <= 65) {
       changeColor("white", '#2E64FE')
      }

      if (window.scrollY > 65) {
        changeColor('#2E64FE', "white")
      }
     
    });
    

window.addEventListener('click', (e) => {
  if (e.target.id === 'overlay') {

    overlay_on = false;
    colorFade("background-color",white, blue, 200, header.current, navElements.current)
   
        changeColor("white", "#2E64FE")
        const overlay = document.getElementById("overlay")
        overlay.remove()
        const dropdownDiv = document.getElementsByClassName("dropdown-div")
        for (let i = 0; i < dropdownDiv.length; i++) {
          dropdownDiv[i].remove()
        }
  }
  if (e.target.type === "checkbox" && e.target.closest('.filter-container')) {
    var str = e.target.previousSibling.textContent
  if (e.target.checked === true) {
    if (e.target.closest('#types-filter')) {
      typeScore = 1
    }
    if (e.target.closest('#categories-filter')) {
      catScore = 1
    }
    if (e.target.closest('#areas-filter')) {
      areaScore = 1
    }
    applied_filters.push(str)
    newArr = applied_filters.filter((item,
      index) => applied_filters.indexOf(item) === index);
  } else if (e.target.checked === false) {
    applied_filters.splice(applied_filters.indexOf(str), 1)
    newArr.splice(newArr.indexOf(str), 1)

    if (e.target.closest('#types-filter')) {
      let checked;
      for (let i = 0; i < e.target.closest('#types-container').children.length; i++) {
        if (e.target.closest('#types-container').children[i].childNodes[1].checked) {
          checked = true
        }
        if (i === e.target.closest('#types-container').children.length - 1 && checked !== true) {
          typeScore = 0;
        }
      }
    }
    if (e.target.closest('#categories-filter')) {
      let checked;
      for (let i = 0; i < e.target.closest('#categories-container').children.length; i++) {
        if (e.target.closest('#categories-container').children[i].childNodes[1].checked) {
          checked = true
        }
        if (i === e.target.closest('#categories-container').children.length - 1 && checked !== true) {
          catScore = 0;
        }
      }
    }
    if (e.target.closest('#areas-filter')) {
       let checked;
      for (let i = 0; i < e.target.closest('#areas-container').children.length; i++) {
        if (e.target.closest('#areas-container').children[i].childNodes[1].checked) {
          checked = true
        }
        if (i === e.target.closest('#areas-container').children.length - 1 && checked !== true) {
          areaScore = 0;
        }
      }
    }
  }
}
})

function searchResults() {
 if (newArr) {
  if (newArr.length > 0) {
    applied_filters.splice(0, applied_filters.length)
    newArr.map((item) => applied_filters.push(item.toLocaleUpperCase()) && applied_filters.push(" / "))
    applied_filters.pop();
    sessionStorage.setItem('total', catScore + typeScore + areaScore)
    sessionStorage.setItem('filters', applied_filters)
    window.location.replace('Search-Results');
    }
  }
}

const showDropdown = () => { 
  if (overlay_on === false) {
    overlay_on = true
    colorFade("background-color", blue, white, 30, header.current, navElements.current)
    changeColor("#2E64FE")
    const overlay = document.createElement("div")
    overlay.setAttribute("id","overlay")
    document.body.appendChild(overlay);
    const dropdownDiv = document.createElement("div")
    dropdownDiv.classList.add('dropdown-div')
    navElements.current.appendChild(dropdownDiv);
    for (let i = 0; i < currCity.length; i++) {
      const image = require(`./assets/${currCity[i].name}.jpg`);
      const a = document.createElement("a")
      a.classList.add("anchor")
      a.innerHTML = `<div><p class="DDtitle">${currCity[i].name}</p>` + `<img src=${image} /></div>` + `<div class="floater"><p class="DDp">${allMarkers[i].area}</p>`
      + `<p class="DDp">${currCity[i].type}</p>` + `<p class="DDp">${currCity[i].rating}/5</p></div>`;
      a.setAttribute('name', currCity[i].name)
      a.setAttribute('rating', currCity[i].rating)
      a.setAttribute('type', currCity[i].type)
      a.setAttribute('area', currCity[i].area)
      a.setAttribute('price', currCity[i].price)
      a.setAttribute('favorite', currCity[i].favorite)
      dropdownDiv.appendChild(a)
      dropdownDiv.classList.add("opacity1")
    }
} 
}

function searchPlaces(e) {
  for (let i = 0; i < anchor.length; i++) {
    const text = e.target.value;
    if (
      !anchor[i] ||
      !anchor[i].innerText.toLowerCase().includes(text.toLowerCase())
    ) {
      anchor[i].style.display = "none";
      
      if (anchor[i].style.display === "none") {
        count++
        if (count >= anchor.length) {
          noMatches(text)
        }
      }
    } else {
      count = 0;
      anchor[i].style.display = "block";
      setTimeout(() => {
        noMatches(text)
      }, 400)
    }
    
  }
}
    
    function noMatches(txt) {
      let noMatch = document.createElement("div")
      noMatch.classList.add("noMatch")
      document.getElementById("nav-elements").appendChild(noMatch)
      noMatch.innerHTML = `<p>Couldn't find anything for "${txt}"<p>`
      const DD = document.getElementsByClassName("dropdown-div")
      for (let i = 0; i < DD.length; i++) {
      DD[i].classList.add("dropdown-downsize")
      }
      if (count < anchor.length) {
      noMatch = document.getElementsByClassName("noMatch")
      for (let i = 0; i < DD.length; i++) {
        DD[i].classList.remove("dropdown-downsize")
        }
      for (let i = 0; i < noMatch.length; i++) {
        if (document.getElementById("nav-elements").contains(noMatch[i])) {
              document.getElementById("nav-elements").removeChild(noMatch[i])
              if (noMatch[i]) {
              noMatch[i].remove();
              }
        }
      }
      }
    }

  function chooseFromDropdown(e) {

    const parent = e.target.closest('.anchor')
    if (parent) {
      const name = parent.firstElementChild.firstElementChild.textContent;
      const place = allPlaces.filter((place) => place.name === name);
      learnMoreAboutPlace(place[0].name, place[0].rating, place[0].type, place[0].area, place[0].price,
        place[0].name, place[0].favorite, place[0].category, place[0].placeID, e.target)
    }
}

const areas = []
currCity.map((place) => !areas.includes(place.area) ? areas.push(place.area) : null)
const categories = [];
currCity.map((place) => !categories.includes(place.category) ? categories.push(place.category) : null);
const types = [];
currCity.map((place) => !types.includes(place.style) ? types.push(place.style) : null);

const areasFilter = useRef();
const categoriesFilter = useRef();
const typesFilter = useRef();
const areaArrow = useRef();
const categoryArrow = useRef();
const typeArrow = useRef();
const filterContainer = useRef();

function filtersAnimation() {
filterContainer.current.style.display = 'flex'
setTimeout(() => {
areasFilter.current.style.bottom = 0;
areaArrow.current.style.transform = 'rotate(90deg)'
}, 100)
setTimeout(() => {
categoriesFilter.current.style.bottom = '1rem';
categoryArrow.current.style.transform = 'rotate(90deg)'
}, 200)
setTimeout(() => {
typesFilter.current.style.bottom = '2rem';
typeArrow.current.style.transform = 'rotate(90deg)'
}, 400)
}

function filtersUndo() {
    areasFilter.current.style.bottom = '2rem';
    categoriesFilter.current.style.bottom = '6rem';
    typesFilter.current.style.bottom = '8rem';
    areaArrow.current.style.transform = 'rotate(0deg)';
    categoryArrow.current.style.transform = 'rotate(0deg)';
    typeArrow.current.style.transform = 'rotate(0deg)';
    filterContainer.current.style.display = 'none'
}

const [error, setError] = useState('')

async function handleLogout() {
  setError('')
  try {
    await logout()
  } catch {
    setError('Failed to log out')
  }
}

return (
    <>
  <div id="travel-smart" ref={header}>
    <div id="logo">
  <FontAwesomeIcon icon={faPaperPlane} className="fa-paper-plane" />
    <h1 ref={logo}>
    {sessionStorage.getItem('city').toLocaleUpperCase()}&nbsp;&nbsp;
    </h1>
    </div>
      
    <ul id="nav-elements" onClick={(e) => chooseFromDropdown(e)} ref={navElements}>
        <li>
        {!window.location.href.includes("/Trips") ? <input ref={placeSearch} onClick={showDropdown} onKeyUp={(e) => searchPlaces(e)} type="text" id="placeSearch" placeholder="Search places"/>
        : <input style={{opacity: 0}} ref={placeSearch} onClick={showDropdown} onKeyUp={(e) => searchPlaces(e)} type="text" id="placeSearch" placeholder="Search places"/>}
        </li>
      <li className="filterDD">
    {!window.location.href.includes("/Trips") ? <button className="b-1" onMouseOver={() => filtersAnimation()} onMouseLeave={() => filtersUndo()} value="Filter" id="filters-btn">
      Filters &nbsp;
      <FontAwesomeIcon icon={faAngleDown} />
      <ul ref={filterContainer} className='filter-container'>
        <XButton/>
        <li className='filter' ref={areasFilter} id='areas-filter'><p>Area <FontAwesomeIcon ref={areaArrow} icon={faChevronRight} /></p><div className='filter-count'></div>
        <div id='areas-container' ref={areasCon}>{areas.map((area) => <div className='filters'><p>{area}</p><input type="checkbox" name="" id="" /></div>)}</div>
        </li>
        <li className='filter'  ref={categoriesFilter} id='categories-filter'><p>Category <FontAwesomeIcon ref={categoryArrow} icon={faChevronRight} /></p><div className='filter-count'></div>
        <div id='categories-container'>{categories.map((cat) => <div className='filters'><p>{cat}</p><input type="checkbox" name="" id="" /></div>)}</div>
        </li>
        <li className='filter'  ref={typesFilter} id='types-filter'><p>Type <FontAwesomeIcon ref={typeArrow} icon={faChevronRight} /></p><div className='filter-count'></div>
        <div id='types-container'>{types.map((type) => <div className='filters'><p>{type}</p><input type="checkbox" name="" id="" /></div>)}</div>
    <div id='search-filters' value="Search" onClick={searchResults}>
      Search
    </div>
        </li>
      </ul>
    </button> : ''}
        <br />
      </li>
      <li>
        {window.innerWidth <= 881 ? <Hamburger/> : null}
        <button id='tripsBtn' className="b-1" value="My Trips">
        {!window.location.href.includes("/Trips") ? <Link to="/Home" ref={tripsBtn}>Home</Link> 
        : <Link onClick={() => setTimeout(() => {window.location.reload()}, 100)} to="/Home" ref={homeBtn}>Home&nbsp;&nbsp;<FontAwesomeIcon icon={faHouse} /></Link>}
        </button>
        <br />
      </li>
      
      {currentUser ? <div id="account-buttons"><p ref={helloUser}>Hello, {firstname}</p><button className="accBtn" onClick={() => handleLogout()}><Link to="/login">Log Out</Link></button></div> : 
      <div id="account-buttons"><button className="accBtn"><strong></strong></button>
      <button className="accBtn">Log In</button></div>}
       
    </ul>
  </div>
    {/* <div id="body">{search == false ? <PlaceContent/> : <Results/>}</div>
    <div id="tripsSection">{trips === true ? <TripsPage/> : null}</div> */}
  </>
)

}

export default PlaceHome

