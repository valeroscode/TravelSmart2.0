import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { allPlaces } from "./allMarkers.mjs";
import { learnMoreAboutPlace, handleTripAdderPopup } from "./getPlaceInfo.mjs";

export function generalScript() {
  console.log(allPlaces);
  let live_markers = [];

  localStorage.clear();
  window.scrollTo({
    top: 0,
  });

  const filtersList = document.getElementById("filtersList");

  async function handleMap() {
    const liveMap = document.getElementById("google-map");
    const mapOrg = document.getElementById("map-organizer");
    var map = window.map;
    mapOrg.appendChild(liveMap);

    liveMap.classList.add("map");
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    //map options
    let options = {
      Chicago: { lat: 41.8781, lng: -87.6298 },
      Miami: { lat: 25.7617, lng: -80.1918 },
      Tampa: { lat: 27.9517, lng: -82.4588 },
      "North Pole": { lat: 64.7552, lng: -147.3534 },
      "New York": { lat: 40.712775, lng: -74.005973 },
      Barcelona: { lat: 41.387397, lng: 2.168568 },
    };

    //autocomplete
    new window.google.maps.places.Autocomplete(
      document.getElementById("autocomplete")
    );
    const input = document.getElementById("autocomplete");

    let userLat;
    let userLng;
    let userCoords = [];
    let allmarkers = [];
    var placeDetails = document.getElementById("placeDetails");
    const placeInfo = document.getElementById("placeInfo");
    const gallery = document.getElementById("gallery");

    let lastMarkerClicked = "";

    function createMarker(props) {
      var marker = new window.google.maps.Marker({
        map: map,
        position: props.coords,
        coords: {
          lat: props.coords.lat,
          lng: props.coords.lng,
        },
        name: props.name,
        content: props.content,
        category: props.category,
        type: props.type,
        price: props.price,
        rating: props.rating,
        area: props.area,
        active: props.active,
        placeID: props.placeID,
        icon: {
          scaledSize: new window.google.maps.Size(28, 26),
          fillColor: "#702690",
          fillOpacity: 1,
          strokeWeight: 1,
        },
        Inexpensive: props.Inexpensive,
        Best: props.Best,
        favorite: props.favorite,
        popular: props.popular,
        sponsored: props.sponsored,
        animation: window.google.maps.Animation.DROP,
        city: props.city,
      });

      allmarkers.push(marker);

      for (let i = 0; i < allmarkers.length; i++) {
        allmarkers[i].setMap(map);
      }

      if (props.content) {
        var infoWindow = new window.google.maps.InfoWindow({});
      }

      marker.addListener("click", (e) => {
        lastMarkerClicked = marker.name;
        //Place info is requested only for the specific marker the user clicks on
        googleAPICalls(
          marker.getPosition().lat(),
          marker.getPosition().lng(),
          marker.placeID,
          marker.category,
          marker.area,
          marker.price,
          marker.type,
          marker.name
        );

        placeDetails.style.opacity = 1;

        //Opens and sets an info window
        infoWindow.open(map, marker);
        infoWindow.setContent(
          "<div class='infowindow-div'><strong>" +
            "Currently viewing" +
            "<hr/>" +
            marker.name +
            "</strong><br>" +
            marker.area +
            "</div>"
        );
        infoWindow.open(map, this);
      });
    }

    //Makes calls to the API to get place information
    function googleAPICalls(lat, lng, id, category, area, price, type, name) {
      geocoder.geocode(
        { location: { lat: lat, lng: lng } },
        function (results, status) {
          if (status === window.google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              destination.value = results[1].formatted_address;
              const request = {
                placeId: id,
                fields: [
                  "name",
                  "formatted_address",
                  "opening_hours",
                  "price_level",
                  "user_ratings_total",
                  "formatted_phone_number",
                  "website",
                  "reviews",
                  "rating",
                ],
              };

              const star = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><style>svg{fill:#ffde0a}</style><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`;
              const halfStar = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><style>svg{fill:#ffde0a}</style><path d="M288 0c-12.2 .1-23.3 7-28.6 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3L288 439.8V0zM429.9 512c1.1 .1 2.1 .1 3.2 0h-3.2z"/></svg>`;
              const thumbsDown = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><style>svg{fill:#f00000}</style><path d="M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2H464c26.5 0 48-21.5 48-48c0-18.5-10.5-34.6-25.9-42.6C497 236.6 504 223.1 504 208c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48H294.5c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7V192v48 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 384H96c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H32C14.3 96 0 110.3 0 128V352c0 17.7 14.3 32 32 32z"/></svg>`;
              var service = new window.google.maps.places.PlacesService(map);

              service.getDetails(request, function (place, status) {
                if (
                  status === window.google.maps.places.PlacesServiceStatus.OK
                ) {
                  //Renders visual star ratings
                  var starRating;
                  if (place.rating >= 4.7 && place.rating <= 5) {
                    //5 stars
                    starRating = star.repeat(5);
                  } else if (place.rating >= 3.8 && place.rating <= 4.2) {
                    //4 stars
                    starRating = star.repeat(4);
                  } else if (place.rating <= 4.7 && place.rating >= 4.3) {
                    //4.5 stars
                    starRating = `${star.repeat(4)}${halfStar}`;
                  } else if (place.rating >= 3.3 && place.rating <= 3.7) {
                    //3.5 stars
                    starRating = `${star.repeat(3)}${halfStar}`;
                  } else if (place.rating >= 2.8 && place.rating <= 3.2) {
                    //3 stars
                    starRating = star.repeat(3);
                  } else if (place.rating >= 2.3 && place.rating <= 2.7) {
                    //2.5 stars
                    starRating = `${star.repeat(2)}${halfStar}`;
                  } else if (place.rating >= 1.8 && place.rating <= 2.2) {
                    //2 stars
                    starRating = star.repeat(2);
                  } else if (place.rating >= 1.3 && place.rating <= 1.7) {
                    //1.5 stars
                    starRating = star + halfStar;
                  } else if (place.rating >= 0.8 && place.rating <= 1.2) {
                    //1 star
                    starRating = star;
                  } else if (place.rating >= 0.3 && place.rating <= 0.7) {
                    //0.5 stars
                    starRating = halfStar;
                  } else if (place.rating < 0.3) {
                    //No stars
                    starRating = thumbsDown;
                  } else {
                    starRating = ``;
                  }

                  //Renders visual price levels
                  var priceLevel;
                  const dollar = "$";
                  if (place.price_level !== undefined) {
                    priceLevel = dollar.repeat(place.price_level);
                  } else {
                    priceLevel = `<i style='color:red';>No pricing info</i>`;
                  }

                  function reviewReset() {
                    gallery.style.filter = "grayscale(0)";
                    gallery.style.filter = "blur(0)";
                  }

                  //Used in the infocard for place hours and open times, starting with the current day
                  let todaysHours;
                  var days = [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ];
                  var now = new Date();
                  var day = days[now.getDay()];

                  if (place.opening_hours) {
                    const placeHours = place.opening_hours.weekday_text;

                    for (let i = 0; i < placeHours.length; i++) {
                      if (placeHours[i].includes(day)) {
                        todaysHours = placeHours[i] + chevron;
                      }
                    }
                  } else {
                    todaysHours = `<p style='color:red;pointer-events:none;'>Currently Closed</p>`;
                  }
                  //Code above is used in the infocard for place hours and open times, starting with the current day

                  //Populates the infocard with place information
                  function placeInfoHome() {
                    reviewReset();

                    placeInfo.innerHTML =
                      '<div id="infoCard"><strong><h1>' +
                      place.name +
                      `   ` +
                      starRating +
                      "</h1></strong>" +
                      `  ` +
                      `<h4>` +
                      `${place.rating}/5` +
                      " · " +
                      priceLevel +
                      " · " +
                      category +
                      `</h4>` +
                      `<p>${place.formatted_address}</p>` +
                      `<p id='placePhone'>${place.formatted_phone_number}</p>` +
                      `<div id="dropdown3">` +
                      `<p class="todays-hours"><strong>${todaysHours}</strong></p>` +
                      `</div>` +
                      `<br>` +
                      `<div id="APPEND_HERE">
                  <button id="place-button" class='infocard-btn' role='button' target="_blank">Learn More</button>
                  <button id="add-button" name='${place.name}' class='infocard-btn trip-adder' role='button' target="_blank">Add to Trip</button>
                  <a class="place-imgs-link" href="https://www.google.com/search?q=${place.name}&sca_esv=03047b03c4b9cd9d&sca_upv=1&sxsrf=ADLYWILgzRTFudLq4zqNYw8eEFajutqqOA:1717445774174&source=hp&biw=1536&bih=730&ei=jiReZsKECOLfp84Pt5OM2Q4&iflsig=AL9hbdgAAAAAZl4yntxQz9UCBdnIlSkmNMW5d3qcFKh-&ved=0ahUKEwjCg6eKoMCGAxXi78kDHbcJI-sQ4dUDCA8&uact=5&oq=tatam&gs_lp=EgNpbWciBXRhdGFtMggQABiABBixAzIIEAAYgAQYsQMyCBAAGIAEGLEDMggQABiABBixAzIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABEjED1DuA1jKDXABeACQAQCYAVGgAYIDqgEBNbgBA8gBAPgBAYoCC2d3cy13aXotaW1nmAIGoAKfA6gCCsICBxAjGCcY6gLCAgQQIxgnwgILEAAYgAQYsQMYgwGYAweSBwE2oAeKGw&sclient=img&udm=2" target="_blank">See Images</a>
                  <div>` +
                      `<br>` +
                      `<br>` +
                      "</div>";

                    document
                      .getElementById("add-button")
                      .addEventListener("click", (e) => {
                        handleTripAdderPopup(e);
                      });

                    //Takes the user to a seperate page where they can learn more about the place
                    document
                      .getElementById("place-button")
                      .addEventListener("click", (e) => {
                        learnMoreAboutPlace(
                          place.name,
                          place.rating,
                          type,
                          area,
                          price,
                          place.name,
                          place.favorite,
                          category,
                          id,
                          e.target
                        );
                      });

                    //Hides the add  to trip button if the place is closed
                    if (
                      todaysHours ===
                      `<p style='color:red;pointer-events:none;'>Currently Closed</p>`
                    ) {
                      document.getElementById("add-button").style.display =
                        "none";
                    }

                    if (
                      document.getElementById("placePhone").innerText ===
                      "undefined"
                    ) {
                      document.getElementById("placePhone").textContent =
                        "Sorry! Phone number not listed...";
                    }

                    //This block of code handles displaying opening hours for the entire week
                    const dd = document.getElementById("dropdown3");

                    dd.addEventListener("click", () => {
                      if (dd.childNodes.length < 2) {
                        dd.innerHTML = "";
                        for (let i = 0; i <= 6; i++) {
                          const child = document.createElement("p");
                          child.innerHTML = `${place.opening_hours.weekday_text[i]}`;
                          child.style.fontFamily = `"Roboto Condensed", sans-serif`;
                          dd.appendChild(child);
                          i == now.getDay() - 1
                            ? (child.style.fontWeight = 800)
                            : (child.style.fontWeight = 300);
                        }
                      } else {
                        dd.innerHTML = `<p class="todays-hours"><strong>${todaysHours}</strong></p>`;
                      }
                    });
                    //The above block of code handles displaying opening hours
                  }
                  placeInfoHome();

                  if (!inputText.value) {
                    placeInfoHome();
                  } else {
                    placeDetails.style.display = "none";
                  }
                }
              });
            }
          }
        }
      );
      placeDetails.style.display = "flex";
      const exitBtn = document.getElementById("backBtn");

      exitBtn.addEventListener("click", function () {
        placeDetails.style.opacity = 0;
        setTimeout(() => {
          placeDetails.style.display = "none";
        }, 400);
      });
    }

    let geocoder = new window.google.maps.Geocoder();
    const submitButton = document.getElementById("submit");
    const inputText = document.getElementById("autocomplete");

    let userLocation = new window.google.maps.Marker({
      map,
      icon: {
        scaledSize: new window.google.maps.Size(8, 6),
      },
      animation: window.google.maps.Animation.DROP,
    });

    function geocode(request) {
      const userPlaceID = new window.google.maps.places.Autocomplete(input, {
        fields: ["place_id"],
      });

      userPlaceID.getPlace();

      geocoder.geocode(request).then((result) => {
        const { results } = result;
        map.setCenter(results[0].geometry.location);
        userLocation.setIcon(`/home-marker.svg`);
        userLocation.setPosition(results[0].geometry.location);
        userLocation.setMap(map);
        userLat = userLocation.getPosition().lat();
        userLng = userLocation.getPosition().lng();
        userCoords.push({ location: { lat: userLat, lng: userLng } });
        return results;
      });
    }

    const destination = document.getElementById("destination");

    submitButton.addEventListener("click", function () {
      geocode({ address: inputText.value });
    });

    //Directions render object that we'll use to display route
    //Bind the route to the map

    var routeButton = document.getElementById("routeButton");
    var userDestination = document.getElementById("userDestination");
    userDestination.appendChild(routeButton);
    var distance = new window.google.maps.DistanceMatrixService();

    const DD = document.getElementById("durationANDdistance");

    let modeofTransport = "DRIVING";
    const transBtns = document.getElementById("trans-btns");
    transBtns.addEventListener("click", (e) => {
      modeofTransport = e.target.value;
      for (let i = 0; i < transBtns.children.length; i++) {
        transBtns.childNodes[i].style.backgroundColor = "gray";
      }
      e.target.style.backgroundColor = "white";
      e.target.style.color = "gray";
    });
    function calcRoute(mode) {
      directionsService.route(
        {
          origin: `${inputText.value}`,
          destination: `${destination.value}`,
          travelMode: `${mode}`,
          unitSystem: window.google.maps.UnitSystem.IMPERIAL,
          avoidHighways: false,
        },
        (response, status) => {}
      );

      var request = {
        origin: `${inputText.value}`,
        destination: `${destination.value}`,
        travelMode: `${mode}`,
        unitSystem: window.google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
      };
      directionsService.route(request, function (result, status) {
        if (status == "OK") {
          directionsRenderer.setDirections(result);
        }
      });
    }

    routeButton.addEventListener("click", function () {
      directionsRenderer.setMap(map);

      calcRoute(modeofTransport);
      distance.getDistanceMatrix(
        {
          origins: [`${inputText.value}`],
          destinations: [`${destination.value}`],
          travelMode: modeofTransport,
          unitSystem: window.google.maps.UnitSystem.IMPERIAL,
          avoidHighways: false,
          avoidTolls: false,
          drivingOptions: {
            departureTime: new Date(Date.now() + 1), // for the time N milliseconds from now.
            trafficModel: "optimistic",
          },
        },
        (DistanceMatrixResponse, DistanceMatrixStatus) => {
          if (DistanceMatrixStatus === "OK") {
            DD.style.display = "flex";
            DD.style.opacity = 1;
            DD.innerHTML =
              `<div class="travelResults"><h2 class="travelDetails">Distance: ${DistanceMatrixResponse.rows[0].elements[0].distance.text}</h2> <h2>Time: ${DistanceMatrixResponse.rows[0].elements[0].duration.text}
            </h2></div>` +
              `<div class='afterRoute-Btns'><button name='${lastMarkerClicked}' class="addafterRoute trip-adder">Add to Trip <svg xmlns="http://www.w3.org/2000/svg" height="0.6em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg></button>
              <button class="route-cancel">Cancel</button></div>`;
            DD.addEventListener("click", (e) => {
              if (e.target.classList.contains("route-cancel")) {
                DD.style.display = "none";
              }
              if (e.target.classList.contains("trip-adder")) {
                handleTripAdderPopup(e);
              }
            });
          }
        }
      );
    });

    map.addListener("click", () => {
      DD.style.display = "none";
      directionsRenderer.setMap(null);
      inputText.value = "";
      destination.value = "";
      placeDetails.style.display = "none";
      userLocation.setMap(null);
    });

    function render_Markers() {
      for (let i = 0; i < allPlaces.length; i++) {
        createMarker(allPlaces[i]);
      }
    }
    render_Markers();

    const filterName = [];
    const Buttons = document.getElementsByClassName("b");
    const filterText = function () {
      for (let i = 0; i < Buttons.length; i++) {
        filterName.push(Buttons[i].textContent);
      }
      return filterText;
    };

    //arrays used for map filtering logic
    let remove = [];
    let dropdown_filters = [];
    let sorting_filters = [];
    let category_filters = [];
    let area_filters = [];
    let candidates = [];
    let parentEls = [];

    const showFiltersList_btn = document.getElementById("show-filtersList");

    showFiltersList_btn.addEventListener("click", () => {
      filtersList.style.display = "flex";
      filtersList.style.right = "0rem";
    });

    const cancelFiltersList_btn = document.getElementById("filters-cancel");
    cancelFiltersList_btn.addEventListener("click", () => {
      filtersList.style.right = "-14rem"
    });

    const showMenu_btn = document.getElementById("show-menu");
    const mapOverlay = document.getElementById("map-overlay");
    const mapContainer = document.getElementById("map");
    const recsContainer = document.getElementById(
      "top-reccomendations-container"
    );

    showMenu_btn.addEventListener("click", () => {
      mapOverlay.style.display = "block";
      mapOverlay.style.paddingRight = "1rem";
      mapOverlay.style.paddingLeft = "1rem";
      mapContainer.style.width = "100vw";
      mapContainer.style.top = null;
      showMenu_btn.style.display = "none";
    });

    const cityDD = document.getElementById("cityDD");
    const bestPlacesText = document.getElementById("best-places-text");
    cityDD.addEventListener("click", (e) => {
      map.panTo(options[e.target.textContent]);
      sessionStorage.setItem("city", e.target.textContent);
      bestPlacesText.innerHTML = `Best Places in ${e.target.textContent}`;
      allPlaces_inCity = allmarkers.filter(
        (m) => m.city === sessionStorage.getItem("city")
      );
      renderSponsoredPlaces();
    });

    const recItem = document.getElementsByClassName("rec-container-item");
    //Loops through every card in the top picks section

    function recItemEvents() {
      for (let i = 0; i < recItem.length; i++) {
        recItem[i].addEventListener("click", (e) => {
          //Ensures the user is not clicking on the heart, if so the infocard pops up
          if (
            !e.target.classList.contains("click-favorite") &&
            !e.target.classList.contains("trip-adder")
          ) {
            const lat = parseFloat(
              recItem[i].parentNode.getAttribute("data-lat")
            );
            const lng = parseFloat(
              recItem[i].parentNode.getAttribute("data-lng")
            );
            const place = recItem[i].parentNode.getAttribute("data-place");
            const category = recItem[i].parentNode.getAttribute("category");
            const area = recItem[i].parentNode.getAttribute("area");
            const price = recItem[i].parentNode.getAttribute("price");
            const type = recItem[i].parentNode.getAttribute("type");
            const placeName =
              recItem[i].parentNode.firstElementChild.getAttribute("name");
            gallery.setAttribute("name", placeName);

            //Calls the googleAPICalls function to populate the infocard with place info from the google places API
            googleAPICalls(
              lat,
              lng,
              place,
              category,
              area,
              price,
              type,
              placeName
            );
            placeDetails.style.opacity = 1;
          }
        });

        const hoveredMarker = (array) =>
          array.filter((m) => m.name !== recItem[i].getAttribute("name"));
        recItem[i].addEventListener("mouseover", (e) => {
          if (live_markers.length === 0) {
            hoveredMarker(allmarkers).map((m) => m.setOpacity(0.3));
          } else if (live_markers.length > 0) {
            hoveredMarker(live_markers).map((m) => m.setOpacity(0.3));
          }
        });

        recItem[i].addEventListener("mouseleave", (e) => {
          if (live_markers.length === 0) {
            hoveredMarker(allmarkers).map((m) => m.setOpacity(1));
          } else if (live_markers.length > 0) {
            hoveredMarker(live_markers).map((m) => m.setOpacity(1));
          }
        });
      }
    }

    //SVGS used in top picks container
    let starPrinter = `<svg xmlns="http://www.w3.org/2000/svg" height="0.8em" viewBox="0 0 576 512"><style>svg{fill:#1653ff}</style><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`;
    let popularSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="0.8em" viewBox="0 0 448 512"><style>svg{fill:#29dba0}</style><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`;
    let dollarSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="0.8em" viewBox="0 0 320 512"><style>svg{fill:#3dd678}</style><path d="M160 0c17.7 0 32 14.3 32 32V67.7c1.6 .2 3.1 .4 4.7 .7c.4 .1 .7 .1 1.1 .2l48 8.8c17.4 3.2 28.9 19.9 25.7 37.2s-19.9 28.9-37.2 25.7l-47.5-8.7c-31.3-4.6-58.9-1.5-78.3 6.2s-27.2 18.3-29 28.1c-2 10.7-.5 16.7 1.2 20.4c1.8 3.9 5.5 8.3 12.8 13.2c16.3 10.7 41.3 17.7 73.7 26.3l2.9 .8c28.6 7.6 63.6 16.8 89.6 33.8c14.2 9.3 27.6 21.9 35.9 39.5c8.5 17.9 10.3 37.9 6.4 59.2c-6.9 38-33.1 63.4-65.6 76.7c-13.7 5.6-28.6 9.2-44.4 11V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.1c-.4-.1-.9-.1-1.3-.2l-.2 0 0 0c-24.4-3.8-64.5-14.3-91.5-26.3c-16.1-7.2-23.4-26.1-16.2-42.2s26.1-23.4 42.2-16.2c20.9 9.3 55.3 18.5 75.2 21.6c31.9 4.7 58.2 2 76-5.3c16.9-6.9 24.6-16.9 26.8-28.9c1.9-10.6 .4-16.7-1.3-20.4c-1.9-4-5.6-8.4-13-13.3c-16.4-10.7-41.5-17.7-74-26.3l-2.8-.7 0 0C119.4 279.3 84.4 270 58.4 253c-14.2-9.3-27.5-22-35.8-39.6c-8.4-17.9-10.1-37.9-6.1-59.2C23.7 116 52.3 91.2 84.8 78.3c13.3-5.3 27.9-8.9 43.2-11V32c0-17.7 14.3-32 32-32z"/></svg>`;
    let chevron = `<svg xmlns="http://www.w3.org/2000/svg" height="0.8em" viewBox="0 0 320 512"><style>svg{fill:white}</style><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`;
    let heart = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"/></svg>`;
    //Renders top picks dynamically
    function renderTopPicks(array) {
      array = array.filter(
        (marker) => marker.city === sessionStorage.getItem("city")
      );
      recsContainer.innerHTML = "";
      for (let i = 0; i < array.length; i++) {
        const marker = array[i];
        const num = Math.round(marker.rating);
        const popularStr =
          marker.popular === true ? `${popularSvg} Popular` : "";
        const cheapStr =
          marker.Inexpensive === "Inexpensive" ? `${dollarSvg} Cheap` : "";

        if (recsContainer.childNodes.length < array.length) {
          const newRec = document.createElement("div");
          newRec.innerHTML =
            `<div class="rec-container-item" name='${
              marker.name
            }'>
            <div class="item-info"><h4>${[i + 1]}. ${
              marker.name
            }</h4>` +
            `<div class="middle-org"><p class='yellowstar'>${starPrinter.repeat(
              num
            )}  <strong>${
              marker.rating
            }</strong></p><div class="area-info-price"><p>${
              marker.area
            }</p><p class="pricinginfo">${dollarSvg.repeat(
              marker.price
            )}</p></div><h5 class="open-closed"></h5><p class="item-quick-info">${popularStr}    ${cheapStr}</p></div>
            <div id='rec-item-lower'>
            <button id='trip-adder' name="${
              marker.name
            }" class='trip-adder'>Add to Trip</button>
            <p id="results-heart" name="${
              marker.name
            }" class='click-favorite top-picks-favorite'>${heart}</p><div class="animatedbar">
            <p class="instruction-toppick">Click to learn more</p>
            </div>
            </div>
            </div>`;

          if (i === array.length - 1) {
            newRec.style.paddingBottom = "2.5rem";
          }

          //This will be used for the googleAPICalls function
          newRec.setAttribute("data-lat", marker.coords.lat);
          newRec.setAttribute("data-lng", marker.coords.lng);
          newRec.setAttribute("data-place", marker.placeID);
          newRec.setAttribute("category", marker.category);
          newRec.setAttribute("area", marker.area);
          newRec.setAttribute("price", marker.price);
          newRec.setAttribute("type", marker.type);
          newRec.setAttribute("id", marker.placeID);

          recsContainer.appendChild(newRec);
          const openClosed = document.getElementsByClassName("open-closed");

          handleOpenOrClosed(
            marker.coords.lat,
            marker.coords.lng,
            marker.placeID,
            openClosed[i]
          );
        }
      }
      recItemEvents();
      setTimeout(() => {
        document.getElementById("simulateClick-btn").click();
      }, 500);
    }

    let currentCity = sessionStorage.getItem("city");
    //Array containing all places in the current city
    let allPlaces_inCity = allmarkers.filter((m) => m.city === currentCity);
    //Function sets the current city, used at various points

    function renderSponsoredPlaces() {
      if (live_markers.length === 0) {
        const sponsoredPlaces = allPlaces_inCity.filter(
          (marker) => marker.sponsored === true
        );
        renderTopPicks(sponsoredPlaces);
      } else {
        renderTopPicks(live_markers);
      }
    }

    renderSponsoredPlaces();

    function handleOpenOrClosed(lat, lng, place, collection) {
      geocoder.geocode(
        {
          location: { lat: lat, lng: lng },
        },
        function (results, status) {
          if (status === window.google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              const request = {
                placeId: place,
                fields: ["name", "opening_hours"],
              };

              var service = new window.google.maps.places.PlacesService(map);

              service.getDetails(request, function (place, status) {
                if (
                  status === window.google.maps.places.PlacesServiceStatus.OK
                ) {
                  if (place.opening_hours === undefined) {
                    collection.innerHTML = `<strong>Permanently Closed</strong>`;
                    collection.style.color = "red";
                    return;
                  }

                  const placeHours = place.opening_hours.weekday_text;

                  var days = [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ];
                  var now = new Date();
                  var day = days[now.getDay()];

                  var time = now.getHours();
                  var minutes = now.getMinutes();
                  let ampm;
                  let closingAMPM;

                  //placeHours.map((data) => data.startsWith(day) && data.includes('Closed') ? collection.innerHTML = `<strong style='color:red'>Closed today</strong>` : null)

                  for (let i = 0; i < placeHours.length; i++) {
                    let nextOpeningDay;

                    if (placeHours[i].includes("Open 24 hours")) {
                      collection.innerHTML = `<span><strong>Open 24 Hours</strong></span>`;
                      return;
                    }

                    if (
                      placeHours[i].startsWith(day) &&
                      placeHours[i].includes("Closed")
                    ) {
                      findNextOpeningDay();
                      collection.innerHTML = `<strong style='color:red'>Closed</strong> <span>until ${String(
                        placeHours[nextOpeningDay]
                      ).slice(0, 3)}</span>`;
                      return;
                    }

                    const splitDayandTime = placeHours[i].split(":");

                    let placeHour = splitDayandTime[1];
                    let placeMins;
                    let placeClosingHour;
                    let placeClosingMin;

                    if (!placeHours[i].includes("Closed")) {
                      placeClosingHour = splitDayandTime[2]
                        .split("– ")[0]
                        .split("– ")[1];
                      placeClosingMin = String(splitDayandTime[3]).slice(0, 2);
                    }

                    function standardTime() {
                      if (parseInt(placeHour) > 12) {
                        placeHour = parseInt(placeHour) - 12;
                      }

                      if (parseInt(placeClosingHour) > 12) {
                        placeClosingHour = parseInt(placeClosingHour) - 12;
                      }
                    }

                    if (splitDayandTime[2] && splitDayandTime[3]) {
                      placeMins = String(splitDayandTime[2]).slice(0, 2);
                      if (splitDayandTime[2].includes("AM")) {
                        ampm = "AM";
                      } else {
                        ampm = "PM";
                        placeHour = parseInt(splitDayandTime[1]) + 12;
                      }
                      if (splitDayandTime[3].includes("AM")) {
                        closingAMPM = "AM";
                      } else {
                        closingAMPM = "PM";
                      }
                    }
                    //Find the next opening day (used for places that are past their opening times)
                    function findNextOpeningDay() {
                      const values = [];

                      for (let inc = 0; inc < placeHours.length; inc++) {
                        if (
                          !placeHours[inc].includes("Closed") &&
                          placeHours.indexOf(placeHours[inc]) !==
                            placeHours.indexOf(placeHours[i])
                        ) {
                          let indexDifferance =
                            placeHours.indexOf(placeHours[inc]) -
                            placeHours.indexOf(placeHours[i]);
                          if (Math.sign(indexDifferance) === -1) {
                            values.push(indexDifferance * -1);
                          } else {
                            values.push(indexDifferance);
                          }
                        }
                      }
                      nextOpeningDay = Math.min(...values);
                    }

                    if (placeHours[i].startsWith(day)) {
                      findNextOpeningDay();
                      if (
                        !placeHours[i].includes("Closed") &&
                        time < placeHour &&
                        minutes < parseInt(placeMins)
                      ) {
                        standardTime();
                        collection.innerHTML = `<strong>Closed</strong> <span style="color:black;">until ${placeHour}:${placeMins} ${ampm}</span>`;
                        collection.style.color = "red";
                      } else if (
                        !placeHours[i].includes("Closed") &&
                        time >= placeHour &&
                        minutes < parseInt(placeMins)
                      ) {
                        standardTime();
                        collection.innerHTML = `<strong>Open</strong> <span style="color:black;">until ${placeClosingHour}:${placeClosingMin} ${closingAMPM}</span>`;
                        collection.style.color = "green";
                      } else if (
                        !placeHours[i].includes("Closed") &&
                        time < placeHour &&
                        minutes >= parseInt(placeMins)
                      ) {
                        standardTime();
                        collection.innerHTML = `<strong>Closed</strong> <span style="color:black;">until ${placeHour}:${placeMins} ${ampm}</span>`;
                        collection.style.color = "red";
                      } else if (place.opening_hours.isOpen()) {
                        standardTime();
                        collection.innerHTML = `<strong>Open</strong> <span style="color:black;">until ${placeClosingHour}:${placeClosingMin} ${closingAMPM}</span>`;
                        collection.style.color = "green";
                      } else if (
                        !place.opening_hours.isOpen() &&
                        time >= placeHour &&
                        minutes >= parseInt(placeMins)
                      ) {
                        collection.innerHTML = `<strong style='color:red'>Closed Now</strong>`;
                      }
                    }
                  }
                }
              });
            }
          }
        }
      );
    }

    const favoriteBtn = document.getElementsByClassName("click-favorite");
    setTimeout(() => {
      for (let i = 0; i < favoriteBtn.length; i++) {
        if (favoriteBtn[i].firstElementChild.style.fill === "red") {
          allmarkers.map((place) =>
            place.name == favoriteBtn[i].getAttribute("name")
              ? (place.favorite = "favorite")
              : null
          );
        }
      }
    }, 2500);

    function filter_Markers(e, target) {
      e.classList.toggle("mapFilterOn");
      const classOn = e.classList.contains("mapFilterOn");

      if (e.type === "checkbox" && classOn) {
        if (!dropdown_filters.includes(target.value)) {
          dropdown_filters.push(target.value);
        }
      } else if (!classOn && e.type === "checkbox") {
        dropdown_filters.splice(dropdown_filters.indexOf(target.value), 1);
      }

      //Filtering logic
      //When a checkbox is clicked markers run through this first check
      const firstCheck = (array, value) => {
        //If there are 2 different categories of checkboxes active, check if the marker meets both conditions
        if (area_filters.length > 0 && category_filters.length > 0) {
          candidates = [];
          allmarkers.map((marker) =>
            category_filters.includes(marker.type) &&
            area_filters.includes(marker.area) &&
            !candidates.includes(marker)
              ? //Pushes markers into the candidaties array which could be used for the final check
                candidates.push(marker)
              : null
          );
          live_markers = [];
          candidates.map((m) => live_markers.push(m));
        } else {
          if (target.checked === true && category_filters.includes(value)) {
            allmarkers.map((marker) =>
              array.map((arr) =>
                arr == marker.type && !live_markers.includes(marker)
                  ? live_markers.push(marker)
                  : null
              )
            );
          }
          if (
            target.checked === true &&
            sorting_filters.includes(target.value)
          ) {
            array.map((arr) =>
              arr[value] == value && !live_markers.includes(arr)
                ? live_markers.push(arr)
                : null
            );
          }
        }
      };

      const finalCheck = (array, value) => {
        const replacementArr = [];
        for (let i = 0; i < array.length; i++) {
          if (array[i].type === value) {
            replacementArr.push(array[i]);
          }
          if (array[i][value] === value) {
            replacementArr.push(array[i]);
          }

          if (category_filters.includes(value) && category_filters.length > 1) {
            sorting_filters.map((f) =>
              array[i][f] === f && array[i].type === value
                ? live_markers.push(array[i])
                : null
            );
          }
          if (array === live_markers) {
            live_markers = replacementArr;
          }
        }
      };

      const handleUnchecked = (value) => {
        const first = [];
        const replacementArr = [];
        if (dropdown_filters.length === 0) {
          live_markers = [];
        } else {
          if (
            category_filters.length === 1 &&
            sorting_filters.length > 0 &&
            category_filters.includes(value)
          ) {
            for (let i = 0; i < allmarkers.length; i++) {
              sorting_filters.map((f) =>
                allmarkers[i][f] === f
                  ? replacementArr.push(allmarkers[i])
                  : null
              );
            }

            live_markers = replacementArr;
          } else if (
            category_filters.includes(value) &&
            category_filters.length > 1 &&
            sorting_filters.length > 0
          ) {
            live_markers.map((m) =>
              m.type !== value ? replacementArr.push(m) : null
            );

            live_markers = replacementArr;
          } else if (
            category_filters.includes(value) &&
            sorting_filters.length > 0 &&
            category_filters.length > 0
          ) {
            live_markers.map((m) =>
              m.type === value ? replacementArr.push(m) : null
            );
            live_markers = replacementArr;
          } else if (
            category_filters.length === 0 &&
            sorting_filters.length > 0 &&
            category_filters.includes(value)
          ) {
            for (let i = 0; i < allmarkers.length; i++) {
              sorting_filters.map((f) =>
                allmarkers[i][f] === f
                  ? replacementArr.push(allmarkers[i])
                  : null
              );
              live_markers = replacementArr;
            }
          } else if (
            category_filters.includes(value) &&
            sorting_filters.length > 0
          ) {
            live_markers.map((m) => replacementArr.push(m));
            for (let i = 0; i < allmarkers.length; i++) {
              sorting_filters.map((f) =>
                allmarkers[i][f] === f && allmarkers[i].type !== value
                  ? replacementArr.push(allmarkers[i])
                  : null
              );
            }
            live_markers = replacementArr;
          } else if (
            sorting_filters.includes(value) &&
            category_filters.length > 0
          ) {
            for (let i = 0; i < allmarkers.length; i++) {
              if (allmarkers[i][value] == false) {
                first.push(allmarkers[i]);
              }
            }
            first.map((m) =>
              category_filters.includes(m.type) ? replacementArr.push(m) : null
            );
            replacementArr.map((m) => live_markers.push(m));
          } else if (
            category_filters.includes(value) &&
            sorting_filters.length === 0
          ) {
            live_markers.map((m) =>
              m.type !== value ? replacementArr.push(m) : null
            );
            live_markers = replacementArr;
          }
        }
      };

      //Runs when the user clicks on a checkbox in categories
      if (
        //Runs when both filter types are used
        target.checked === true &&
        target.closest("#dropdown2") &&
        sorting_filters.length > 0 &&
        category_filters.length > 0
      ) {
        parentEls.push(target.closest("#dropdown2"));
        category_filters.push(target.value);
        finalCheck(allmarkers, target.value);
      } else if (
        //Runs when there are sorting filters present
        target.checked === true &&
        target.closest("#dropdown2") &&
        sorting_filters.length > 0
      ) {
        parentEls.push(target.closest("#dropdown2"));
        category_filters.push(target.value);
        finalCheck(live_markers, target.value);
      } else if (target.checked === true && target.closest("#dropdown2")) {
        //Runs when category filter is clicked && box is checked
        parentEls.push(target.closest("#dropdown2"));
        category_filters.push(target.value);

        firstCheck(category_filters, target.value);
      } else if (target.checked === false && target.closest("#dropdown2")) {
        //Runs when category filter is unchecked
        parentEls.splice(parentEls.indexOf(target.closest("#dropdown2")), 1);
        handleUnchecked(target.value);
        category_filters.splice(category_filters.indexOf(target.value), 1);

        //firstCheck(category_filters);
      }

      //Runs when the user clicks on a checkbox in sorting
      if (target.checked === true && target.closest("#sort-by")) {
        parentEls.push(target.closest("#sort-by"));
        sorting_filters.push(target.value);
        category_filters.length > 0 || sorting_filters.length > 1
          ? finalCheck(live_markers, target.value)
          : firstCheck(allmarkers, target.value);
      } else if (target.checked === false && target.closest("#sort-by")) {
        handleUnchecked(target.value);
        parentEls.splice(parentEls.indexOf(target.closest("#sort-by")), 1);
        sorting_filters.splice(sorting_filters.indexOf(target.value), 1);

        // candidates.length > 0
        //   ? finalCheck(candidates, target.value)
        //   : finalCheck(live_markers, target.value);
      }

      if (live_markers.length === 0) {
        for (let i = 0; i < allmarkers.length; i++) {
          allmarkers[i].setMap(map);
        }
        renderSponsoredPlaces();
        return;
      }

      for (let i = 0; i < live_markers.length; i++) {
        const marker = live_markers[i];
        remove = allmarkers.filter((marker) => !live_markers.includes(marker));
        marker.setMap(map);
      }

      for (let i = 0; i < remove.length; i++) {
        remove[i].setMap(null);
      }

      renderSponsoredPlaces();
    }

    const checkbox = document.getElementsByClassName("checkbox");
    for (let i = 0; i < checkbox.length; i++) {
      checkbox[i].addEventListener("change", (e) => {
        filter_Markers(e.target, e.target);

        const filtersChosen = document.getElementById("filters-disclosed");
        filtersChosen.innerHTML = `<p><em>${dropdown_filters.join(
          " > "
        )}<em></p>`;
      });
    }
  }
  handleMap();
}
