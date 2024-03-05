import React, { useEffect, useRef, useState } from "react";
import "./styles/Planner.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faEnvelope,
  faPencil,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import allPlaces from "./allMarkers.mjs";
import { docMethods } from "./firebase/firebase";
import { useAuth } from "./contexts/AuthContext";
import { Link } from "react-router-dom";

function TripPlanner() {
  const { currentUser, info, logout } = useAuth();
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

  const [tripBudget, setTripBudget] = useState({
    total: 0,
    hotel: 0,
    transport: 0,
    other: 0,
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

  const [expenses, setExpenses] = useState({
    HotelDOM: useRef(),
    transportDOM: useRef(),
    entDOM: useRef(),
    diningDOM: useRef(),
    nightDOM: useRef(),
    Hotel: tripBudget.hotel,
    Transportation: tripBudget.transport,
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

  const favoritesUL = useRef();

  useEffect(() => {
    if (currentUser) {
      function loadData() {
        if (Object.keys(info.trips).length === 0) {
          window.setTimeout(loadData, 400);
        } else {
          setDbTrips(info.trips);
          setPlan(info.trips[sessionStorage.getItem("trip")]);
          if (tripDetailsList.current.children.length === 0) {
            getTripDetails();
          }

          for (let i = 0; i < info.favorites.length; i++) {
            allPlaces.map((place) =>
              place.name === info.favorites[i] &&
              place.city === sessionStorage.getItem("city")
                ? favoritesIn_City.push(place)
                : null
            );
            if (i === info.favorites.length - 1) {
              setFavoritesIn_City(favoritesIn_City);
            }
          }

          if (favoritesIn_City.length === 0) {
            favoritesUL.current.innerHTML = `<h4 class='no-faves'>Sorry, no favorites have been added for the current city.</h4>`;
          }
        }
      }

      loadData();

      let string = currentUser.email.toString();
      string = currentUser.metadata.createdAt + string.substring(0, 8);
      setUserCreds(string);
    }
  }, []);

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
    HotelLi.innerHTML = `<p>Hotel</p><p>$${expenses.Hotel}</p>`;
    budgetBreakdown.appendChild(HotelLi);
    sum = sum + parseInt(expenses.Hotel);

    const transportLi = document.createElement("LI");
    transportLi.classList.add("budget-li");
    transportLi.innerHTML = `<p>Transportation</p><p>$${expenses.Transportation}</p>`;
    budgetBreakdown.appendChild(transportLi);
    sum = sum + parseInt(expenses.Transportation);

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
    setRemainingBudget(tripBudget.total - sum);

    expenses.percentages();
  }

  function getTripDetails() {
    const date = info.trips[sessionStorage.getItem("trip")].Dates;
    const plan = info.trips[tripName.current.textContent].Plans;
    tripBudget.total =
      info.trips[sessionStorage.getItem("trip")].Expenses.Budget;
    tripBudget.hotel =
      info.trips[sessionStorage.getItem("trip")].Expenses.Hotel;
    tripBudget.transport =
      info.trips[sessionStorage.getItem("trip")].Expenses.Transportation;
    expenses.Hotel = info.trips[sessionStorage.getItem("trip")].Expenses.Hotel;
    expenses.Transportation =
      info.trips[sessionStorage.getItem("trip")].Expenses.Transportation;

    const d = info.trips[sessionStorage.getItem("trip")].Dates;

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
      for (let iter = 0; iter < plan[i][`Day ${i + 1}`].length; iter++) {
        let specificPlan = plan[i][`Day ${i + 1}`][iter];
        let planBudget = String(specificPlan).split("|")[2];
        let planTime = String(specificPlan).split("|")[1];
        if (planBudget === undefined) {
          planBudget = 0;
        }
        const image = `/${plan[i][`Day ${i + 1}`][iter].split("|")[0]}.jpg`;
        const div = document.createElement("div");
        div.innerHTML = `<div number='${iter}' place='${String(
          plan[i][`Day ${i + 1}`][iter].split("|")[0]
        )}' class='place-planned'>
            <img src="${image}"></img>
            <div place='${String(
              plan[i][`Day ${i + 1}`][iter].split("|")[0]
            )}' trip='${sessionStorage.getItem("trip")}' class="right-side-div">
            <div class='middle-div'>
            <a>${plan[i][`Day ${i + 1}`][iter].split("|")[0]}</a>
            <p>${getPlaceProps(
              String(plan[i][`Day ${i + 1}`][iter].split("|")[0]),
              "category"
            )} | ${getPlaceProps(
          String(plan[i][`Day ${i + 1}`][iter].split("|")[0]),
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
          plan[i][`Day ${i + 1}`][iter].split("|")[0]
        )}'value=${planTime} name="time" min="00:00" max="23:59" />
            </div>
            </div>
            <div class='trip-div-btns'>
            <button dayIndex='${i + 1}' place='${String(
          plan[i][`Day ${i + 1}`][iter].split("|")[0]
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

    setExpenses(expenses);
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
    const deletePlan = document.getElementsByClassName("delete-plan");
    for (let i = 0; i < deletePlan.length; i++) {
      deletePlan[i].addEventListener("click", (e) => {
        const dayIndex = e.target.getAttribute("dayIndex");
        const plan = dbTrips[tripName.current.textContent].Plans;
        const index = plan[dayIndex - 1][`Day ${dayIndex}`];

        for (let iter = 0; iter < index.length; iter++) {
          if (e.target.getAttribute("place") === index[iter].split("|")[0])
            index.splice(index.indexOf(index[iter]), 1);
          docMethods.updateTrips(userCreds, dbTrips);
          setDbTrips(dbTrips);
          e.target.closest(".place-planned").parentNode.remove();
        }

        setPlan(dbTrips[tripName.current.textContent].Plans);
      });
    }
  }

  const [currDay, setCurrDay] = useState(0);
  function handleListClicks(e) {
    let txt = e.target.innerText;
    const parent = e.target.closest(".place-planned");
    const listItem = e.target.closest(".trip-overview-li");
    const plan =
      dbTrips[tripName.current.textContent].Plans[listItem.getAttribute("id")][
        `Day ${parseInt(listItem.getAttribute("id")) + 1}`
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
        favoritesList.current.style.width = "26rem";
      } else {
        favoritesList.current.style.width = "15rem";
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

  function handleHotelTransport(e) {
    const button = e.target;
    const span = e.target.previousElementSibling;
    if (e.target.innerHTML === "Set") {
      span.innerHTML = `<span>${span.firstElementChild.value}</span>`;
      button.textContent = "Edit";
      expenses[e.target.closest(".cost-div").title] = parseInt(span.innerText);
      dbTrips[sessionStorage.getItem("trip")].Expenses[
        e.target.closest(".cost-div").title
      ] = parseInt(span.innerText);
      docMethods.updateTrips(userCreds, dbTrips);
      setDbTrips(dbTrips);
      tripBudget[e.target.closest(".cost-div").title] = span.innerText;
      setTripBudget(tripBudget);
      expenses.percentages();
      setExpenses(expenses);
      setPlan(dbTrips[sessionStorage.getItem("trip")]);
    } else if (e.target.innerHTML === "Edit") {
      span.innerHTML = `<input id='newInput' value='${span.innerText}' />`;
      const input = document.getElementById("newInput");
      input.focus();
      button.textContent = "Set";
    }
  }

  function editBudget(e) {
    const parent = e.target.parentNode;

    if (e.target.textContent === "Set New Budget") {
      const span = document.createElement("span");
      const value = document.getElementById("newInputBudget").value;
      span.textContent = `$${value}`;
      dbTrips[sessionStorage.getItem("trip")].Expenses.Budget = value;
      parent.replaceChild(span, document.getElementById("newInputBudget"));
      docMethods.updateTrips(userCreds, dbTrips);
      setDbTrips(dbTrips);
      tripBudget.total = value;
      setTripBudget(tripBudget);
      e.target.textContent = "Edit Budget";
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

  function hideFavoritesList(e) {
    if (
      !e.target.classList.contains("add-li") &&
      (favoritesList.current.style.right == 0 ||
        favoritesList.current.style.right == "0px") &&
      document.getElementById("newNode")
    ) {
      favoritesList.current.style.right = "-30rem";
      document.getElementById("newNode").removeAttribute("id");
    }
  }

  const dollar = "$";

  function addPlace(e) {
    if (e.target.textContent === "Add") {
      e.target.nextElementSibling.childNodes[2].style.display = "flex";
      e.target.textContent = "Confirm";
      e.target.style.backgroundColor = "#98FB98";
    } else if (e.target.textContent === "Confirm") {
      e.target.textContent = "Add";
      e.target.style.backgroundColor = "#2E64FE";
      e.target.nextElementSibling.childNodes[2].style.display = "none";
      e.target.closest("#favorites-list").style.right = "-30rem";
      const name = e.target.nextElementSibling.childNodes[0].textContent;
      let budget =
        e.target.nextElementSibling.childNodes[2].childNodes[0].childNodes[1]
          .firstElementChild.value;
      let time = e.target.nextElementSibling.childNodes[2].childNodes[1].value;
      if (budget === "") {
        budget = 0;
      }
      if (time === "") {
        time = "00:00";
      }
      const newNode = document.getElementById("newNode");
      const div = document.createElement("div");
      const image = `/${name}.jpg`;
      div.innerHTML = `<div place='${name}' number='${
        parseInt(newNode.previousElementSibling.getAttribute("number")) + 1
      }' class='place-planned'>
    <img src="${image}"></img>
    <div place='${name}' trip='${sessionStorage.getItem(
        "trip"
      )}' class="right-side-div">
    <div class='middle-div'>
    <a>${name}</a>
    <p>${getPlaceProps(name, "category")} | ${getPlaceProps(name, "area")}</p>
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
    <button dayIndex='${currDay}' place='${name}' trip='${sessionStorage.getItem(
        "trip"
      )}' class='delete-plan'>Delete</button>
    </div>
    </div>`;

      const index = parseInt(newNode.parentNode.getAttribute("id"));

      newNode.parentNode.insertBefore(div, newNode);
      dbTrips[tripName.current.textContent].Plans[index][
        `Day ${index + 1}`
      ].push(`${name}|${time}|${budget}`);

      docMethods.updateTrips(userCreds, dbTrips);
      setDbTrips(dbTrips);
      setBudgetChange((budgetChange) => !budgetChange);
      expenses.percentages();
      setExpenses(expenses);
      newNode.removeAttribute("id");
      setPlan(dbTrips[tripName.current.textContent]);
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch {
      alert("Failed to log out");
    }
  }

  function handleSendingPlans(email, title, plans) {
    let emailToString = String(email).replace(" ", ",");
    console.log(plans);
    fetch(`http://localhost:3000/mail/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emails: emailToString,
        title: title,
        plans: plans,
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
        <section id="main" onClick={(e) => hideFavoritesList(e)}>
          <nav>
            <FontAwesomeIcon
              icon={faPaperPlane}
              size="2xl"
              style={{ color: "white" }}
            />
            <div>
              <button className="home-btn-planner">
                <Link to="/Home">Home</Link>
              </button>
              <button
                className="log-out-planner"
                onClick={() => handleLogout()}
              >
                <Link to="/login">Log Out</Link>
              </button>
            </div>
          </nav>
          <div id="main-section">
            <div id="trip-name-photo">
              <img src={`/${sessionStorage.getItem("city")}.jpg`} alt="" />
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
                <button
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
                </button>
              </div>
              <div className="budgeting-tool">
                <div className="budget-tool-header">
                  <span>${tripBudget.total}</span>
                  <button onClick={(e) => editBudget(e)}>Edit Budget</button>
                </div>
                <div id="cost-div-list">
                  <div
                    onClick={(e) => handleHotelTransport(e)}
                    title="Hotel"
                    className="cost-div"
                  >
                    <h5>Total Hotel Cost</h5>
                    <div>
                      <a>$</a>
                      <span>
                        <span>{tripBudget.hotel}</span>
                      </span>
                      <button>Edit</button>
                    </div>
                  </div>
                  <div
                    onClick={(e) => handleHotelTransport(e)}
                    title="Transportation"
                    className="cost-div"
                  >
                    <h5>Total Transportation Cost</h5>
                    <div>
                      <a>$</a>
                      <span>
                        <span>{tripBudget.transport}</span>
                      </span>
                      <button>Edit</button>
                    </div>
                  </div>
                </div>
                <hr className="budget-hr" />

                <div className="visual-breakdown">
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
                </div>
                <hr className="budget-hr" />
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
        <h3>Choose from your favorites</h3>
        <hr />
        <ul ref={favoritesUL}>
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
                      <input
                        type="time"
                        placeholder="hh:mm"
                        className="time-itin"
                      />
                    </div>
                  </div>
                </li>
              ))
            : null}
        </ul>
      </div>
      <div id="remaining-budget-widget">
        <h4>Remaining Budget: ${remainingBudget}</h4>
      </div>
      <footer id="footer">
        <div className="row">
          <div className="social-icons">
            <p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
              </svg>
              &nbsp;&nbsp;
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 640 512"
              >
                <path d="M640 317.9C640 409.2 600.6 466.4 529.7 466.4C467.1 466.4 433.9 431.8 372.8 329.8L341.4 277.2C333.1 264.7 326.9 253 320.2 242.2C300.1 276 273.1 325.2 273.1 325.2C206.1 441.8 168.5 466.4 116.2 466.4C43.42 466.4 0 409.1 0 320.5C0 177.5 79.78 42.4 183.9 42.4C234.1 42.4 277.7 67.08 328.7 131.9C365.8 81.8 406.8 42.4 459.3 42.4C558.4 42.4 640 168.1 640 317.9H640zM287.4 192.2C244.5 130.1 216.5 111.7 183 111.7C121.1 111.7 69.22 217.8 69.22 321.7C69.22 370.2 87.7 397.4 118.8 397.4C149 397.4 167.8 378.4 222 293.6C222 293.6 246.7 254.5 287.4 192.2V192.2zM531.2 397.4C563.4 397.4 578.1 369.9 578.1 322.5C578.1 198.3 523.8 97.08 454.9 97.08C421.7 97.08 393.8 123 360 175.1C369.4 188.9 379.1 204.1 389.3 220.5L426.8 282.9C485.5 377 500.3 397.4 531.2 397.4L531.2 397.4z" />
              </svg>{" "}
              &nbsp;&nbsp;
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 448 512"
              >
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </svg>{" "}
              &nbsp;&nbsp;
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
              </svg>
            </p>
          </div>
        </div>
        <p
          className="copyright"
          style={{ marginBottom: 0, paddingBottom: "1rem" }}
        >
          © Copyright 2023 Travel Smart
        </p>
      </footer>

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
                tripName.current.textContent,
                plan.toString()
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
    </>
  );
}

export default TripPlanner;
