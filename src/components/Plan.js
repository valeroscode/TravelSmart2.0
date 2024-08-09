import React, { useEffect, useRef, useState }  from "react"
import './styles/Trips.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faCheck,
  faX,
  faChevronRight,
  faRightLong,
  faCalendar,
  faChevronLeft,
  faClock,
  faUser,
  faArrowRightFromBracket 
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { tripObj, tripDates, dateObj } from "./getPlaceInfo.mjs";
import { allPlaces } from "./allMarkers.mjs";
import { docMethods } from "./firebase/firebase";
import { useAuth } from "./contexts/AuthContext";
import Footer from "./footer";

function Plan() {

    const navigate = useNavigate();

    const [friends, setFriends] = useState(['friend1', 'friend2', 'friend3']);
    const [selectedFriends, setSelectedFriends] = useState([]);

    useEffect(() => {       
    
          window.addEventListener("click", (e) => {
              hideEditUser(e)
          });
            
        
      }, []);

    const { currentUser } = useAuth();
  const [info, setInfo] = useState({});
  const account = useRef();
  const editUser = useRef();
  const userNameDiv = useRef();
  const friendList = useRef();
  const friendSearch = useRef();

  function hideEditUser (e) {
    if (!e.target.closest('#edit-user') && !e.target.closest('.account')) {
      editUser.current.style.display = 'none'
      userNameDiv.current.style.backgroundColor = 'white';
      userNameDiv.current.firstElementChild.style.color = 'black';
    }
}

  let string = "";
  const unorderedList = useRef();

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
    end = useRef(),
    calWrapper = useRef(),
    wrapperCon = useRef();

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

  useEffect(() => {
    setInfo(currentUser.trips);
  }, [currentUser]);

  function selectDates(e, month, year, day) {
    if (
      (e.innerText == tripObj.From.split(" ")[0] &&
        e.style.backgroundColor == "rgb(138, 5, 255)") ||
      (e.innerText == tripObj.To.split(" ")[0] &&
        e.style.backgroundColor == "rgb(138, 5, 255)")
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
      e.style.backgroundColor = "rgb(138, 5, 255)";
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
          day[i].style.backgroundColor = "rgb(138, 5, 255)";
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
          day[i].style.backgroundColor = "rgb(138, 5, 255)";
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
            day[i].style.backgroundColor = "rgb(138, 5, 255)";
            day[i].style.color = "white";
          }
        }
        if (
          day[i].innerText == tripObj.From.split(" ")[0] ||
          day[i].innerText == tripObj.To.split(" ")[0]
        ) {
          day[i].style.backgroundColor = "rgb(138, 5, 255)";
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
            day[i].style.backgroundColor = "rgb(138, 5, 255)";
            day[i].style.color = "white";
          } else if (
            parseInt(day[i].innerText) <= parseInt(tripObj.To.split(" ")[0]) &&
            tripObj.To.split(" ")[1] === months[dateObj.currMonth]
          ) {
            day[i].style.backgroundColor = "rgb(138, 5, 255)";
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
          if (info === undefined) {
            let info = { [tripObj.Name]: newTrip };
            docMethods.updateTrips(string, info);
            setTimeout(() => {
              window.location.reload();
            }, 300);
          } else {
            info[String(tripObj.Name)] = newTrip;
            docMethods.updateTrips(string, info);
            setTimeout(() => {
              window.location.reload();
            }, 300);
          }
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
    delete info[str];
    docMethods.updateTrips(string, info);
    document.getElementById("are-you-sure").style.display = "none";
    deletedTrip.remove();
  }

  function getTripDetails(e) {
    sessionStorage.setItem("trip", e.target.getAttribute("name"));
    sessionStorage.setItem("city", e.target.getAttribute("city"));

    window.open("https://travelsmart2-0.onrender.com/MyTrip");
  }

  function timeFromTrip(trip) {
    if (trip.year > dateObj.currYear) {
      return (
        <a style={{ color: "#053AD1" }}>
          <FontAwesomeIcon icon={faCalendar} style={{ color: "#053AD1" }} />{" "}
          Next Year
        </a>
      );
    }
    if (
      months[trackerMonth] === trip.dates[0].split(" ")[0] &&
      trip.dates[0].split(" ")[1] - dateObj.date.getDate() <= 10 &&
      trip.dates[0].split(" ")[1] - dateObj.date.getDate() >= 1
    ) {
      return (
        <a style={{ color: "green" }}>
          <FontAwesomeIcon icon={faClock} style={{ color: "green" }} /> Coming
          Soon
        </a>
      );
    } else if (
      months.indexOf(trip.dates[0].split(" ")[0]) - trackerMonth ===
      1
    ) {
      return (
        <a style={{ color: "#577DEB" }} id="months-away">
          <FontAwesomeIcon style={{ color: "#577DEB" }} icon={faRightLong} />{" "}
          Next Month
        </a>
      );
    } else if (months.indexOf(trip.dates[0].split(" ")[0]) - trackerMonth > 0) {
      return (
        <a id="months-away" style={{ color: "#FDB135" }}>
          {months.indexOf(trip.dates[0].split(" ")[0]) - trackerMonth} Months
          Away
        </a>
      );
    } else if (
      trip.dates.includes(
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

  function matchKeyboardInput(e) {
    const value = e.target.value;

    const friend = document.getElementsByClassName('friend-name-search');

    for (let i = 0; i < friend.length; i++) {
       if (value === '') {
        friend[i].style.display = "none"
       } else {
       if (String(friend[i].textContent).toLocaleLowerCase().includes(String(value).toLocaleLowerCase())) {
        friend[i].style.display = "block"
       } else {
        friend[i].style.display = "none"
       }
      }
    }
 }


return (
<>
<section id="create-trip-header">
<div id="c-header-left">
    <div>
    <FontAwesomeIcon icon={faPaperPlane} />
    <h2>Travel Smart</h2>
    <button onClick={() => navigate('/home')}>Home</button>
    </div>
    </div>
 
    <div id="acc-and-trip-c">
          
          <div ref={account} className="account-c" 
          onClick={() => {
            editUser.current.style.display = "flex";
            userNameDiv.current.style.backgroundColor = 'black';
            userNameDiv.current.firstElementChild.style.color = 'white';
         
          }}>
            <div ref={editUser} id="edit-user">
              <div>
              <FontAwesomeIcon icon={faUser} />
              <h4>{currentUser.name}</h4>
              </div>
              <h5>avalero.software@gmail.com</h5>
              <hr/>
  
            <button onClick={() => handleLogout()}><FontAwesomeIcon icon={faArrowRightFromBracket}/> Sign Out</button>
            </div>
                  {currentUser ? (
                    <div className="user-name" ref={userNameDiv}>
                      <p id="users-name-c">{currentUser.name}</p>
                      <div id="account-photo-c">
                      <FontAwesomeIcon icon={faUser} />
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
 

</section>
<section id="planning-a-new-trip-section">
<div id="new-trip">
          <h3 className="new-trip-h3">Plan a new trip</h3>
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
                  onClick={(e) => {
                    e.target.nextElementSibling.style.left = '1.8rem';
                    e.target.previousElementSibling.style.top = '1.25rem';
                    e.target.previousElementSibling.style.fontSize = '0.7rem';
                  }}
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
                  onClick={(e) => {
                    e.target.nextElementSibling.style.left = '1.8rem';
                    e.target.previousElementSibling.style.top = '1.25rem';
                    e.target.previousElementSibling.style.fontSize = '0.7rem';
                  }}
                />
                <span className="placeholder">
                  e.g. Birthday, Family Summer
                </span>
              </div>
              <div id="date-selection" onClick={() => {
                wrapperCon.current.style.display = "flex"
              }}>
                <p className="input-dates">Dates</p>
                <div type="text" id="dates-input" className="tripPlace"></div>
                <span className="selectDate" ref={start} id="tripStartDate">
                  <FontAwesomeIcon icon={faCalendar} /> Select Dates
                </span>
                <span className="selectDate" ref={end} id="tripEndDate"></span>
              </div>
              
            </div>
          </div>
          </div>
<div id="wrapper-container" ref={wrapperCon}>
<div id="wrapper" ref={calWrapper}>
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
          <div id="friends-section">
                <h5>Add Friends (optional)</h5>
                <p className="friends-section-desc">Collaborate on plans, create together</p>
                <div id="friend-search">
                <input type="search" placeholder="Search" ref={friendSearch} 
                onKeyUp={(e) => matchKeyboardInput(e)}></input>
                <div id="friend-search-dropdown">
                  {
                    friends.map((friend) => <div className="friend-name-search" onClick={(e) => {
                      selectedFriends.push(e.target.textContent);
                      setSelectedFriends(selectedFriends);
                      const updatedFriends = friends.filter(f => f !== e.target.textContent);
                      setFriends(updatedFriends)
                      for (let i = 0; i < updatedFriends.length; i++) {
                        const f = document.getElementsByClassName('friend-name-search');
                        f[i].style.display = 'none';
                      }
                    }}><p>{friend}</p></div>)
                  }
                </div>
                </div>
                <div id="friends-list" ref={friendList}>
                    <ul>
                      {
                        selectedFriends.map((friend) => 
                        <li>
                          <div className="friend-photo"></div>
                          <h3 className="friend-name">{friend}</h3>
                          <div className="remove-friend" onClick={(e) => {
                            const text = e.target.previousElementSibling.textContent;
                            setFriends(friends.push(text))
                            console.log(friends)
                            const updatedSelFriends = friends.filter(f => f !== text);
                            setSelectedFriends(updatedSelFriends)
                          }}></div>
                        </li>)
                      }
                    </ul>
                </div>
              </div>
          </div>
</section>
<Footer/>
</>
)
}

export default Plan