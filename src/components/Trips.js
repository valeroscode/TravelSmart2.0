import React, { useEffect, useRef, useState } from "react";
import "./styles/Trips.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faX,
  faChevronRight,
  faRightLong,
  faCalendar,
  faChevronLeft,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import allPlaces from "./allMarkers.mjs";
import { docMethods } from "./firebase/firebase";
import { useAuth } from "./contexts/AuthContext";

import {
  tripObj,
  tripDates,
  dateObj,
} from "./getPlaceInfo.mjs";

function TripsPage() {
  var duplicates = (array) =>
    array.filter((item, index) => array.indexOf(item) === index);

  const trackerDate = new Date();
  const trackerMonth = trackerDate.getMonth();

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

  const currentDate = useRef(),
    dayTag = useRef(),
    start = useRef(),
    end = useRef();

  const renderCalendar = (year, month) => {
    let firstDateofMonth = new Date(year, month, 1).getDay(),
      lastDateofMonth = new Date(year, month + 1, 0).getDate(),
      lastDayofMonth = new Date(year, month, lastDateofMonth).getDay(),
      lastDateofLastMonth = new Date(year, month, 0).getDate();
    let liTag = "";

    for (let i = firstDateofMonth; i > 0; i--) {
      liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
      liTag += `<li class='day'>${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
      liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }

    currentDate.current.innerText = `${months[month]} ${year}`;
    dayTag.current.innerHTML = liTag;
    const days = document.querySelectorAll("li");
    if (tripObj.From !== "" && tripObj.To !== "") {
      selectDates_OnRender(month, days);
    }
  };

  useEffect(() => {
    renderCalendar(dateObj.currYear, dateObj.currMonth);
  }, []);

  function selectDates(e, month, year, day) {
    if (
      (e.innerText == tripObj.From.split(" ")[0] &&
        e.style.backgroundColor == "rgb(46, 100, 254)") ||
      (e.innerText == tripObj.To.split(" ")[0] &&
        e.style.backgroundColor == "rgb(46, 100, 254)")
    ) {
      for (let i = 0; i < day.length; i++) {
        if (!day[i].classList.contains("inactive")) {
          day[i].style.backgroundColor = "white";
          day[i].style.color = "black";
          tripObj.From = "";
          tripObj.To = "";
        }
      }
      e.style.backgroundColor = "white";
      e.style.color = "black";
    } else {
      e.style.backgroundColor = "#2E64FE";
      e.style.color = "white";

      if (tripObj.From === "") {
        tripObj.From = `${e.textContent} ${months[dateObj.currMonth]} ${
          dateObj.currYear
        }`;
        tripObj.Year = year;
      }

      if (parseInt(tripObj.From.split(" ")[2]) < year) {
        tripObj.To = `${e.innerText} ${e.parentNode.parentNode.previousElementSibling.innerText}`;
      } else if (
        parseInt(e.innerText) >= parseInt(tripObj.From.split(" ")[0])
      ) {
        tripObj.To = `${e.innerText} ${e.parentNode.parentNode.previousElementSibling.innerText}`;
      } else if (parseInt(tripObj.From.split(" ")[2]) > year) {
        tripObj.To = tripObj.From;
        tripObj.From = `${e.innerText} ${e.parentNode.parentNode.previousElementSibling.innerText}`;
      } else if (months.indexOf(tripObj.From.split(" ")[1]) + 1 < month) {
        tripObj.To = `${e.innerText} ${e.parentNode.parentNode.previousElementSibling.innerText}`;
      } else if (
        parseInt(e.innerText) < parseInt(tripObj.From.split(" ")[0]) &&
        parseInt(tripObj.From.split(" ")[0]) !==
          parseInt(tripObj.To.split(" ")[0])
      ) {
        tripObj.From = `${e.innerText} ${e.parentNode.parentNode.previousElementSibling.innerText}`;
      } else if (parseInt(e.innerText) < parseInt(tripObj.From.split(" ")[0])) {
        tripObj.To = tripObj.From;
        tripObj.From = `${e.innerText} ${e.parentNode.parentNode.previousElementSibling.innerText}`;
      }

      start.current.textContent = `${tripObj.From.split(" ")[1]} ${
        tripObj.From.split(" ")[0]
      }`;
      end.current.textContent = `${tripObj.To.split(" ")[1]} ${
        tripObj.To.split(" ")[0]
      }`;

      if (parseInt(tripObj.From.split(" ")[2]) >= year) {
        if (
          months.indexOf(String(start.current.textContent).split(" ")[0]) >
          months.indexOf(String(end.current.textContent).split(" ")[0])
        ) {
          tripObj.From = `${e.innerText} ${e.parentNode.parentNode.previousElementSibling.innerText}`;
          start.current.textContent = `${tripObj.From.split(" ")[1]} ${
            tripObj.From.split(" ")[0]
          }`;
        }
      }

      handleFillingDays(day);

      const days = (start, end, month) => {
        for (let i = start; i <= end; i++) {
          tripDates.push(`${months[month]} ${i}`);
        }
      };

      const daysInMonth = (month, year) =>
        new Date(year, months.indexOf(month) + 1, 0).getDate();
      //push all days of trip if the entire trip is in the same month
      if (tripObj.From.split(" ")[1] === tripObj.To.split(" ")[1]) {
        //Emptys the tripdates array so that when pushed all dates are in order
        tripDates.map((t) =>
          tripDates.splice(tripDates.indexOf(t), tripDates.length)
        );
        for (
          let i = parseInt(tripObj.From.split(" ")[0]);
          i <= parseInt(tripObj.To.split(" ")[0]);
          i++
        ) {
     
          const fullDay = `${tripObj.From.split(" ")[1]} ${i}`;
          if (!tripDates.includes(fullDay)) {
            tripDates.push(fullDay);
          }
        }

        //push all days of trip if the trip occurs acorss multiple months
      } else if (
        parseInt(tripObj.From.split(" ")[2]) <
        parseInt(tripObj.To.split(" ")[2])
      ) {
        //Emptys the tripdates array so that when pushed all dates are in order
        tripDates.map((t) =>
          tripDates.splice(tripDates.indexOf(t), tripDates.length)
        );

        for (let i = months.indexOf(tripObj.From.split(" ")[1]); i < 12; i++) {
          if (months.indexOf(tripObj.From.split(" ")[1]) === i) {
            days(
              parseInt(tripObj.From.split(" ")[0]),
              daysInMonth(
                parseInt(tripObj.From.split(" ")[2]),
                months.indexOf(tripObj.From.split(" ")[1])
              ),
              i
            );
          }
          if (
            months.indexOf(tripObj.To.split(" ")[1]) !== i &&
            months.indexOf(tripObj.From.split(" ")[1]) !== i
          ) {
            days(
              1,
              daysInMonth(months[i], parseInt(tripObj.From.split(" ")[2])),
              i
            );
          }
        }
        for (let i = 0; i <= months.indexOf(tripObj.To.split(" ")[1]); i++) {
          if (months.indexOf(tripObj.To.split(" ")[1]) === i) {
            days(1, parseInt(tripObj.To.split(" ")[0]), i);
          }
          if (
            months.indexOf(tripObj.To.split(" ")[1]) !== i &&
            months.indexOf(tripObj.From.split(" ")[1]) !== i
          ) {
            days(
              1,
              daysInMonth(months[i], parseInt(tripObj.From.split(" ")[2])),
              i
            );
          }
        }
      } else {
        //Emptys the tripdates array so that when pushed all dates are in order
        tripDates.map((t) =>
          tripDates.splice(tripDates.indexOf(t), tripDates.length)
        );

        for (
          let i = months.indexOf(tripObj.From.split(" ")[1]);
          i <= months.indexOf(tripObj.To.split(" ")[1]);
          i++
        ) {
          if (months.indexOf(tripObj.From.split(" ")[1]) === i) {
            days(
              parseInt(tripObj.From.split(" ")[0]),
              daysInMonth(
                parseInt(tripObj.From.split(" ")[2]),
                months.indexOf(tripObj.From.split(" ")[1])
              ),
              i
            );
          }
          if (months.indexOf(tripObj.To.split(" ")[1]) === i) {
            days(1, parseInt(tripObj.To.split(" ")[0]), i);
          }
          if (
            months.indexOf(tripObj.To.split(" ")[1]) !== i &&
            months.indexOf(tripObj.From.split(" ")[1]) !== i
          ) {
            days(
              1,
              daysInMonth(months[i], parseInt(tripObj.From.split(" ")[2])),
              i
            );
          }
        }
      }
    }
  }
  function selectDates_OnRender(month, day) {
    if (
      tripObj.From.split(" ")[1] == months[month] ||
      tripObj.To.split(" ")[1] == months[month]
    ) {
      handleFillingDays(day);
    }
    for (let i = 0; i < day.length; i++) {
      if (!day[i].classList.contains("inactive")) {
        if (
          tripObj.From.split(" ")[1] !== months[dateObj.currMonth] &&
          tripObj.To.split(" ")[1] !== months[dateObj.currMonth] &&
          day[i].parentNode.classList.contains("days") &&
          tripObj.To !== tripObj.From &&
          dateObj.currMonth + 1 <
            months.indexOf(tripObj.To.split(" ")[1]) + 1 &&
          dateObj.currMonth + 1 >
            months.indexOf(tripObj.From.split(" ")[1]) + 1 &&
          tripObj.From.split(" ")[2] === tripObj.To.split(" ")[2]
        ) {
          day[i].style.backgroundColor = "#2E64FE";
          day[i].style.color = "white";
        }
        if (
          tripObj.From.split(" ")[1] !== months[dateObj.currMonth] &&
          tripObj.To.split(" ")[1] !== months[dateObj.currMonth] &&
          day[i].parentNode.classList.contains("days") &&
          tripObj.To !== tripObj.From &&
          tripObj.From.split(" ")[2] < tripObj.To.split(" ")[2] &&
          dateObj.currMonth + 1 <= 12 &&
          ((dateObj.currMonth + 1 >= 1 &&
            dateObj.currMonth + 1 <
              months.indexOf(tripObj.To.split(" ")[1]) + 1) ||
            (dateObj.currMonth + 1 <= 12 &&
              dateObj.currMonth + 1 >
                months.indexOf(tripObj.From.split(" ")[1]) + 1))
        ) {
          day[i].style.backgroundColor = "#2E64FE";
          day[i].style.color = "white";
        }
      }
    }
  }

  function handleFillingDays(day) {
    for (let i = 0; i < day.length; i++) {
      if (
        !day[i].classList.contains("inactive") &&
        day[i].parentNode.classList.contains("days")
      ) {
        if (
          parseInt(day[i].innerText) > parseInt(tripObj.From.split(" ")[0]) &&
          parseInt(day[i].innerText) < parseInt(tripObj.To.split(" ")[0])
        ) {
          {
            day[i].style.backgroundColor = "#2E64FE";
            day[i].style.color = "white";
          }
        }
        if (
          day[i].innerText == tripObj.From.split(" ")[0] ||
          day[i].innerText == tripObj.To.split(" ")[0]
        ) {
          day[i].style.backgroundColor = "#2E64FE";
          day[i].style.color = "white";
        }
        if (parseInt(day[i].innerText) > parseInt(tripObj.To.split(" ")[0])) {
          day[i].style.backgroundColor = "white";
          day[i].style.color = "black";
        }
        if (
          months.indexOf(tripObj.From.split(" ")[1]) + 1 <
            months.indexOf(tripObj.To.split(" ")[1]) + 1 ||
          parseInt(tripObj.From.split(" ")[2]) <
            parseInt(tripObj.To.split(" ")[2])
        ) {
          if (
            parseInt(day[i].innerText) >=
              parseInt(tripObj.From.split(" ")[0]) &&
            tripObj.From.split(" ")[1] === months[dateObj.currMonth]
          ) {
            day[i].style.backgroundColor = "#2E64FE";
            day[i].style.color = "white";
          } else if (
            parseInt(day[i].innerText) <= parseInt(tripObj.To.split(" ")[0]) &&
            tripObj.To.split(" ")[1] === months[dateObj.currMonth]
          ) {
            day[i].style.backgroundColor = "#2E64FE";
            day[i].style.color = "white";
          } else {
            day[i].style.backgroundColor = "white";
            day[i].style.color = "black";
          }
        }
      }
    }
  }

  function handleCalendarClicks(e) {
    if (e !== undefined) {
      const day = document.getElementsByClassName("day");
      if (e.target.parentNode.classList.contains("days")) {
        selectDates(e.target, dateObj.currMonth + 1, dateObj.currYear, day);
      }
    }
  }

  function changeMonth(e) {
    if (e.target.id === "prev") {
      dateObj.currMonth = dateObj.currMonth - 1;
    } else if (e.target.id === "next") {
      dateObj.currMonth = dateObj.currMonth + 1;
    }
    if (dateObj.currMonth == 12) {
      dateObj.currYear = dateObj.currYear + 1;
      dateObj.currMonth = 0;
      dateObj.date = new Date(dateObj.currYear, dateObj.currMonth);
      renderCalendar(dateObj.currYear, 0);
      handleCalendarClicks();
    } else if (dateObj.currMonth < 0) {
      dateObj.currYear = dateObj.currYear - 1;
      dateObj.currMonth = 11;
      dateObj.date = new Date(dateObj.currYear, dateObj.currMonth);
      renderCalendar(dateObj.currYear, 11);
      handleCalendarClicks();
    } else {
      dateObj.date = new Date();
      renderCalendar(dateObj.currYear, dateObj.currMonth);
      handleCalendarClicks();
    }
  }

  // const selectDate = document.querySelectorAll(".selectDate")
  // selectDate.forEach(section => {

  //     if (section.id == "tripStartDate") {
  //         section.innerHTML = `From: ${from}`
  //     } else {
  //         section.innerHTML = `To: ${to}`
  //     }
  //     })
  //     const tripCreated = document.getElementById("trip-created");
  //     const field = e.target.parentNode.childNodes;
  //     const nameField = field[1],
  //      from = field[3],
  //      to = field[4],
  //      descrip = field[2],
  //      arrival = field[6],
  //      departure = field[8];
  //     if (nameField && nameField.value !== "" && from.innerText !== "Start Date"
  //     && to.innerText !== "End Date") {
  //     tripObj.Name = nameField.value;
  //     tripObj.Description = descrip.value;
  //     tripObj.Arrival = arrival.value;
  //     tripObj.Departure = departure.value;
  //     tripCreated.innerHTML = "Trip Created!"
  //     tripCreated.style.opacity = 1;
  //     tripCreated.style.display = "block";
  //     tripCreated.style.backgroundColor = "#00E08F";
  //     setTimeout(() => {
  //     nameField.value = "";
  //     descrip.value = "";
  //     arrival.value = "";
  //     departure.value = "";
  //     from.innerText = "Start Date";
  //     to.innerText = "End Date";
  //     tripObj.Name = "";
  //     tripObj.Description = "";
  //     from = "";
  //     to = "";
  //     tripObj.Arrival = "";
  //     tripObj.Departure = "";
  //     const days = document.querySelectorAll("li");
  //     for (let i = 0; i < days.length; i++) {
  //     if (days[i].parentNode.classList.contains("days")
  //     && days[i].style.backgroundColor == "rgb(46, 100, 254)") {
  //     days[i].style.backgroundColor = "white";
  //     days[i].style.color = "black";
  //     }
  //     }
  //     }, 500)
  //     } else {
  //     tripCreated.innerHTML = "Fill in the requried fields."
  //     tripCreated.style.opacity = 1;
  //     tripCreated.style.display = "block";
  //     tripCreated.style.backgroundColor = "#FF5656"
  //     }

  //     setTimeout(() => {
  //     tripCreated.style.opacity = 0;
  //     tripCreated.style.display = "none";
  //     }, 2000)

  const { currentUser, info } = useAuth();
  const [trips, setTrips] = useState([]);
  const [dbTrips, setDbTrips] = useState();
  let string = currentUser.email.toString();
  string = currentUser.metadata.createdAt + string.substring(0, 8);
  const unorderedList = useRef();

  useEffect(() => {
    if (info.trips) {
      setTimeout(() => {
        setTrips(Object.entries(info.trips));
        //Trips with the strucutre as seen in the database
        setDbTrips(info.trips);
      }, 2500);
    }
  }, []);

  useEffect(() => {}, [trips]);

  let formFunctions = {
    placeholderGone: function (e) {
      if (e.target.value !== "") {
        e.target.nextElementSibling.style.opacity = 0;
      } else {
        e.target.nextElementSibling.style.opacity = 1;
      }
    },
    changeInputField: function (e) {
      let element;
      if (
        element !== inputNameField.current &&
        element !== inputCityField.current
      ) {
        inputCity.current.style.fontSize = "1.3rem";
        inputCity.current.style.top = "2rem";
        inputName.current.style.fontSize = "1.3rem";
        inputName.current.style.top = "2rem";
      }

      if (inputCityField.current.value !== "") {
        inputCityField.current.previousElementSibling.style.fontSize = "0.7rem";
        inputCityField.current.previousElementSibling.style.top = "1.5rem";
      }

      if (inputNameField.current.value !== "") {
        inputNameField.current.previousElementSibling.style.fontSize = "0.7rem";
        inputNameField.current.previousElementSibling.style.top = "1.5rem";
      }

      if (e.target === inputCityField.current) {
        element = inputCityField.current;
      } else if (e.target === inputNameField.current) {
        element = inputNameField.current;
      }
      if (element) {
        element.previousElementSibling.style.fontSize = "0.7rem";
        element.previousElementSibling.style.top = "1.5rem";
      }
    },
  };

  let defineTrip = {
    where: function (e) {
      let cities = [];
      allPlaces.map((place) => cities.push(place.city));
      const citydd = document.getElementById("city-dropdown");
      cities = duplicates(cities);
      citydd.style.display = "flex";
      if (citydd.childNodes.length < cities.length) {
        for (let i = 0; i < cities.length; i++) {
          const city = document.createElement("a");
          city.innerHTML = cities[i];
          document.getElementById("city-dropdown").appendChild(city);
        }
      }
      if (e.target.value !== "") {
        e.target.nextElementSibling.style.opacity = 0;
      } else {
        e.target.nextElementSibling.style.opacity = 1;
      }
    },
    whereSelect: function (e) {
      tripObj.Where = e.target.textContent;

      document.getElementById("whereto").value = e.target.textContent;
      e.target.parentNode.style.display = "none";
    },
    Name: function (e) {
      tripObj.Name = e.target.value;
    },
    submit: function (e) {
      tripObj.Where = inputCityField.current.value;
      tripObj.Name = inputNameField.current.value;
      if (currentUser) {
        sessionStorage.setItem("trip", tripObj.Name);
        const newTrip = {
          City: tripObj.Where,
          Dates: tripDates,
          Plans: [],
          Year: tripObj.Year,
          Expenses: {
            Budget: 0,
            Hotel: 0,
            Transportation: 0,
          },
        };

        for (let i = 0; i < tripDates.length; i++) {
          newTrip.Plans.push({ [`Day ${i + 1}`]: [] });
        }

        if (tripObj.Name !== "") {
          dbTrips[tripObj.Name] = newTrip;
          docMethods.updateTrips(string, dbTrips);
          setDbTrips(dbTrips);
          setTimeout(() => {
            window.location.reload();
          }, 300);
        }
      } else {
        sessionStorage.setItem("tripname", tripObj.Name);
        sessionStorage.setItem("days", tripDates.length);
        for (let i = 0; i < tripDates.length; i++) {
          sessionStorage.setItem(`Day ${i}`, tripDates[i]);
        }
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
    },
  };

  const inputCity = useRef();
  const inputName = useRef();
  const inputNameField = useRef();
  const inputCityField = useRef();
  let deletedTrip;

  function deleteTrip(e, text) {
    document.getElementById("are-you-sure").style.display = "flex";
    document.getElementById("deleting-trip").textContent = `Deleting ${text}`;
    deletedTrip = e.target.closest(".trip-item");
  }

  function confirmTripDelete(e) {
    let str = e.target.parentNode.parentNode.childNodes[1].textContent.replace(
      "Deleting ",
      ""
    );
    delete dbTrips[str];
    docMethods.updateTrips(string, dbTrips);
    document.getElementById("are-you-sure").style.display = "none";
    deletedTrip.remove();
  }

  function getTripDetails(e) {
    sessionStorage.setItem("trip", e.target.getAttribute("name"));
    sessionStorage.setItem("city", e.target.getAttribute("city"));

    window.open("https://travelsmart2-0.onrender.com/#/MyTrip");
  }

  function timeFromTrip(trip) {
    if (trip[1].Year > dateObj.currYear) {
      return (
        <a style={{ color: "#053AD1" }}>
          <FontAwesomeIcon icon={faCalendar} style={{ color: "#053AD1" }} />{" "}
          Next Year
        </a>
      );
    }
    if (
      months[trackerMonth] === trip[1].Dates[0].split(" ")[0] &&
      trip[1].Dates[0].split(" ")[1] - dateObj.date.getDate() <= 10 &&
      trip[1].Dates[0].split(" ")[1] - dateObj.date.getDate() >= 1
    ) {
      return (
        <a style={{ color: "green" }}>
          <FontAwesomeIcon icon={faClock} style={{ color: "green" }} /> Coming
          Soon
        </a>
      );
    } else if (
      months.indexOf(trip[1].Dates[0].split(" ")[0]) - trackerMonth ===
      1
    ) {
      return (
        <a style={{ color: "#577DEB" }} id="months-away">
          <FontAwesomeIcon style={{ color: "#577DEB" }} icon={faRightLong} />{" "}
          Next Month
        </a>
      );
    } else if (
      months.indexOf(trip[1].Dates[0].split(" ")[0]) - trackerMonth >
      0
    ) {
      return (
        <a id="months-away" style={{ color: "#FDB135" }}>
          {months.indexOf(trip[1].Dates[0].split(" ")[0]) - trackerMonth} Months
          Away
        </a>
      );
    } else if (
      trip[1].Dates.includes(
        `${months[dateObj.currMonth]} ${trackerDate.getDate()}`
      )
    ) {
      return (
        <a style={{ color: "green" }}>
          <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />{" "}
          Happening Now
        </a>
      );
    } else {
      return (
        <a style={{ color: "red" }}>
          <FontAwesomeIcon icon={faX} /> Trip Passed
        </a>
      );
    }
  }

  function hideTripCreator(e) {
    e.target.parentNode.style.opacity = 0;
    setTimeout(() => {
      e.target.parentNode.style.display = "none";
    }, 350);
  }

  return (
    <>
      <div onClick={(e) => formFunctions.changeInputField(e)}>
        <div id="your-trips">
          <div className="trips-title">
            <h2 className="your-trips-h2" id="your-trips-text">
              Your Trips
            </h2>
          </div>
          <ul id="trips-con" ref={unorderedList}>
            {currentUser
              ? trips.map((trip) => (
                  <div key={trip[0]} className="trip-item">
                    <img
                      loading="lazy"
                      src={require(`./assets/${trip[1].City}.jpg`)}
                    ></img>
                    <div className="trip-flex">
                      <div>
                        <h2>{trip[0]}</h2>
                        <p>
                          {trip[1].Dates[0]} -{" "}
                          {trip[1].Dates[trip[1].Dates.length - 1]}
                        </p>
                        <h6>
                          {trip[1].City}
                          {timeFromTrip(trip)}
                        </h6>
                      </div>
                      <div className="trip-section-btns">
                        <button
                          name={trip[0]}
                          city={trip[1].City}
                          onClick={(e) => getTripDetails(e)}
                        >
                          Plan Trip
                        </button>
                        <button
                          name={trip[0]}
                          onClick={(e) =>
                            deleteTrip(e, e.target.getAttribute("name"))
                          }
                          className="delete-trip"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </ul>
        </div>

        <div id="new-trip">
          <button className="X-btn" onClick={(e) => hideTripCreator(e)}>
            X
          </button>
          <h3 className="new-trip-h3">New Trip</h3>
          <div className="trip-wrapper">
            <div id="trip-description">
              <div id="where-to-div">
                <span className="input-title" ref={inputCity}>
                  Where to?
                </span>
                <input
                  tabIndex="1"
                  onKeyUp={(e) => defineTrip.where(e)}
                  ref={inputCityField}
                  id="whereto"
                  className="tripPlace"
                  type="text"
                  required
                  autocomplete="off"
                />
                <span className="placeholder">e.g. Miami, North Pole...</span>
                <div
                  id="city-dropdown"
                  onClick={(e) => defineTrip.whereSelect(e)}
                ></div>
              </div>
              <div id="where-to-div">
                <p className="input-title" ref={inputName}>
                  Trip name
                </p>
                <input
                  tabIndex="1"
                  ref={inputNameField}
                  onKeyUp={(e) => formFunctions.placeholderGone(e)}
                  className="tripPlace"
                  type="text"
                  required
                />
                <span className="placeholder">
                  e.g. Birthday, Family Summer
                </span>
              </div>
              <div id="date-selection">
                <p className="input-dates">Dates</p>
                <div type="text" id="dates-input" className="tripPlace"></div>
                <span className="selectDate" ref={start} id="tripStartDate">
                  <FontAwesomeIcon icon={faCalendar} /> Select Dates
                </span>
                <span className="selectDate" ref={end} id="tripEndDate"></span>
              </div>
            </div>
          </div>

          <div id="wrapper">
            <header>
              <div id="month-arrows">
                <span
                  id="prev"
                  onClick={(e) => changeMonth(e)}
                  className="rounded-arrow"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </span>
                <p ref={currentDate} className="current-date"></p>
                <span
                  id="next"
                  onClick={(e) => changeMonth(e)}
                  className="rounded-arrow"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </span>
              </div>
            </header>
            <div className="calendar">
              <ul className="weeks">
                <li>Sun</li>
                <li>Mon</li>
                <li>Tue</li>
                <li>Wed</li>
                <li>Thu</li>
                <li>Fri</li>
                <li>Sat</li>
              </ul>
              <hr className="hr-calendar" />
              <ul
                ref={dayTag}
                className="days"
                onClick={(e) => handleCalendarClicks(e)}
              >
                <li className="inactive">1</li>
              </ul>
              <button
                id="create-trip-btn"
                onClick={(e) => defineTrip.submit(e)}
              >
                Create Trip
              </button>
            </div>
          </div>

          <div id="trip-created">
            <p>New trip created!</p>
          </div>
        </div>
        <div id="are-you-sure">
          <h5>Are you sure?</h5>
          <p id="deleting-trip">Deleting trip</p>
          <div>
            <button id="delete-btn" onClick={(e) => confirmTripDelete(e)}>
              Yes, delete
            </button>
            <button
              id="cancel-btn"
              onClick={(e) => {
                e.target.parentNode.parentNode.style.display = "none";
              }}
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default TripsPage;
