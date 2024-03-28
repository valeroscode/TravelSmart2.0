import React, { useEffect, useState } from "react";
import "./styles/landing.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faArrowDown } from "@fortawesome/free-solid-svg-icons";

function Landing() {
  var active = false;
  var currentX;
  var currentY;
  var initialX;
  var initialY;
  var xOffset = 0;
  var yOffset = 0;

  function dragStart(e) {

    if (e.type === "touchstart") {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }

    if (e.target === e.target.closest("img")) {
      active = true;
    }
  }

  function dragEnd(e) {

    initialX = currentX;
    initialY = currentY;

    active = false;

    if (currentX > 300) {
      alert("swiped right");
      e.target.style.transform = "translate3d(100vw, 0, 0)";
      e.target.previousElementSibling.style.pointerEvents = "all";
      e.target.previousElementSibling.style.rotate = "0deg";
      initialX = null;
      initialY = null;
      currentX = null;
      currentY = null;
    }
  }

  function drag(e) {
    if (active) {
      e.preventDefault();

      if (e.type === "touchmove") {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }

      xOffset = currentX;
      yOffset = currentY;

      setTranslate(currentX, currentY, e.target.closest("img"));
      console.log(xOffset + " " + yOffset);
    }
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
  }

  return (
    <>
      <section id="landing-main">
        <section id="landing-nav">
          <div id="landing-nav-left">
            <FontAwesomeIcon icon={faPaperPlane} style={{ color: "black" }} />
            <h1 className="travel">TRAVEL</h1>
            <h1 className="smart">SMART</h1>
          </div>
          <div id="landing-nav-right">
            <button>Get Started</button>
          </div>
        </section>

        <section id="landing-feature-breakdown">
          <div id="feature-text">
            <p id="feature-text-category">PRODUCT DESIGN</p>
            <h2 id="feature-text-content">
              From Web Page to Web Player: How Spotify Designed a New Homepage
              Experience
            </h2>
          </div>
          <div id="feature-cards">
            <img
              src="Miami.jpg"
              onTouchStart={(e) => dragStart(e)}
              onTouchEnd={(e) => dragEnd(e)}
              onTouchMove={(e) => drag(e)}
              onMouseDown={(e) => dragStart(e)}
              onMouseUp={(e) => dragEnd(e)}
              onMouseMove={(e) => drag(e)}
              style={{ pointerEvents: "none" }}
            ></img>
            <img
              src="Miami.jpg"
              onTouchStart={(e) => dragStart(e)}
              onTouchEnd={(e) => dragEnd(e)}
              onTouchMove={(e) => drag(e)}
              onMouseDown={(e) => dragStart(e)}
              onMouseUp={(e) => dragEnd(e)}
              onMouseMove={(e) => drag(e)}
              style={{ pointerEvents: "none" }}
            ></img>
            <img
              src="Miami.jpg"
              onTouchStart={(e) => dragStart(e)}
              onTouchEnd={(e) => dragEnd(e)}
              onTouchMove={(e) => drag(e)}
              onMouseDown={(e) => dragStart(e)}
              onMouseUp={(e) => dragEnd(e)}
              onMouseMove={(e) => drag(e)}
              style={{ pointerEvents: "none" }}
            ></img>
            <img
              src="Miami.jpg"
              onTouchStart={(e) => dragStart(e)}
              onTouchEnd={(e) => dragEnd(e)}
              onTouchMove={(e) => drag(e)}
              onMouseDown={(e) => dragStart(e)}
              onMouseUp={(e) => dragEnd(e)}
              onMouseMove={(e) => drag(e)}
              style={{ pointerEvents: "none" }}
            ></img>
            <img
              src="Miami.jpg"
              onTouchStart={(e) => dragStart(e)}
              onTouchEnd={(e) => dragEnd(e)}
              onTouchMove={(e) => drag(e)}
              onMouseDown={(e) => dragStart(e)}
              onMouseUp={(e) => dragEnd(e)}
              onMouseMove={(e) => drag(e)}
              
            ></img>
            <img
              src="Miami.jpg"
              onTouchStart={(e) => dragStart(e)}
              onTouchEnd={(e) => dragEnd(e)}
              onTouchMove={(e) => drag(e)}
              onMouseDown={(e) => dragStart(e)}
              onMouseUp={(e) => dragEnd(e)}
              onMouseMove={(e) => drag(e)}
            ></img>
          </div>
        </section>
        <div id="scroll-down">
          <h3>SCROLL DOWN</h3>
          <FontAwesomeIcon icon={faArrowDown} />
        </div>
      </section>

      <section id="landing-spotlight">
        <div id="landing-spotlight-text">
          <h2 className="in">In the Spotlight</h2>
          <h2 className="impacts">See how Travel Smart impacts travel</h2>
        </div>

        <div id="landing-spotlight-content">
          <div className="spotlight-wrapper">
            <img src="couple.jpg"></img>
            <h4>Dan & Sherrol</h4>
            <p>Since 2018</p>
            <h3 className="testimonial-text">
              Travel smart has enabled us to plan 5 europe trips and 3 US trips.
              The tools are so easy to use and make travel planning an absolute
              breeze. Couldn't recommend it more.
            </h3>

            <div className="from">
              <div></div>
              <p>NEW YORK</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Landing;
