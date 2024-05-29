import {allPlaces} from "./allMarkers.mjs";
//Used to redirect the user and display information when they click on a specific place
export function learnMoreAboutPlace(
  text,
  rating,
  type,
  area,
  price,
  image,
  favorite,
  category,
  id,
  e
) {
  if (
    typeof window !== "undefined" &&
    !e.classList.contains("click-favorite") &&
    !e.classList.contains("trip-adder")
  ) {
    const place = allPlaces.filter((place) => place.name === text);
    sessionStorage.setItem("city", place[0].city);
    localStorage.setItem("city", place[0].city);
    localStorage.setItem("current", text);
    localStorage.setItem("title", text);
    localStorage.setItem("rating", rating);
    localStorage.setItem("type", type);
    localStorage.setItem("area", area);
    localStorage.setItem("price", price);
    localStorage.setItem("image", `../../public/${image}.jpg`);
    localStorage.setItem("favorite", favorite);
    localStorage.setItem("ID", id);
    localStorage.setItem("category", category);
    placePageSuggestions();
  }
}

let arr2 = [];
export function placePageSuggestions() {
  let allPlaces_inCity = allPlaces.filter(
    (m) => m.city === sessionStorage.getItem("city")
  );
  const finalRender = [];

  if (typeof window !== "undefined") {
    allPlaces_inCity.map((marker) =>
      localStorage.getItem("title") === marker.name &&
      arr2.indexOf(marker.category) === -1
        ? arr2.push(marker.category)
        : null
    );
    allPlaces_inCity.map((marker) =>
      localStorage.getItem("title") === marker.name &&
      arr2.indexOf(marker.area) === -1
        ? arr2.push(marker.area)
        : null
    );
  }

  allPlaces_inCity.map((marker) =>
    finalRender.indexOf(marker.name) === -1 &&
    marker.rating >= 4 &&
    arr2.includes(marker.category) &&
    arr2.includes(marker.area)
      ? finalRender.push(marker)
      : null
  );
  allPlaces_inCity.map((marker) =>
    finalRender.indexOf(marker.name) === -1 &&
    marker.rating >= 4 &&
    arr2.includes(marker.category) &&
    !arr2.includes(marker.area)
      ? finalRender.push(marker)
      : null
  );
  allPlaces_inCity.map((marker) =>
    finalRender.indexOf(marker.name) === -1 &&
    marker.rating < 4 &&
    marker.rating >= 3 &&
    arr2.includes(marker.type)
      ? finalRender.push(marker)
      : null
  );

  finalRender.map((marker) =>
    marker.name === localStorage.getItem("title")
      ? finalRender.splice(finalRender.indexOf(marker), 1)
      : null
  );

  localStorage.setItem("suggestionAmount", finalRender.length);

  for (let i = 0; i < finalRender.length; i++) {
    let priceIcon;
    if (finalRender[i].price === 1) {
      priceIcon = "$";
    } else if (finalRender[i].price === 2) {
      priceIcon = "$$";
    } else if (finalRender[i].price === 3) {
      priceIcon = "$$$";
    } else if (finalRender[i].price === 4) {
      priceIcon = "$$$$";
    } else {
      priceIcon = "No Price Info";
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("suggestion" + [i] + "title", finalRender[i].name);
      localStorage.setItem(
        "suggestion" + [i] + "image",
        finalRender[i].name + ".jpg"
      );
      localStorage.setItem(
        "suggestion" + [i] + "rating",
        finalRender[i].rating
      );
      localStorage.setItem("suggestion" + [i] + "area", finalRender[i].area);
      localStorage.setItem("suggestion" + [i] + "price", priceIcon);
      localStorage.setItem(
        "suggestion" + [i] + "type",
        finalRender[i].category
      );
      localStorage.setItem(
        "suggestion" + [i] + "favorite",
        finalRender[i].favorite
      );
      localStorage.setItem(
        "suggestion" + [i] + "popular",
        finalRender[i].popular
      );
    }
  }

  arr2 = [];

  window.open("https://travelsmart2-0.onrender.com/place");
}

export function matchingKeyInputs(e, name, element) {
  const anchor = document.getElementsByClassName("place");
  for (let i = 0; i < anchor.length; i++) {
    const text = e.target.value;
    if (
      !anchor[i] ||
      !anchor[i].innerText.toLowerCase().includes(text.toLowerCase())
    ) {
      anchor[i].style.display = "none";

      if (anchor[i].style.display === "none") {
      }
    } else {
      anchor[i].style.display = "block";
    }
  }
  const s = document.getElementsByClassName(name);
  for (let i = 0; i < s.length; i++) {
    if (element.value === "") {
      s[i].style.display = "none";
    }
  }
}

export function handleFavoritesNotifications(array, target, svg) {
  //Handles notifications and coloring hearts, does not handle updating the database
  const notification = document.getElementById("favorite-notification");

  if (!array.includes(target.getAttribute("name"))) {
    notification.style.right = "-20rem";
    notification.innerHTML = `<strong>${target.getAttribute(
      "name"
    )}</strong> has been added to your favorites`;
    notification.style.display = "block";
    notification.style.opacity = 1;
    notification.style.width = "10rem";
    notification.style.right = "1rem";
    setTimeout(() => {
      notification.style.opacity = 0;
      notification.style.right = "-20rem";
      setTimeout(() => {
        notification.style.display = "none";
      }, 1000);
    }, 3000);
  } else if (array.includes(target.getAttribute("name"))) {
    notification.innerHTML = `<strong>${target.getAttribute(
      "name"
    )}</strong> has been removed from your favorites`;
    notification.style.display = "block";
    notification.style.width = "200px";
    notification.style.opacity = 1;
    notification.style.right = "1rem";
    setTimeout(() => {
      notification.style.opacity = 0;
      notification.style.right = "-20rem";
    }, 3000);
  }

  allPlaces.map((place) =>
    place.name === target.getAttribute("name")
      ? (place.favorite = "favorite")
      : null
  );

  svg.classList.toggle("favorite");

  for (let t of document.getElementsByClassName("click-favorite")) {
    if (
      t.getAttribute("name") === target.getAttribute("name") &&
      t !== target
    ) {
      t.firstElementChild.firstElementChild.classList.toggle("favorite");
    }
  }
}

export function handleTripAdderPopup(e) {
  const addToTrip = document.getElementById("adding-to-trip");
  const adding = document.getElementById("adding-place");
  if (e.target.classList.contains("trip-adder")) {
    addToTrip.style.display = "flex";
    addToTrip.style.top = "5vh";
    addToTrip.style.left = "7vw";
    setTimeout(() => {
      addToTrip.style.opacity = 1;
    }, 100);
    adding.textContent = `Adding ${e.target.getAttribute("name")}`;
  }
}

export let applied_filters = [];

export const tripDates = [];

export const dateObj = {
  date: new Date(),
  currMonth: new Date().getMonth(),
  currYear: new Date().getFullYear(),
};

export const tripObj = {
  Where: "",
  Name: "",
  From: "",
  To: "",
  Year: dateObj.currYear,
};
