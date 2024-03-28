import "./styles/Miami.css";
import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { docMethods } from "./firebase/firebase";

function AddTrip_Button() {
  const { currentUser, info } = useAuth();
  const [trips, setTrips] = useState([]);
  const [dbTrips, setDbTrips] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setTimeout(() => {
        if (info.trips) {
          //Changed trips state to reflect trips in the database
          setTrips(
            Object.entries(info.trips).filter(
              (trip, index) => trip[1].City === sessionStorage.getItem("city")
            )
          );
          console.log(Object.entries(info.trips));
          setDbTrips(info.trips);
          //Sets loading to false to rerender the component once the trips variables have been set to match whats in the database
          setLoading(false);
        }
      }, 2500);
    }
  }, []);

  function updateTrip(e) {
    //All variables before and including dayNumber are used to traverse the dbTrips object
    let string = currentUser.email.toString();
    string = currentUser.metadata.createdAt + string.substring(0, 8);
    const tripName = e.target.closest(".tripSection").childNodes[0].textContent;
    const index = e.target.getAttribute("index");
    const dayNumber = `Day ${parseInt(index) + 1}`;
    const placeName = document
      .getElementById("adding-place")
      .textContent.replace("Adding ", "");
    //Pushes the new place into a specific day for a specific trip
    dbTrips[tripName].Plans[index][dayNumber].push(`${placeName}||0`);
    //Updates the database
    docMethods.updateTrips(string, dbTrips);
    setDbTrips(dbTrips);
    setTrips(Object.entries(info.trips));
    const addToTrip = document.getElementById("adding-to-trip");
    //Makes the add to trip modal disappear
    addToTrip.style.opacity = 0;
    setTimeout(() => {
      addToTrip.style.display = "none";
    }, 400);
    //Notification after a new place has been added to a trip
    const notification = document.getElementById("favorite-notification");
    notification.innerHTML = `<strong>${placeName}</strong> has been added to a trip`;
    notification.style.display = "block";
    notification.style.opacity = 1;
    notification.style.width = "10rem";
    setTimeout(() => {
      notification.style.display = "none";
      notification.style.width = 0;
      notification.style.opacity = 0;
    }, 3000);

    for (
      let i = 0;
      i < document.getElementsByClassName("add-btn").length;
      i++
    ) {
      document.getElementsByClassName("add-btn")[i].textContent = "Add";
    }
  }

  //Used for the X button on the modal
  function hide(e) {
    e.target.parentNode.style.opacity = 0;
    setTimeout(() => {
      e.target.parentNode.style.display = "none";
    }, 400);
  }

  //Used to show the day name that corresponds to each of the dates for each trip
  const daysoftheweek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div id="adding-to-trip">
      <button className="exit" onClick={(e) => hide(e)}>
        X
      </button>
      <h3>Save to trip</h3>
      <p id="adding-place"></p>
      <div id="trips-list">
        {/* Populates the trip modal with the trips array */}
        {!loading
          ? trips.map((trip) => (
              <div className="tripSection" key={trip[0]}>
                <h2 key={`${trip[0]}h2`}>{trip[0]}</h2>
                <p>
                  {trip[1].Dates[0]} - {trip[1].Dates[trip[1].Dates.length - 1]}
                </p>
                <div id="day-select-div" key={`${trip[0]}div`}>
                  <p className="choose-day" key={`${trip[0]}p`}>
                    Choose a day
                  </p>
                  {Object.values(trip[1].Dates).map((btn, index) => (
                    <a
                      key={`${index}`}
                      onClick={(e) => updateTrip(e)}
                      className="day-select"
                      index={index}
                    >
                      <h4 key={trip[0] + index}>
                        {
                          daysoftheweek[
                            new Date(
                              `${btn}, ${trip[1].Year} 23:15:30`
                            ).getDay()
                          ]
                        }
                        , {btn}
                      </h4>
                      {trip[1].Plans[index][`Day ${index + 1}`].map((plan) => (
                        <p> - {String(plan.split("|")[0])}</p>
                      ))}
                    </a>
                  ))}
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default AddTrip_Button;
