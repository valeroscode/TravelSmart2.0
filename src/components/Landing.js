import React, { useEffect, useRef, useState } from "react";
import "./styles/landing.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faArrowDown,
  faPlaneUp,
  faChevronLeft,
  faChevronRight,
  faLocationPin,
  faUser,
  faPlay,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";
import { allPlaces } from "./allMarkers.mjs";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import greece1 from "./assets/greece1.jpg";
import coolnew from "./assets/coolnew.jpg";
import miamiwaves from "./assets/miamiwaves.jpg";
import createitin from "./assets/createitin.jpg";

function Landing() {
  const [cities, setCities] = useState([]);
  const landingMain = useRef();
  const spotlight = useRef();
  const spotlightCursor = useRef();
  const chevleft = useRef();
  const chevright = useRef();
  const landingNav = useRef();
  const scrollDownText = useRef();

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
        "From the USA to Australia: Finding Cool Places has Never Been Easier",
    },
    {
      category: "PLAN",
      content: "Designing Your Getaway: Travel Smart has all the tools",
    },
    {
      category: "DISCOVER",
      content: "Inform Yourself: Travel Smart has all the info you need",
    },
    {
      category: "BEHIND THE SCENES",
      content: "New Cities and places added every week",
    },
    {
      category: "EXPLORE",
      content:
        "Thanks to Google Maps, you can plan your trips with a bird's eye view",
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
        } else {
          landingNav.current.style.backgroundColor = "rgba(0, 0, 0, 0)";
        }
      });
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

  let currentCard = 5;
  let broughtBackCard = 0;

  function switchCards() {
    const cards = document.getElementsByClassName("landing-card");

    const switchCard = () => {
      if (currentCard === 0) {
        currentCard = 5;
        function bringBackCards() {
          if (broughtBackCard === 5) {
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
            <h1 className="travel">TRAVEL</h1>
            <h1 className="travel">SMART</h1>
          </div>
          <div id="landing-nav-right">
            <Link to="/login">
              <button>GET STARTED</button>
            </Link>
          </div>
        </section>

        <section id="landing-feature-breakdown">
          <div id="feature-icon">
            <FontAwesomeIcon icon={faPaperPlane} />
          </div>
          <div id="feature-text" ref={ftText}>
            <p id="feature-text-category" ref={category}>
              WELCOME
            </p>
            <h2 id="feature-text-content" ref={content}>
              Welcome to Travel Smart: An All-In-One Travel Planner for Those
              That Want to See the World
            </h2>
          </div>
          <div id="feature-cards">
            <img
              className="landing-card one"
              src="findeasy.png"
              style={{ pointerEvents: "none" }}
              color="#A76000"
              deg="1deg"
            ></img>
            <img
              className="landing-card two"
              src="design.jpg"
              style={{ pointerEvents: "none" }}
              color="#003643"
              deg="2deg"
            ></img>
            <img
              className="landing-card three"
              src="inform.png"
              style={{ pointerEvents: "none" }}
              color="#1A4D31"
              deg="3deg"
            ></img>
            <img
              className="landing-card four"
              src="newcities.jpg"
              style={{ pointerEvents: "none" }}
              color="#332511"
              deg="4deg"
            ></img>
            <img
              className="landing-card five"
              src="showcase2.png"
              style={{ pointerEvents: "none" }}
              color="#281C7C"
              deg="5deg"
            ></img>
            <img
              className="landing-card six"
              src={greece1}
              id="dragable"
              deg="6deg"
            ></img>
          </div>
        </section>

        <Link to="/login">
          <div id="scroll-down" className="pulse">
            <h3 ref={scrollDownText}>Login/Register</h3>
            <FontAwesomeIcon icon={faPlane} />
          </div>
        </Link>
      </section>

      <section id="landing-new-features">
        <h2>Why Travel Smart?</h2>
        <div id="new-features-content">
          <div className="bigdiv">
            <img src={coolnew}></img>
            <h5>Explore</h5>
            <h4>Find Cool New Places With Ease</h4>
            <p>
              Traveling to a near or faraway land and don't know where to get
              started? How about those of you who end up going to the same
              places in your current city? Travel Smart solves both problems!
              It's never been easier to explore cities here and aborad.
            </p>
          </div>
          <div className="bigdiv">
            <img src="heart.png"></img>
            <h5>Make Memories</h5>
            <h4>We Help You Have A Good Time</h4>
            <p>
              We list the most highly rated places so you don't have to scour
              the internet. We also prioritize budget friendly establishments
              and activities so you can have a good time regardless of finances.
            </p>
          </div>
          <div className="bigdiv">
            <img src={createitin}></img>
            <h5>Planning</h5>
            <h4>Create Itineraries And Budgets</h4>
            <p>
              A well planned trip helps you see more and experience more. Our
              planning and budgeting system is intuative and easy, send out your
              itinerary to your travel buddies and get to exploring!
            </p>
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
        </div>
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
            <img src="New York Landing.jpg" className="coupleimg"></img>
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
            <img src="Miami Landing.jpg" className="small-img"></img>
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
            <img src="Tokyo Landing.jpg" className="med-img"></img>
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
            <img src="Rome Landing.jpg" className="seclg-img"></img>
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
            <img src="Nashville Landing.jpg" className="small-img"></img>
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
        <h2>ALL CITIES</h2>
        <ul>
          <li>Miami</li>
          <li>New York City</li>
          <li>Chicago</li>
          <li>Nashville</li>
          <li>Rome</li>
          <li>Seoul</li>
          <li>Tokyo</li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </section>

      <section id="landing-subs">
        <div id="landing-subs-text">
          <h2>Want Travel Smart Updates like new cities sent to your inbox?</h2>
        </div>
        <div id="landing-subs-input">
          <input type="text" placeholder="Enter your email"></input>
          <button
            onClick={() => {
              alert(
                "The backend code for this feature is under development. Please click one of the 'Get Started' buttons to use Travel Smart!"
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
            <p>Join the Travel Smart community</p>
          </div>
        </div>

        <div id="convert-right">
          <h2>START NOW</h2>
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
          <h3>Endless features, one planner</h3>
          <p>
            Experience the ease of Travel Smart by signing up or logging into
            your account.
          </p>
          <Link to="/login">
            <button>GET STARTED</button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default Landing;
