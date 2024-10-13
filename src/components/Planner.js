import React, { useEffect, useRef, useState } from "react";
import "./styles/Planner.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faEnvelope,
  faPencil,
  faCalendar,
  faMagnifyingGlass,
  faX
} from "@fortawesome/free-solid-svg-icons";
import {allPlaces} from "./allMarkers.mjs";
import { docMethods } from "./firebase/firebase";
import { useAuth } from "./contexts/AuthContext";
import Footer from "./footer";
import HomeHeader from "./HomeHeader";
import {
  learnMoreAboutPlace,
} from "./getPlaceInfo.mjs";
import { useCookies } from "react-cookie";

function TripPlanner() {
  const [cookies] = useCookies(["access_token"]);
  const { currentUser, logout, trips, allPlaces_Global, allPlaces } = useAuth();
  const [smartSearchPlaces, setSmartSearchPlaces] = useState([])
  const [confirmExpCity, setConfirmExpCity] = useState(false)
  const budgetBreakdown = useRef();
  const datesDiv = useRef();
  const favoritesList = useRef();
  const tripName = useRef();
  const tripDetailsList = useRef();
  const loadAnimation = useRef();
  const emailModal = useRef();
  const modalBG = useRef();
  const emailInput = useRef();
  const chevron = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`;
  const pin = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z"/></svg>`;
  const [dbTrips, setDbTrips] = useState();
  const [budgetChange, setBudgetChange] = useState(false);
  const [remainingBudget, setRemainingBudget] = useState();
  const [userCreds, setUserCreds] = useState();
  const [plan, setPlan] = useState("");
  const [dbPlans, setDbPlans] = useState({});
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const placesIn_City = allPlaces.filter(
    (p) => p.city === sessionStorage.getItem("city")
  );

  const [favoritesIn_City, setFavoritesIn_City] = useState([]);

  //Change this to merge sort in the future
  placesIn_City.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  const [totalBudget, setTotalBudget] = useState(0)
  const [hotel, setHotel] = useState(0)
  const [transport, setTransport] = useState(0)

  const [tripBudget, setTripBudget] = useState({
    total: 0,
    hotel: 0,
    transport: 0,
    other: 0,
  });

  const [expenses, setExpenses] = useState({
    HotelDOM: useRef(),
    transportDOM: useRef(),
    entDOM: useRef(),
    diningDOM: useRef(),
    nightDOM: useRef(),
    Hotel: tripBudget.hotel,
    Transportation: 0,
    Theater: 0,
    Coffee: 0,
    Resturant: 0,
    Club: 0,
    total: function () {
      //ParseInt is used to prevent the compiler from adding these values as strings
      return (
        parseInt(this.Hotel) +
        parseInt(this.Transportation) +
        parseInt(this.Theater) +
        parseInt(this.Coffee) +
        parseInt(this.Resturant) +
        parseInt(this.Club)
      );
    },
    totalSpent: 0,
    percentages: function () {
      const total = this.total();

      if (this.Hotel !== 0) {
        this.HotelDOM.current.style.setProperty(
          "--p",
          Math.round((this.Hotel / total) * 100)
        );
        this.HotelDOM.current.textContent = `${Math.round(
          (this.Hotel / total) * 100
        )}%`;
      } else {
        this.HotelDOM.current.style.setProperty("--p", 0);
        this.HotelDOM.current.textContent = `0%`;
      }

      if (this.Transportation !== 0) {
        this.transportDOM.current.style.setProperty(
          "--p",
          Math.round((this.Transportation / total) * 100)
        );
        this.transportDOM.current.textContent = `${Math.round(
          (this.Transportation / total) * 100
        )}%`;
      } else {
        this.transportDOM.current.style.setProperty("--p", 0);
        this.transportDOM.current.textContent = `0%`;
      }

      if (this.Theater !== 0) {
        this.entDOM.current.style.setProperty(
          "--p",
          Math.round((this.Theater / total) * 100)
        );
        this.entDOM.current.textContent = `${Math.round(
          (this.Theater / total) * 100
        )}%`;
      } else {
        this.entDOM.current.style.setProperty("--p", 0);
        this.entDOM.current.textContent = `0%`;
      }

      if (this.Resturant !== 0) {
        this.diningDOM.current.style.setProperty(
          "--p",
          Math.round(((this.Resturant + this.Coffee) / total) * 100)
        );
        this.diningDOM.current.textContent = `${Math.round(
          ((this.Resturant + this.Coffee) / total) * 100
        )}%`;
      } else {
        this.diningDOM.current.style.setProperty("--p", 0);
        this.diningDOM.current.textContent = `0%`;
      }

      if (this.Club !== 0) {
        this.nightDOM.current.style.setProperty(
          "--p",
          Math.round((this.Club / total) * 100)
        );
        this.nightDOM.current.textContent = `${Math.round(
          (this.Club / total) * 100
        )}%`;
      } else {
        this.nightDOM.current.style.setProperty("--p", 0);
        this.nightDOM.current.textContent = `0%`;
      }
    },
  });

  function binarySearch(target, array, number) {
    const length = array.length;
    const middle = Math.floor(length / 2);
    if (array.length === 1 && array[0].name !== target) {
      return;
    } else {
      if (target === array[middle].name) {
        expenses[array[middle].category] =
          parseInt(expenses[array[middle].category]) + parseInt(number);
        return;
      }
      if (target < array[middle].name) {
        return binarySearch(target, array.slice(0, middle), number);
      }
      if (target > array[middle].name) {
        return binarySearch(target, array.slice(middle), number);
      }
    }
  }

  const citiesAvaliable = ['miami', 'new york', 'barcelona']

  const smartSearchInput = useRef();

  function smartSearch() {
    const searchTerm = String(smartSearchInput.current.value).toLocaleLowerCase();
    const location = String(searchTerm).split(" ")[2]
    const locationIndex = searchTerm.indexOf(location);

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
    for (let i = 0; i < allPlaces_Global.length; i++) {
    for (let j = 0; j < finalTerms.length; j++) {
      wordAccuracy(finalTerms[j].term, allPlaces_Global[i].area)
      wordAccuracy(finalTerms[j].term, allPlaces_Global[i].city)
      wordAccuracy(finalTerms[j].term, allPlaces_Global[i].style)
      wordAccuracy(finalTerms[j].term, allPlaces_Global[i].category)
      wordAccuracy(finalTerms[j].term, allPlaces_Global[i].serves)
      }
    }

 

    for (let i = 0; i < allPlaces_Global.length; i++) {
     
      allPlaces_Global[i].score = 0
     if (cityInArray.length === 0) {
      if (finalTerms.some(term => term.term.includes(String(allPlaces_Global[i].area).toLocaleLowerCase()))) {
        allPlaces_Global[i].score++
      }
      } else {
        if (finalTerms.some(term => term.term.includes(String(allPlaces_Global[i].city).toLocaleLowerCase()))) {
          allPlaces_Global[i].score++
        }
      }
      if (finalTerms.some(term => term.term.includes(String(allPlaces_Global[i].style).toLocaleLowerCase()))) {
        allPlaces_Global[i].score++
      }
      if (finalTerms.some(term => term.term.includes(String(allPlaces_Global[i].category).toLocaleLowerCase()))) {
        allPlaces_Global[i].score++
      }
      let processed = allPlaces_Global[i].serves.replace(/[,&]/g, ' ');
      processed = processed.replace(/\s+/g, ' ').trim();
      processed = processed.toLocaleLowerCase()
      const regexPattern = processed.split(' ').join('|');
      finalTerms.some(term => {
      const items = regexPattern.split('|').map(item => item.trim());
      if (items.includes(term.term)) {
        allPlaces_Global[i].score++
      }
      })

      //When handling misspellings also account for 1 letter added and missing 1 letter
    }
  
    const regexcase = new RegExp(`\\b${' and '}\\b`, 'g'); // 'g' for global match
    const matches = searchTerm.match(regexcase);

    let results;

    if (matches !== null) {
    results = allPlaces_Global.filter(p => p.score === finalTerms.length - matches.length)
    } else {
    results = allPlaces_Global.filter(p => p.score === finalTerms.length)
    }

    setSmartSearchPlaces(results)
    
    setConfirmExpCity(true)

  }

  const favoritesUL = useRef();

  useEffect(() => {

    console.log('tbiurvf')
    console.log(transport)

  }, [transport])

  useEffect(() => {
    if (typeof trips.trips === 'object') {
      function loadData() {
        if (Object.keys(trips.trips).length === 0) {
          window.setTimeout(loadData, 400);
        } else {
          setDbTrips(trips.trips);
          setDbPlans(trips.trips[sessionStorage.getItem("trip")].plans)
          setPlan(trips.trips[sessionStorage.getItem("trip")]);
          setTotalBudget(trips.trips[sessionStorage.getItem("trip")].expenses.budget)
          setHotel(trips.trips[sessionStorage.getItem("trip")].expenses.hotel)
          setTransport(trips.trips[sessionStorage.getItem("trip")].expenses.transport)
    
          if (tripDetailsList.current.children.length === 0) {
            getTripDetails();
          }

          // for (let i = 0; i < currentUser.favorites.length; i++) {
          //   allPlaces.map((place) =>
          //     place.name === currentUser.favorites[i] &&
          //     place.city === sessionStorage.getItem("city")
          //       ? favoritesIn_City.push(place)
          //       : null
          //   );
          //   if (i === currentUser.favorites.length - 1) {
          //     setFavoritesIn_City(favoritesIn_City);
          //   }
          // }
        }
      }

      loadData();

      let string = currentUser.email.toString();

      setUserCreds(string);
    }
  }, [trips]);

  useEffect(() => {
    renderDetailedBreakdown();
  }, [budgetChange, dbTrips]);



  function renderDetailedBreakdown() {
    const plan = document.getElementsByClassName("place-planned");
    const budgetBreakdown = document.getElementById("budget-breakdown");
    const setBudget = document.getElementsByClassName("set-budget");
    budgetBreakdown.innerHTML = "";
    let sum = 0;

    if (document.getElementById("remaining-budget")) {
      document.getElementById("remaining-budget").remove();
    }

    const HotelLi = document.createElement("LI");
    HotelLi.classList.add("budget-li");
    HotelLi.innerHTML = `<p>Hotel</p><p>$${hotel}</p>`;
    budgetBreakdown.appendChild(HotelLi);
    sum = sum + parseInt(hotel);

    const transportLi = document.createElement("LI");
    transportLi.classList.add("budget-li");
    transportLi.innerHTML = `<p>Transportation</p><p>$${transport}</p>`;
    budgetBreakdown.appendChild(transportLi);
    sum = sum + parseInt(transport);

    //Time complexity: O(N) - since binarySearch is Logerithmic && the for loop is 0(N)
    for (let i = 0; i < plan.length; i++) {
      const budget = setBudget[i].firstElementChild;
      binarySearch(
        plan[i].getAttribute("place"),
        placesIn_City,
        budget.textContent
      );
      const li = document.createElement("LI");
      li.classList.add("budget-li");
      li.innerHTML = `<p>${plan[i].getAttribute("place")}</p><p>$${
        budget.textContent
      }</p>`;
      budgetBreakdown.appendChild(li);
      sum = sum + parseInt(budget.textContent);
    }

    const remainingBudget = document.createElement("LI");
    remainingBudget.setAttribute("id", "remaining-budget");
    const bool = tripBudget.total - sum < 0;
    remainingBudget.innerHTML = `<p>Remaining Budget</p><p style='${
      bool ? "color:red" : null
    }'>${bool ? "-" : ""}$${
      bool ? (tripBudget.total - sum) * -1 : tripBudget.total - sum
    }</p>`;
    budgetBreakdown.appendChild(remainingBudget);
    setRemainingBudget(totalBudget - sum);

    // expenses.percentages();
  }

  function getTripDetails() {
    const date = trips.trips[sessionStorage.getItem("trip")].dates;
    const plan = trips.trips[tripName.current.textContent].plans;


    const d = trips.trips[sessionStorage.getItem("trip")].dates;

    datesDiv.current.textContent = `${
      months.indexOf(d[0].split(" ")[0]) + 1
    }/${String(d[0].split(" ")[1])}
        - ${months.indexOf(d[d.length - 1].split(" ")[0]) + 1}/${String(
      d[d.length - 1].split(" ")[1]
    )}`;
    for (let i = 0; i < date.length; i++) {
      const li = document.createElement("li");
      li.innerHTML = `<h6 class='hide-show-plans'>${date[i]} ${chevron}</h6>`;
      tripDetailsList.current.appendChild(li);
      li.setAttribute("id", `${i}`);
      for (let iter = 0; iter < plan[`day ${i + 1}`].length; iter++) {
        let specificPlan = plan[`day ${i + 1}`][iter];
        let planBudget = String(specificPlan).split("|")[2];
        let planTime = String(specificPlan).split("|")[1];
        if (planBudget === undefined) {
          planBudget = 0;
        }

        const div = document.createElement("div");
        div.innerHTML = `<div number='${iter}' place='${String(
          plan[`day ${i + 1}`][iter].split("|")[0]
        )}' class='place-planned'>
            <img style="display:none"></img>
            <div place='${String(
              plan[`day ${i + 1}`][iter].split("|")[0]
            )}' trip='${sessionStorage.getItem("trip")}' class="right-side-div">
            <div class='middle-div'>
            <a>${plan[`day ${i + 1}`][iter].split("|")[0]}</a>
            <p>${getPlaceProps(
              String(plan[`day ${i + 1}`][iter].split("|")[0]),
              "category"
            )} in ${getPlaceProps(
          String(plan[`day ${i + 1}`][iter].split("|")[0]),
          "area"
        )}</p>
            <div class='budget-box'>
            <h5>Budget</h5>
            <div class='budgeting'><a>$</a><div class='set-budget'><span>${planBudget}</span>
            </div><button class='set-budget-place'>Set</button></div>
            </div>
            <input type="time" class="time-itin" dayIndex='${
              i + 1
            }' trip='${sessionStorage.getItem("trip")}' place='${String(
          plan[`day ${i + 1}`][iter].split("|")[0]
        )}'value=${planTime} name="time" min="00:00" max="23:59" />
            </div>
            </div>
            <div class='trip-div-btns'>
            <button dayIndex='${i + 1}' place='${String(
          plan[`day ${i + 1}`][iter].split("|")[0]
        )}' trip='${sessionStorage.getItem(
          "trip"
        )}' class='delete-plan'>Delete</button>
            </div>
            </div>`;
        li.appendChild(div);
      }
      li.classList.add("trip-overview-li");
      if (li.childNodes.length > 1) {
        li.style.color = "#0463fe";
      }
      if (li.childNodes.length > 1) {
        li.firstElementChild.firstElementChild.classList.add("rotate-chevron");
      }
      const add = document.createElement("li");
      add.innerHTML = `${pin}<h4>Add a place</h4>`;
      add.classList.add("add-li");
      add.setAttribute("dayIndex", i + 1);
      li.appendChild(add);
    }

    loadAnimation.current.style.opacity = 0;
    setTimeout(() => {
      loadAnimation.current.style.display = "none";
    }, 310);

    // setExpenses(expenses);

}

  if (document.getElementsByClassName("time-title")) {
    const t = document.getElementsByClassName("time");
    for (let i = 0; i < t.length; i++) {
      t[i].addEventListener("change", (e) => {
        const plan = dbTrips[tripName.current.textContent].Plans;
        const dayIndex = e.target.getAttribute("dayIndex");
        let dayInfo = plan[dayIndex - 1][`Day ${dayIndex}`];
        const place = e.target.getAttribute("place");
        let newTime;
        let currTime;
        dayInfo.map((info) =>
          String(info).split("|")[0] === place
            ? (newTime = `${e.target.getAttribute("place")}|${t[i].value}`)
            : null
        );
        dayInfo.map((info) =>
          String(info).split("|")[0] === place
            ? (currTime = String(info).split("|")[1])
            : null
        );
        if (dayInfo.indexOf(`${place}|${currTime}`) !== -1) {
          dayInfo[dayInfo.indexOf(`${place}|${currTime}`)] = `${newTime}`;
          docMethods.updateTrips(userCreds, dbTrips);
          setDbTrips(dbTrips);
        }
        setPlan(plan);
        return;
      });
    }
  }

  if (document.getElementsByClassName("delete-plan")) {

    for (let i = 0; i < document.getElementsByClassName("delete-plan").length; i++) {
        document.getElementsByClassName("delete-plan")[i].addEventListener("click", (e) => {
        const dayIndex = e.target.getAttribute("dayIndex");
        const plan = dbPlans[`day ${dayIndex}`]
        const nameofPlace = e.target.getAttribute('place')
        const arrIndex = plan.findIndex(place => place.includes(nameofPlace))
        plan.splice(plan.indexOf(arrIndex), 1)

        fetch("http://localhost:8080/updateTrip", {
        method: "POST",
        headers: {
        Authorization: "Bearer " + cookies.access_token,
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        "tripname": tripName.current.textContent,
        "city": sessionStorage.getItem('city'),
        "year": trips.trips[tripName.current.textContent].year,
        "dates": trips.trips[tripName.current.textContent].dates,
        "plans": plan,
        "expenses": {
        "hotel": hotel,
        "budget": totalBudget,
        "transport": transport
        }
      }),
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        
      })
      .catch((err) => {
        console.error(err);
      });

        setPlan(dbTrips[tripName.current.textContent].plans);
        setDbPlans(plan)
      });
    }
  }

  const [currDay, setCurrDay] = useState(0);
  function handleListClicks(e) {
    let txt = e.target.innerText;
    const parent = e.target.closest(".place-planned");
    const listItem = e.target.closest(".trip-overview-li");
    const addLi = e.target.closest("add-li")
    const plan =
      dbTrips[tripName.current.textContent].plans[
        `day ${parseInt(listItem.getAttribute("id")) + 1}`
      ];
    if (e.target.classList.contains("set-budget")) {
      e.target.nextElementSibling.style.opacity = 1;
      e.target.innerHTML = `<input id='newInput' value='${txt}' />`;
      const input = document.getElementById("newInput");
      input.focus();
      input.classList.add("input-active");
    } else if (e.target.classList.contains("set-budget-place")) {
      const input =
        parent.childNodes[3].childNodes[1].childNodes[5].childNodes[3]
          .childNodes[1];
      for (let i = 0; i <= plan.length; i++) {
        const split = String(plan[i]).split("|")[0];
        if (split == parent.getAttribute("place")) {
          const time = plan[i].split("|")[1];
          plan[i] = `${parent.getAttribute("place")}|${time}|${
            document.getElementById("newInput").value
          }`;
        }
      }
      docMethods.updateTrips(userCreds, dbTrips);
      input.innerHTML = `<span>${
        document.getElementById("newInput").value
      }</span>`;
      e.target.style.opacity = 0;
    } else if (e.target.closest(".add-li")) {
      setCurrDay(e.target.closest(".add-li").getAttribute("dayIndex"));
      favoritesList.current.style.right = 0;
      if (window.innerWidth > 704) {
        favoritesList.current.style.width = "42vw";
      } else {
        favoritesList.current.style.width = "100vw";
      }
      e.target.setAttribute("id", "newNode");
    } else if (e.target.classList.contains("time-itin")) {
      //changes time in database
      parent.childNodes[3].childNodes[1].childNodes[7].addEventListener(
        "change",
        (e) => {
          for (let i = 0; i <= plan.length; i++) {
            var split = String(plan[i]).split("|")[0];
            if (split == parent.getAttribute("place")) {
              var budget = plan[i].split("|")[2];
              plan[i] = `${parent.getAttribute("place")}|${
                e.target.value
              }|${budget}`;
            }
          }
          docMethods.updateTrips(userCreds, dbTrips);
        }
      );
    }
  }

  function editTripName(e) {
    const box = e.target.closest("#inner-box");
    const h1 = document.getElementById("trip-name");
    const editor = document.getElementById("editNameElems");
    editor.firstChild.value = box.firstElementChild.textContent;
    editor.firstChild.focus();
    editor.style.display = "flex";
    h1.style.display = "none";

    if (e.target.textContent === "Set") {
      alert('Working out a bug in this feature.')
      // fetch("http://localhost:8080/updateTripName", {
      //   method: "POST",
      //   headers: {
      //     Authorization: "Bearer " + cookies.access_token,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     "newname": box.firstElementChild.textContent,
      //     "tripname": tripName.current.textContent,
      //     "city": sessionStorage.getItem('city'),
      //     "year": trips.trips[tripName.current.textContent].year,
      //     "dates": trips.trips[tripName.current.textContent].dates,
      //     "plans": trips.trips[tripName.current.textContent].plans,
      //     "expenses": {
      //     "hotel": hotel,
      //     "budget": totalBudget,
      //     "transport": transport
      //     }
      //   }),
      // })
      //   .then((response) => {
      //     return response.json();
      //   })
      //   .then((data) => {
          
      //   })
      //   .catch((err) => {
      //     console.error(err);
      //   });

        // sessionStorage.setItem('trip', box.firstElementChild.textContent)
        // window.location.href = window.location.href;
        
    }
  }

  function setName(e) {
    const h1 = document.getElementById("trip-name");
    const editor = document.getElementById("editNameElems");
    h1.style.display = "block";
    h1.textContent = editor.firstChild.value;
    dbTrips[editor.firstChild.value] = dbTrips[sessionStorage.getItem("trip")];
    delete dbTrips[sessionStorage.getItem("trip")];
    setDbTrips(dbTrips);
    docMethods.updateTrips(userCreds, dbTrips);
    sessionStorage.setItem("trip", editor.firstChild.value);
    editor.style.display = "none";
  }

  function getPlaceProps(name, prop) {
    for (let i = 0; i < placesIn_City.length; i++) {
      if (placesIn_City[i].name === name) {
        return placesIn_City[i][prop];
      }
    }
  }

  function handleCostEdit(type, int) {
    console.log(type)
    console.log(int)
    if (type === 'hotel') {
    fetch("http://localhost:8080/updateTrip", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + cookies.access_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "tripname": tripName.current.textContent,
        "city": sessionStorage.getItem('city'),
        "year": trips.trips[tripName.current.textContent].year,
        "dates": trips.trips[tripName.current.textContent].dates,
        "plans": trips.trips[tripName.current.textContent].plans,
        "expenses": {
        "hotel": int,
        "budget": totalBudget,
        "transport": transport
        }
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        
      })
      .catch((err) => {
        console.error(err);
      });
      setHotel(int)
    } else if (type === 'transport') {
      fetch("http://localhost:8080/updateTrip", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + cookies.access_token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "tripname": tripName.current.textContent,
          "city": sessionStorage.getItem('city'),
          "year": trips.trips[tripName.current.textContent].year,
          "dates": trips.trips[tripName.current.textContent].dates,
          "plans": trips.trips[tripName.current.textContent].plans,
          "expenses": {
          "hotel": hotel,
          "budget": totalBudget,
          "transport": int
          }
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          
        })
        .catch((err) => {
          console.error(err);
        });
        setTransport(int)
    }
  }

  function handleHotelTransport(e) {
    const button = e.target;
    const span = e.target.previousElementSibling;
    if (e.target.innerHTML === "Set") {
      span.innerHTML = `<span>${span.firstElementChild.value}</span>`;
      button.textContent = "Edit";
      expenses[e.target.closest(".cost-div").title] = parseInt(span.innerText);
      dbTrips[sessionStorage.getItem("trip")].expenses[
        e.target.closest(".cost-div").title
      ] = parseInt(span.innerText);
      docMethods.updateTrips(userCreds, dbTrips);
      setDbTrips(dbTrips);
      tripBudget[e.target.closest(".cost-div").title] = span.innerText;
      setTripBudget(tripBudget);
      // expenses.percentages();
      // setExpenses(expenses);
      setPlan(dbTrips[sessionStorage.getItem("trip")]);
      handleCostEdit(e.target.closest(".cost-div").title, parseInt(span.innerText))
    } else if (e.target.innerHTML === "Edit") {
      span.innerHTML = `<input id='newInput' value='${span.innerText}' />`;
      const input = document.getElementById("newInput");
      input.focus();
      button.textContent = "Set";
    }
  }

  function handleBudgetEdit(value) {
    fetch("http://localhost:8080/updateTrip", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + cookies.access_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "tripname": tripName.current.textContent,
        "city": sessionStorage.getItem('city'),
        "year": trips.trips[tripName.current.textContent].year,
        "dates": trips.trips[tripName.current.textContent].dates,
        "plans": trips.trips[tripName.current.textContent].plans,
        "expenses": {
        "hotel": hotel,
        "budget": parseInt(value),
        "transport": transport
        }
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        
      })
      .catch((err) => {
        console.error(err);
      });
      setTotalBudget(value)
  }

  function editBudget(e) {
    const parent = e.target.parentNode;

    if (e.target.textContent === "Set New Budget") {
      const span = document.createElement("span");
      const value = document.getElementById("newInputBudget").value;
      span.textContent = `$${value}`;
      dbTrips[sessionStorage.getItem("trip")].expenses.budget = value;
      parent.replaceChild(span, document.getElementById("newInputBudget"));
      docMethods.updateTrips(userCreds, dbTrips);
      setDbTrips(dbTrips);
      tripBudget.total = value;
      setTripBudget(tripBudget);
      e.target.textContent = "Edit Budget";
      handleBudgetEdit(value)
    } else {
      const span1 = e.target.previousElementSibling;
      const input = document.createElement("input");
      input.setAttribute("id", "newInputBudget");
      input.value = String(span1.textContent).replace("$", "");
      parent.replaceChild(input, span1);
      input.focus();
      e.target.textContent = "Set New Budget";
    }
  }


  const dollar = "$";

  function addPlace(e, category, area, name, budget, time, dayIndex) {
      const newNode = document.getElementById("newNode");
      const div = document.createElement("div");
      div.innerHTML = `<div place='${name}' number='${
        parseInt(newNode.previousElementSibling.getAttribute("number")) + 1
      }' class='place-planned'>
    <div place='${name}' trip='${tripName.current.textContent}' class="right-side-div">
    <div class='middle-div'>
    <a>${name}</a>
    <p>${category} | ${area}</p>
    <div class='budget-box'>
    <h5>Budget</h5>
    <div class='budgeting'><a>$</a><div class='set-budget'><span>${budget}</span>
    </div><button class='set-budget-place'>Set</button></div>
    </div>
    <input type="time" class="time-itin" trip='${sessionStorage.getItem(
      "trip"
    )}' 
    place='${name}'value=${time} name="time" min="00:00" max="23:59" />
    </div>
    </div>
    <div class='trip-div-btns'>
    <button dayIndex='${dayIndex}' place='${name}' trip='${tripName.current.textContent}' class='delete-plan'>Delete</button>
    </div>
    </div>`;

      const element = document.getElementsByClassName('add-li')[currDay - 1]

      console.log(element)

      element.parentNode.insertBefore(div, element);
      dbTrips[tripName.current.textContent].plans[
        `day ${String(dayIndex)}`
      ].push(`${name}|${time}|${budget}`);
      setPlan(dbTrips[tripName.current.textContent]);
      setDbTrips(dbTrips);
      setBudgetChange((budgetChange) => !budgetChange);
      // expenses.percentages();
      // setExpenses(expenses);
  }

  async function handleLogout() {
    try {
      await logout();
    } catch {
      alert("Failed to log out");
    }
  }

  let planString;

  function planToString() {
    let plansStr = [];
    for (let i = 0; i < plan.plans.length; i++) {
      const dayPlans = plan.plans[i][`day ${i + 1}`];
      const pArr = [];
      for (let j = 0; j < dayPlans.length; j++) {
        let p;
        const split = dayPlans[j].split("|");
        p = `<p>${split[0] !== undefined ? split[0] : ""}</p><p>Time: ${
          split[1] !== undefined ? split[1] : ""
        }</p>
        <p>Budget: ${split[2] !== undefined ? split[2] : ""}</p>`;
        pArr.push(p);
      }
      plansStr.push(`<h3>day ${i + 1}</h3><br/><div>${pArr.join()}</div>`);
    }

    const stringified = plansStr.join();
    planString = stringified.replaceAll(",", "");
  }

  function handleSendingPlans(email, title) {
    let emailToString = String(email).replaceAll(" ", ",");
    planToString();
    fetch(`https://travelsmart-backend.onrender.com/mail/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emails: emailToString,
        title: title,
        plans: planString,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(() => {
        alert("Email(s) Sent");
        setTimeout(() => {
          modalBG.current.style.display = "none";
          emailModal.current.style.display = "none";
        }, 350);
        modalBG.current.style.opacity = 0;
        emailModal.current.style.opacity = 0;
      })
      .catch((e) => {
        alert("something went wrong... Did you seperate emails with a space?");
        console.error(e.error);
      });
  }

  return (
    <>
      <section id="overall-page">
        <HomeHeader name={currentUser.name} />
        <section id="main">
          <div id="main-section">
            <div id="trip-name-photo">
              <div id="inner-box">
                <h1 id="trip-name" ref={tripName}>
                  {sessionStorage.getItem("trip")}
                </h1>
                <div id="editNameElems">
                  <input />
                  <button onClick={(e) => setName(e)}>Set</button>
                </div>
                <div id="calendar">
                  <FontAwesomeIcon id="edit-btn" icon={faCalendar} />
                  <span ref={datesDiv}></span>
                </div>
                <FontAwesomeIcon
                  id="editName"
                  onClick={(e) => editTripName(e)}
                  icon={faPencil}
                />
              </div>
            </div>
            <div id="budgeting">
              <div className="contain-title-btn">
                <h3>Budgeting & Itinerary</h3>
                {/* <button
                  className="email-btn"
                  onClick={() => {
                    modalBG.current.style.display = "flex";
                    emailModal.current.style.display = "flex";
                    setTimeout(() => {
                      modalBG.current.style.opacity = 1;
                      emailModal.current.style.opacity = 1;
                    }, 50);
                  }}
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                  Email Itinerary
                </button> */}
              </div>
              <div className="budgeting-tool">
                <div className="budget-tool-header">
                  <span>${totalBudget}</span>
                  <button onClick={(e) => editBudget(e)}>Edit Budget</button>
                </div>
                <div id="cost-div-list">
                  <div
                    onClick={(e) => handleHotelTransport(e)}
                    title="hotel"
                    className="cost-div"
                  >
                    <h5>Total Hotel Cost</h5>
                    <div>
                      <a>$</a>
                      <span>
                        <span>{hotel}</span>
                      </span>
                      <button>Edit</button>
                    </div>
                  </div>
                  <div
                    onClick={(e) => handleHotelTransport(e)}
                    title="transport"
                    className="cost-div"
                  >
                    <h5>Total Transportation Cost</h5>
                    <div>
                      <a>$</a>
                      <span>
                        <span>{transport}</span>
                      </span>
                      <button>Edit</button>
                    </div>
                  </div>
                </div>
                <hr className="budget-hr" />

                {/* <div className="visual-breakdown">
                  <div id="pie-chart">
                    <div>
                      <p>Hotel</p>
                      <div
                        ref={expenses.HotelDOM}
                        id="hotel"
                        className="pie animate no-round"
                      ></div>
                    </div>
                    <div>
                      <p>Transportation</p>
                      <div
                        ref={expenses.transportDOM}
                        id="transport"
                        className="pie animate no-round"
                      ></div>
                    </div>
                    <div>
                      <p>Dining</p>
                      <div
                        ref={expenses.diningDOM}
                        id="dining"
                        className="pie animate no-round"
                      ></div>
                    </div>
                    <div>
                      <p>Entertinment</p>
                      <div
                        ref={expenses.entDOM}
                        id="ent"
                        className="pie animate no-round"
                      ></div>
                    </div>
                    <div>
                      <p>Nightlife</p>
                      <div
                        ref={expenses.nightDOM}
                        id="night"
                        className="pie animate no-round"
                      ></div>
                    </div>
                  </div>
                </div> */}
              
                <ul
                  ref={tripDetailsList}
                  onClick={(e) => handleListClicks(e)}
                  id="tripDetailsList"
                ></ul>
                <div className="detailed-breakdown">
                  <h4>Detailed Breakdown</h4>
                  <ul ref={budgetBreakdown} id="budget-breakdown"></ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
      <div ref={favoritesList} id="favorites-list">
      <FontAwesomeIcon icon={faX} id="x-out-btn-planner" onClick={() => {
        if (window.innerWidth > 704) {
        favoritesList.current.style.right = '-42vw';
        } else {
        favoritesList.current.style.right = '-100vw';
        }
      }} />
        <h3 className="add-place-text">Add a place</h3>
        <hr />
        <div id="hello-user-input-search-planner">
            <input placeholder="Sushi in Miami, Resturants in Orlando..." ref={smartSearchInput} style={{borderRadius: '30rem 0 0 30rem'}} id="input-planner"></input>
            <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => smartSearch()} id="svg-search-planner"/>
        </div>
        <div id="smart-search-results-planner">
        {
          confirmExpCity ?
          
          smartSearchPlaces.map((place) => (
            <div className="smart-search-result-planner">
              <div className="place-text-info-1">
                <h3>{place.name}</h3>
                <h4>{place.style} {place.category}</h4>
                <p>Serving {place.serves}</p>
                <p>{place.area} | {'$'.repeat(place.price)}</p>
              </div>
              <div className="place-action-btns">
                <button onClick={(e) => {
                  const currPlan = dbPlans;
            
                  currPlan[`day ${String(currDay)}`].push(`${place.name}|${'00:00'}|${'0'}`);
                  
                  fetch("http://localhost:8080/updateTrip", {
                    method: "POST",
                    headers: {
                      Authorization: "Bearer " + cookies.access_token,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      "tripname": tripName.current.textContent,
                      "city": sessionStorage.getItem('city'),
                      "year": trips.trips[tripName.current.textContent].year,
                      "dates": trips.trips[tripName.current.textContent].dates,
                      "plans": currPlan,
                      "expenses": {
                      "hotel": hotel,
                      "budget": totalBudget,
                      "transport": transport
                      }
                    }),
                  })
                    .then((response) => {
                      return response.json();
                    })
                    .then((data) => {
                      
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                    favoritesList.current.style.right = "-42vw";
                    setDbPlans(currPlan)
                    addPlace(e, place.category, place.area, place.name,  0, '', `day ${currDay}`)
           
                }}>Add</button>
                <button onClick={(e) => learnMoreAboutPlace(place.name, place.rating, place.style, place.area, place.price, place.text, place.favorite, place.category, place.placeid, e.target, place.coords.lat, place.coords.lng)}>Learn More</button>
              </div>
            </div>
          ))
          
          : null
        }
        </div>
        {/* <ul ref={favoritesUL}>
          {favoritesIn_City.length !== 0
            ? favoritesIn_City.map((place, index) => (
                <li>
                  <button key={index} onClick={(e) => addPlace(e)}>
                    Add
                  </button>
                  <div key={index + 1}>
                    <p key={index + 2} className="placeName">
                      {place.name}
                    </p>
                    <div className="placeAtts">
                      <p> {place.category}&nbsp; | &nbsp;</p>
                      <p> {place.area} &nbsp;| &nbsp;</p>
                      <p> {dollar.repeat(place.price)}</p>
                    </div>
                    <div className="budget-time-section">
                      <div className="budgeting-slider">
                        <a>$</a>
                        <div className="set-budget">
                          <input type="text" placeholder="set budget" />
                        </div>
                      </div>
                      <input type="time" className="time-itin" />
                    </div>
                  </div>
                </li>
              ))
            : null}
        </ul> */}
      </div>
      <div id="remaining-budget-widget">
        <h4>Remaining Budget: ${remainingBudget}</h4>
      </div>

      <div id="modalBG" ref={modalBG}>
        <div ref={emailModal} id="emailModal">
          <button
            onClick={(e) => {
              setTimeout(() => {
                modalBG.current.style.display = "none";
                e.target.parentNode.style.display = "none";
              }, 350);
              modalBG.current.style.opacity = 1;
              e.target.parentNode.style.opacity = 0;
            }}
            id="emailXOut"
          >
            X
          </button>
          <h3>Let's send those plans.</h3>
          <input
            ref={emailInput}
            type="text"
            placeholder="Emails: (you can type multiple seperate by a space)"
          ></input>
          <button
            id="sender"
            onClick={() =>
              handleSendingPlans(
                emailInput.current.value,
                tripName.current.textContent
              )
            }
          >
            Send
          </button>
        </div>
      </div>

      <div ref={loadAnimation} id="planning-time">
        <h2>Planning Time</h2>
        <div className="bar">
          <div className="circle"></div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TripPlanner;
