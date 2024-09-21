import React, { useEffect, useRef, useState } from "react";
import "./styles/landing.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faChevronLeft,
  faChevronRight,
  faLocationPin,
  faUser,
  faPlay,
  faBurst,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import makemems from "./assets/makemems.jpg";
import miamiwaves from "./assets/miamiwaves.jpg";
import withopts from "./assets/withoptions.jpg";
import withease from "./assets/withease.jpg";
import fromto from "./assets/fromto.jpg";
import easyusephone from "./assets/easyuse (1).png";
import easyusecomp from "./assets/easyuse (2).png";
import withothers from "./assets/waterfall.jpg";
import planflowers from "./assets/planflowers.jpg";
import icelandwaterfall from "./assets/icelandwaterfall.jpg";
import kobe from "./assets/kobe.jpg";
import nylanding from "./assets/New York Landing.jpg";
import mialanding from "./assets/Miami Landing.jpg";
import romelanding from "./assets/Rome Landing.jpg";
import tokyoLanding from "./assets/Tokyo Landing.jpg";
import nashvillelanding from "./assets/Nashville Landing.jpg";
import { allPlaces } from "./allMarkers.mjs";
import { useCookies } from "react-cookie";

function Landing() {
  const [cookies] = useCookies(["access_token"]);
  const [cities, setCities] = useState([]);
  const landingMain = useRef();
  const spotlight = useRef();
  const spotlightCursor = useRef();
  const chevleft = useRef();
  const chevright = useRef();
  const landingNav = useRef();
  const scrollDownText = useRef();
  const landingNavBtn = useRef();

  const category = useRef();
  const content = useRef();
  const ftText = useRef();

  const placesCount = useRef();
  const usersCount = useRef();
  let clicked = false;

  const titles = [
    {
      category: "EXPLORE",
      content:
        "So, Ready To Wandr?",
    },
    {
      category: "PLAN",
      content: "Trip Planning Made Easier Than Ever",
    },
    {
      category: "EXPLORE",
      content: "The Best Search Engine For Finding Cool Places",
    },
    {
      category: "BEHIND THE SCENES",
      content:
        "Always improving and adding new features to make your travel experience better",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      switchCards();
    }, 4000);

    document.getElementsByClassName("App")[0].style.overflowY = "hidden";

    if (window.location.pathname === "/") {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 0) {
          landingNav.current.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
          landingNavBtn.current.style.borderRadius = "0px";
          landingNavBtn.current.style.backgroundColor = "#8A05FF";
          landingNavBtn.current.style.color = "white";
        } else {
          landingNav.current.style.backgroundColor = "rgba(0, 0, 0, 0)";
          landingNavBtn.current.style.borderRadius = "0px 0px 0px 20px";
          landingNavBtn.current.style.backgroundColor = "white";
          landingNavBtn.current.style.color = "black";
        }
      });
    }

    const citiesArr = [];

    for (let i = 0; i < allPlaces.length; i++) {
      if (!citiesArr.includes(allPlaces[i].city)) {
        citiesArr.push(allPlaces[i].city);
      }
    }

    setCities(citiesArr);

    const whyItems = document.getElementsByClassName("why-item");

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          setTimeout(() => {
            entry.target.style.backgroundColor = "black";
            entry.target.firstElementChild.style.opacity = 1;
            entry.target.childNodes[1].style.opacity = 1;
          }, 500);
        } else {
          entry.target.style.opacity = 0;
          setTimeout(() => {
            entry.target.style.backgroundColor = "rgba(0,0,0,0)";
            entry.target.firstElementChild.style.opacity = 0;
            entry.target.childNodes[1].style.opacity = 0;
          }, 500);
        }
      });
    });

    for (let i = 0; i < whyItems.length; i++) {
      obs.observe(whyItems[i]);
      console.log(whyItems[i].childNodes[1]);
    }
  }, []);

  var xp = 0,
    mouseX = 0;
  var yp = 0,
    mouseY = 0;
  var xpDot = 0,
    mouseX = 0;
  var ypDot = 0,
    mouseY = 0;

  function dragElement(e, elmnt) {
    if (!clicked) {
      spotlightCursor.current.style.left = e.clientX - 50 + "px";
      spotlightCursor.current.style.top = e.clientY - 60 + "px";
    }
  }

  let currentCard = 3;
  let broughtBackCard = 0;

  function switchCards() {
    const cards = document.getElementsByClassName("landing-card");

    const switchCard = () => {
      if (currentCard === 0) {
        currentCard = 3;
        function bringBackCards() {
          if (broughtBackCard === 3) {
            broughtBackCard = 0;
            setTimeout(() => {
              for (let i = 0; i < cards.length; i++) {
                cards[i].style.transform = `rotate(${cards[i].getAttribute(
                  "deg"
                )})`;
              }
            }, 1000);
            setTimeout(() => {
              switchCards();
            }, 4000);
          } else {
            broughtBackCard++;
            cards[broughtBackCard].style.transform = "translateX(0px)";
            setTimeout(() => {
              bringBackCards();
            }, 100);
          }
        }
        bringBackCards();
      } else {
        currentCard--;

        for (let i = 0; i < cards.length; i++) {
          cards[i].style.pointerEvents = "none";
        }

        cards[currentCard + 1].style.transform = "translateX(1000px)";

        cards[currentCard].style.pointerEvents = "all";
        cards[currentCard].style.transform = "rotate(0deg)";

        landingMain.current.style.backgroundColor =
          cards[currentCard].getAttribute("color");

        ftText.current.style.opacity = 0;

        setTimeout(() => {
          category.current.textContent = titles[currentCard].category;
          content.current.textContent = titles[currentCard].content;
          ftText.current.style.opacity = 1;
        }, 400);

        setTimeout(() => {
          switchCards();
        }, 4000);
      }
    };
    switchCard();
  }

  function renderCursor(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
    spotlightCursor.current.style.opacity = 1;
    spotlightCursor.current.style.top = e.clientY + "px";
    spotlightCursor.current.style.left = e.clientX + "px";
  }

  function changeCursor(e) {
    spotlightCursor.current.style.border = "10px solid lightgray";
    spotlightCursor.current.style.height = "0.3rem";
    spotlightCursor.current.style.width = "0.3rem";
    chevleft.current.style.opacity = 0;
    chevright.current.style.opacity = 0;
    setTimeout(() => {
      chevleft.current.style.display = "none";
      chevright.current.style.display = "none";
      chevleft.current.style.height = "0rem";
      chevright.current.style.height = "0rem";
    }, 400);
  }

  function revertCursor() {
    spotlightCursor.current.style.border = "1px solid lightgray";
    spotlightCursor.current.style.height = "4rem";
    spotlightCursor.current.style.width = "4rem";
    chevleft.current.style.opacity = 1;
    chevright.current.style.opacity = 1;
    setTimeout(() => {
      chevleft.current.style.display = "block";
      chevright.current.style.display = "block";
      chevleft.current.style.height = "1rem";
      chevright.current.style.height = "1rem";
    }, 300);
  }

  return (
    <>
      <section id="landing-main" ref={landingMain}>
        <section id="landing-nav" ref={landingNav}>
          <div id="landing-nav-left">
            <FontAwesomeIcon icon={faPaperPlane} style={{ color: "white" }} />
            <h1 className="travel">WANDR</h1>
          </div>
          {cookies.access_token ? (
            <Link to="/home">
              <div id="landing-nav-right" ref={landingNavBtn}>
                <p>Dashboard</p>
              </div>
            </Link>
          ) : (
            <Link to="/login">
              <div id="landing-nav-right" ref={landingNavBtn}>
                <p>Get Started</p>
              </div>
            </Link>
          )}
        </section>

        <section id="landing-feature-breakdown">
          <div id="feature-icon">
            <FontAwesomeIcon className="paper-plane" icon={faPaperPlane} />
            <FontAwesomeIcon className="burst-top" icon={faBurst} />
          </div>
          <div id="feature-text" ref={ftText}>
            <p id="feature-text-category" ref={category}>
              WELCOME
            </p>
            <h2 id="feature-text-content" ref={content}>
              Here To Help You Make Memories
            </h2>
            <Link to="/login">
              <button className="get-started-below-h2">START NOW</button>
            </Link>
          </div>

          <div id="feature-cards">
            <img
              className="landing-card three"
              src={fromto}
              style={{ pointerEvents: "none" }}
              color="#1A4D31"
              deg="3deg"
            ></img>
            <img
              className="landing-card four"
              src={withease}
              style={{ pointerEvents: "none" }}
              color="#08496F"
              deg="4deg"
            ></img>
            <img
              className="landing-card five"
              src={withopts}
              style={{ pointerEvents: "none" }}
              color="#A45F11"
              deg="5deg"
            ></img>
            <img
              className="landing-card six"
              src={makemems}
              id="dragable"
              deg="6deg"
            ></img>
          </div>
        </section>
      </section>

      <section id="landing-new-features">
        <h2>Why WANDR?</h2>
        <div id="why-ts">
          <div className="why-item">
            <h4>Explore</h4>
            <p>Finding the best places in a city is now more simple.</p>
            <img src={icelandwaterfall} className="why-img"></img>
          </div>

          <div className="why-item">
            <h4>Plan</h4>
            <p>Plan your trips using our extensive features.</p>
            <img src={planflowers} className="why-img"></img>
          </div>

          <div className="why-item">
            <h4>Discover</h4>
            <p>All the info you need, none of the clutter.</p>
            <img src={kobe} className="why-img"></img>
          </div>

          <div className="why-item">
            <h4>Plan with others</h4>
            <p>Not going solo? We make it easy to collaborate.</p>
            <img src={withothers} className="why-img"></img>
          </div>
        </div>

        <div id="new-features-content-2">
          <h4>But Most Of All...</h4>
          <h2>We Help You Make Memories.</h2>
        </div>

        <div id="easy-to-use-div">
          <div id="easy-text">
            <h2>So, Ready To Plan Your Next Adventure?</h2>
            <p>
              WANDR is a hub, where people discover new places and
              visualize the best moments, faciliating the best memories.
            </p>
            <Link to="/login">
              <button className="get-started-below-memory">START NOW</button>
            </Link>
          </div>
          <div id="easy-imgs">
            <FontAwesomeIcon icon={faBurst} />
            <img src={easyusephone} className="easy-use-phone"></img>
            <img src={easyusecomp} className="easy-use-laptop"></img>
          </div>
        </div>

        {/* <div className="bigdiv">
            <img src="findeasy.png"></img>
            <span id="manyh5">
              <h5>The Best</h5>
            </span>
            <h4>Find it easily</h4>
            <p>
              Finding those places you want to visit is a breeze. For those who
              don't know a city, Travel Smart is your tour guide.
            </p>
          </div> */}
      </section>

      <section
        id="landing-spotlight"
        ref={spotlight}
        // onMouseOver={(e) => {
        //   renderCursor(e);
        // }}
        // onMouseMove={(e) => {
        //   dragElement(e, spotlightCursor.current);
        // }}
        // onMouseLeave={(e) => {
        //   spotlightCursor.current.style.opacity = 0;
        //   spotlightCursor.current.style.top = 0;
        //   spotlightCursor.current.style.left = 0;
        // }}
      >
        <div
          id="cursor"
          ref={spotlightCursor}
          // onMouseDown={(e) => {
          //   changeCursor(e);
          //   clicked = true;
          // }}
          // onMouseUp={() => {
          //   revertCursor();
          //   clicked = false;
          // }}
        >
          <FontAwesomeIcon icon={faChevronLeft} ref={chevleft} />
          <FontAwesomeIcon icon={faChevronRight} ref={chevright} />
        </div>

        <div id="landing-spotlight-text">
          <h2 className="in">City Leaderboard</h2>
          <h2 className="impacts">
            Which 5 places are users traveling to the most?
          </h2>
        </div>

        <div id="landing-spotlight-content">
          <div className="spotlight-wrapper">
            <div className="burst-8"></div>
            <img src={nylanding} className="coupleimg"></img>
            <h4>The City That Never Sleeps</h4>
            <p>50 trips planned</p>
            <h3 className="testimonial-text">
              New York City, bustling with life, is a vibrant metropolis of
              towering skyscrapers, cultural diversity, and endless
              possibilities.
            </h3>

            <div className="from">
              <div></div>
              <h6>NEW YORK</h6>
            </div>
          </div>

          <div className="spotlight-wrapper">
            <div className="burst-8"></div>
            <img src={mialanding} className="small-img"></img>
            <h4>An Expensive Paradise</h4>
            <p>40 trips planned</p>
            <h3 className="testimonial-text-2">
              Miami, a sun-soaked paradise, boasts stunning beaches, vibrant
              nightlife, and a melting pot of cultures, offering endless
              excitement and relaxation.
            </h3>

            <div className="from">
              <div></div>
              <h6>MIAMI</h6>
            </div>
          </div>

          <div className="spotlight-wrapper">
            <div className="burst-8"></div>
            <img src={tokyoLanding} className="med-img"></img>
            <h4>Serene & Exciting</h4>
            <p>33 trips planned</p>
            <h3 className="testimonial-text-3">
              Tokyo, a pulsating megacity, blends ancient tradition with
              cutting-edge technology, offering a sensory overload of neon-lit
              streets, bustling markets, and serene temples.
            </h3>

            <div className="from">
              <div></div>
              <h6>TOKYO</h6>
            </div>
          </div>

          <div className="spotlight-wrapper">
            <div className="burst-8"></div>
            <img src={romelanding} className="seclg-img"></img>
            <h4>Ancient Charm</h4>
            <p>20 trips planned</p>
            <h3 className="testimonial-text-4">
              Rome, the Eternal City, exudes ancient charm with its majestic
              ruins, picturesque piazzas, and mouthwatering cuisine, captivating
              visitors with its timeless allure.
            </h3>

            <div className="from">
              <div></div>
              <h6>ROME</h6>
            </div>
          </div>

          <div className="spotlight-wrapper">
            <div className="burst-8"></div>
            <div className="six-pointed-star"></div>
            <img src={nashvillelanding} className="small-img"></img>
            <h4>The Country Capital</h4>
            <p>16 trips planned</p>
            <h3 className="testimonial-text-2">
              Nashville, the heart of country music, welcomes visitors with its
              lively honky-tonks, southern hospitality, and rich musical
              heritage, promising an unforgettable experience in Music City.
            </h3>

            <div className="from">
              <div></div>
              <h6>NASHVILLE</h6>
            </div>
          </div>
        </div>
      </section>

      <section id="allcities">
        <h2>ALL {cities.length} CITIES YOU CAN EXPLORE</h2>
        <ul>
          {cities.map((city) => (
            <li>{city}</li>
          ))}
        </ul>
      </section>

      <section id="landing-subs">
        <div id="landing-subs-text">
          <h2>Want Updates like New Cities Sent To Your Inbox?</h2>
        </div>
        <div id="landing-subs-input">
          <input type="text" placeholder="Enter your email"></input>
          <button
            onClick={() => {
              alert(
                "The backend code for this feature is under development. Please click one of the 'Get Started' buttons to use WANDR!"
              );
            }}
          >
            SEND
          </button>
        </div>
      </section>

      <section id="landing-convert">
        <div id="convert-left">
          <img src={miamiwaves}></img>
          <div id="convert-start-app">
            <Link to="/login">
              <FontAwesomeIcon icon={faPlay} />
            </Link>
            <p>Join the WANDR community</p>
          </div>
        </div>

        <div id="convert-right">
          <Link to="/login">
            <h2>START NOW</h2>
          </Link>
          <div id="convert-reasons">
            <div>
              <FontAwesomeIcon icon={faLocationPin} />
              <h4 ref={placesCount} max="120">
                {allPlaces.length}
              </h4>
              <p>Over {allPlaces.length} different places</p>
            </div>
            <div>
              <FontAwesomeIcon icon={faUser} />
              <h4 ref={usersCount} max="600">
                600k
              </h4>
              <p>Over 600k users worldwide</p>
            </div>
          </div>
          <h3>Endless features, one platform</h3>
          <p>
            Experience the ease of WANDR by signing up or logging into
            your account.
          </p>
          <Link to="/login">
            <button>Get Started </button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default Landing;
