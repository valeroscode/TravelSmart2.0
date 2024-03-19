import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { citiesArray } from "./allMarkers.mjs";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./styles/Miami2.css";

function Footer() {
  return (
    <>
      <section id="footer-main">
        <div id="footer-main-title">
          <FontAwesomeIcon icon={faPaperPlane} style={{ color: "#ffffff" }} />
          <h1>TRAVEL SMART</h1>
        </div>
        <div id="footer-main-cities">
          <h4>Cities</h4>
          <div>
            {citiesArray.map((city) => (
              <p>{city.city}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Footer;
