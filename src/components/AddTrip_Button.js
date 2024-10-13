import "./styles/Miami.css";
import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { docMethods } from "./firebase/firebase";

function AddTrip_Button() {
  const { currentUser, trips } = useAuth();
  const [dbTrips, setDbTrips] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setTimeout(() => {
        if (trips.trips) {
          //Changed trips state to reflect trips in the database
          setTrips(
            Object.entries(trips.trips).filter(
              (trip, index) => trip[1].City === sessionStorage.getItem("city")
            )
          );
          console.log(Object.entries(trips.trips));
          setDbTrips(trips.trips);
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
          ? <h2>This Feature is still in the works. For now, add places to your trip by clicking "Edit Trip" in the home page.</h2>
          : null}
      </div>
    </div>
  );
}

export default AddTrip_Button;
