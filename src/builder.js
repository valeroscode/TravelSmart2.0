import React, { useEffect, useRef, useState } from "react";

function Builder() {
  const json = useRef();

  const [name, setName] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    new window.google.maps.places.Autocomplete(
      document.getElementById("autocomplete")
    );
  });

  function getJSON() {
    alert(
      String(document.getElementById("autocomplete").value).replaceAll(" ", "+")
    );
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyC37B8EgCH2fYCPi0SWKh1FU4wPMsr8tas`
    )
      .then((response) => response.json())
      .then((data) => {
        json.current.innerText = JSON.stringify(data);
      });
  }

  return (
    <>
      <input id="autocomplete" placeholder="Enter your address" type="text" />
      <button onClick={() => getJSON()}>Get JSON</button>
      <p ref={json}></p>
    </>
  );
}

export default Builder;
