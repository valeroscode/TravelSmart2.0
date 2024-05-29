export const citiesArray = [
  {
    city: "Miami",
    location: "Southeast United States",
    description:
      "A vibrant city where the sun always shines. Just don't come on spring break.",
  },
  {
    city: "New York",
    location: "Northeast United States",
    description:
      "How ya doin'? The city that never sleeps and has the best street food, just don't go in the winter.",
  },
  {
    city: "Barcelona",
    location: "Northeast Spain",
    description:
      "A beautiful city that the developer has never been to but REALLY wants to visit.",
  },
];

//A collection of objects used to retrieve place information

let places = [];

await fetch("http://localhost:8080/places", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    city: "",
  }),
})
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    places = data;
  })
  .catch((err) => {
    console.error(err);
  });

export const allPlaces = places;
