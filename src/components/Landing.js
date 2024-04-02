import React, { useEffect, useRef } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import { allPlaces } from "./allMarkers.mjs";
import { Link } from "react-router-dom";

function Landing() {
  const landingMain = useRef();
  const spotlight = useRef();
  const spotlightCursor = useRef();
  const chevleft = useRef();
  const chevright = useRef();

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
        <section id="landing-nav">
          <div id="landing-nav-left">
            <FontAwesomeIcon icon={faPaperPlane} style={{ color: "black" }} />
            <h1 className="travel">TRAVEL</h1>
            <h1 className="smart">SMART</h1>
          </div>
          <div id="landing-nav-right">
            <Link to="/login">
              <button>Get Started</button>
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
              color="#FFD0D5"
              deg="1deg"
            ></img>
            <img
              className="landing-card two"
              src="design.jpg"
              style={{ pointerEvents: "none" }}
              color="#A4C9D8"
              deg="2deg"
            ></img>
            <img
              className="landing-card three"
              src="inform.png"
              style={{ pointerEvents: "none" }}
              color="#ACDBF6"
              deg="3deg"
            ></img>
            <img
              className="landing-card four"
              src="newcities.jpg"
              style={{ pointerEvents: "none" }}
              color="#FFD0D5"
              deg="4deg"
            ></img>
            <img
              className="landing-card five"
              src="showcase2.png"
              style={{ pointerEvents: "none" }}
              color="#FFBC4B"
              deg="5deg"
            ></img>
            <img
              className="landing-card six"
              src="showcase1.png"
              id="dragable"
              deg="6deg"
            ></img>
          </div>
        </section>
        <div id="scroll-down">
          <h3>SCROLL DOWN</h3>
          <FontAwesomeIcon icon={faArrowDown} />
        </div>
      </section>

      <section id="landing-new-features">
        <h2>New Features</h2>
        <div id="new-features-content">
          <div className="bigdiv">
            <img src="googlemap.png"></img>
            <h5>Explore</h5>
            <h4>Google Maps Integration</h4>
            <p>
              Thanks to the power of google maps, you can now see vital and
              accurate place information like opening times, ratings, and more.
            </p>
          </div>
          <div className="smdiv">
            <img src="heart.png"></img>
            <h5>Q+A</h5>
            <h4>Why add to your favorites?</h4>
            <p>
              Your favorites are the way you save places that you want to visit
              but don't know how they'll fit into your trip just yet. You can
              evaluate later and add them to your trip from the trip planner.
            </p>
          </div>
          <div className="smdiv">
            <img src="landingbudgeting.png"></img>
            <h5>Planning</h5>
            <h4>How to plan for expenses?</h4>
            <p>
              Travel Smart has a built in budgeting system that lets you set a
              trip budget, set budgets for each place you'll visit and other
              essentials like hotel and transportation.
            </p>
          </div>
          <div className="bigdiv">
            <img src="findeasy.png"></img>
            <span id="manyh5">
              <h5>The Best</h5>
              <h5 className="nexth5">Dining</h5>
              <h5 className="nexth5">Bars</h5>
              <h5 className="nexth5">Places</h5>
            </span>
            <h4>Find it easily</h4>
            <p>
              Finding those places you want to visit is a breeze. For those who
              don't know a city, Travel Smart is your tour guide.
            </p>
          </div>
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
          <h2 className="in">In the Spotlight</h2>
          <h2 className="impacts">See how Travel Smart impacts travel</h2>
        </div>

        <div id="landing-spotlight-content">
          <div className="spotlight-wrapper">
            <div className="burst-8"></div>
            <img src="couple.jpg" className="coupleimg"></img>
            <h4>Dan & Sherrol</h4>
            <p>Since 2018</p>
            <h3 className="testimonial-text">
              Travel smart has enabled us to plan 5 europe trips and 3 US trips.
              The tools are so easy to use and make travel planning an absolute
              breeze. Couldn't recommend it more.
            </h3>

            <div className="from">
              <div></div>
              <h6>NEW YORK</h6>
            </div>
          </div>

          <div className="spotlight-wrapper">
            <div className="burst-8"></div>
            <img src="portrait2.jpg" className="small-img"></img>
            <h4>Carl Townsend</h4>
            <p>Since 2022</p>
            <h3 className="testimonial-text-2">
              I'll put it this way, technology is difficult to use, Travel Smart
              isn't. From the beginning it was intuative and easy to use. I've
              been using it for 4 years now and I've never looked back.
            </h3>

            <div className="from">
              <div></div>
              <h6>LAS VEGAS</h6>
            </div>
          </div>

          <div className="spotlight-wrapper">
            <div className="burst-8"></div>
            <img src="portrait3.jpg" className="med-img"></img>
            <h4>Jay Cutler</h4>
            <p>Since 2022</p>
            <h3 className="testimonial-text-3">
              Me and my freinds have planned countless trips with Travel Smart. It does not compare to it's competitors. Even my non planner friends love having the itinerary that I send them.
            </h3>

            <div className="from">
              <div></div>
              <h6>NEW YORK</h6>
            </div>
          </div>

          <div className="spotlight-wrapper">
            <div className="burst-8"></div>
            <img src="couple2.jpg" className="seclg-img"></img>
            <h4>Jack and Jill</h4>
            <p>Since 2022</p>
            <h3 className="testimonial-text-4">
              We went up the hill of Travel Smart and have never looked back. We're using to to plan a trip to Chicago, our hometown. We know a lot of the spots but Travel Smart has opened us up to places we've never been to! Can't wait.
            </h3>

            <div className="from">
              <div></div>
              <h6>CHICAGO</h6>
            </div>
          </div>

          <div className="spotlight-wrapper">
            <div className="burst-8"></div>
            <div className="six-pointed-star"></div>
            <img src="portrait5.jpg" className="small-img"></img>
            <h4>Ethan James</h4>
            <p>Since 2022</p>
            <h3 className="testimonial-text-2">
              YAHHH BUDDY! Use Travel Smart. My son introduced me to it and we make trips together. It's so easy. It's easier to use Travel Smart than to get to Travel Smart on the web! That's how simple it is!
            </h3>

            <div className="from">
              <div></div>
              <h6>MIAMI</h6>
            </div>
          </div>
        </div>
      </section>

      <section id="landing-subs">
        <div id="landing-subs-text">
          <h2>Want Travel Smart Updates like new cities sent to your inbox?</h2>
        </div>
        <div id="landing-subs-input">
          <input type="text" placeholder="Enter your email"></input>
          <button>SEND</button>
        </div>
      </section>

      <section id="landing-convert">
        <div id="convert-left">
          <img src="travelpainting.jpg"></img>
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
            <button>Get Started</button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default Landing;
