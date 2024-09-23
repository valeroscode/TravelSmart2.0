import React, { useEffect, useRef } from "react";
import { citiesArray } from "./allMarkers.mjs";
import "./styles/Miami2.css";
import { useCookies } from "react-cookie";

function Footer({name}) {
  const footerMain = useRef();
  const emailInput = useRef();


  const [cookies, setCookie] = useCookies(["email_subbed"]);

  useEffect(() => {
    if (window.location.pathname !== "/Search-Results") {
      footerMain.current.style.marginTop = "3rem";
    }
  }, []);

  function notifyDev(issue) {
    fetch("http://localhost:8080/reportIssue", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        issue: issue
      }),
    }).then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }


  function addToSubList(e) {
    fetch("http://localhost:8080/addToSubList", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput.current.value
      }),
    }).then((response) => {
      return response.json();
    })
    .then(() => {
      setCookie("email_subbed", true);
      emailInput.current.style.display = "none";
      e.target.textContent = 'Subscribed';

    })
    .catch((error) => {
      console.error("Error:", error);
      notifyDev(`Mailing list error: ${error}`)
      alert('There was an error while adding you to the mailing list. The developer will be notified and the issue will be resolved shortly. A notice will be added to the update section found at the bottom of the landing page once the issue is resolved. Sorry for the inconvenience.')
    });
  }

  return (
    <>
      <section id="footer-main" ref={footerMain}>
        <div id="footer-main-container">
        <div id="footer-main-title">
          <h1>WANDR</h1>
        </div>
        <p id="footer-slogan">Explore. Plan. Discover.</p>

        <div id="main-footer-section">
          <div id="footer-main-child-2">
            { name === 'guest' && !cookies.email_subbed ?
            <div id="subscribe-info">
              <h4>GET UPDATES AS CONTENT IS ADDED TO WANDR</h4>
              <div id="getonlist">
                <input type="text" placeholder="Enter your email" ref={emailInput} />
                <button onClick={(e) => addToSubList(e)}>Subscribe</button>
              </div>
            </div>
            : <div id="subscribe-info">
              <h4>THANK YOU FOR BEING AN EARLY USER</h4>
              <div id="getonlist">
              
                <a href="https://www.linkedin.com/in/alex-valero-3416b52a1/" target="_blank">
                Connect with the developer on LinkedIn
                </a>
              </div>
              </div>
              }
            <div id="contact-footer">
              <h4>GET IN TOUCH</h4>
              <p className="direct">Have comments, suggestions, or cries of outrage? <br></br> Contact the developer directly 👇</p>
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
