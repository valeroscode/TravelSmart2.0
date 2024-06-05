import React, { useEffect, useRef } from "react";
import { citiesArray } from "./allMarkers.mjs";
import "./styles/Miami2.css";

function Footer() {
  const footerMain = useRef();

  useEffect(() => {
    if (window.location.pathname !== "/Search-Results") {
      footerMain.current.style.marginTop = "5rem";
    }
  }, []);
  return (
    <>
      <section id="footer-main" ref={footerMain}>
        <div>
        <div id="footer-main-title">
          <h1>TRAVEL SMART</h1>
        </div>
        <p id="footer-slogan">Explore. Discover. Plan.</p>

        <div id="main-footer-section">
          <div id="footer-main-child-2">
            <div id="subscribe-info">
              <h4>GET UPDATES AS CONTENT IS ADDED TO TRAVEL SMART</h4>
              <div id="getonlist">
                <input type="text" placeholder="Enter your email" />
                <button>Subscribe</button>
              </div>
            </div>
            <div id="contact-footer">
              <h4>GET IN TOUCH</h4>
              <p className="direct">Contact the developer directly 👇</p>
              <div id="contact-info">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="#ffffff"
                    d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                  />
                </svg>

                <p>avalero.software@gmail.com</p>
              </div>
            </div>
          </div>
          </div>
        </div>

       
      </section>
    </>
  );
}

export default Footer;
