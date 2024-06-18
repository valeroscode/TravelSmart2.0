import React, { useEffect } from 'react'
import HomeHeader from "./HomeHeader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiamondTurnRight, faPhone,faBookmark, faDiamond } from "@fortawesome/free-solid-svg-icons";
import './styles/placepage.css'

function PlacePage() {

  useEffect(() => {

    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { placeId: localStorage.getItem("ID") },
      function (results, status) {
        if (status === window.google.maps.GeocoderStatus.OK) {
          const request = {
            placeId: localStorage.getItem("ID"),
            fields: ["reviews", "formatted_address", "opening_hours"],
          };

          var service = new window.google.maps.places.PlacesService(window.map);
          service.getDetails(request, function (place, status) {
            if (status == "OK") {
              console.log("place")
              // addressText.current.textContent = place.formatted_address;
              // for (let i = 0; i < place.reviews.length; i++) {
              //   renderReviews(place.reviews[i]);
              // }
            } else {
              console.log(status)
            }
          });
        }
      }
    );

  }, [])

    const priceLS = localStorage.getItem("price");
    const priceStyles = {
        1: { color: priceLS >= 1 ? "black" : "lightgray" },
        2: { color: priceLS >= 2 ? "black" : "lightgray" },
        3: { color: priceLS >= 3 ? "black" : "lightgray" },
        4: { color: priceLS >= 4 ? "black" : "lightgray" },
      };
  return (
    <>
     <HomeHeader/>
     <section id='place-backdrop'>
      <div id='place-basic-info'>
        <h2>{localStorage.getItem('title')}</h2>
        <div id='place-basic-rating'>
            <FontAwesomeIcon icon={faDiamond} /> <FontAwesomeIcon icon={faDiamond} /> <FontAwesomeIcon icon={faDiamond} /> <FontAwesomeIcon icon={faDiamond} /> <p>{localStorage.getItem('rating')}</p>
            </div>
        <h4>{localStorage.getItem('category')} in {localStorage.getItem('area')}</h4>
    

       <div id='cost-serving'>
        <p className="money">
                      <strong>
                        <a style={priceStyles[1]}>$</a>
                        <a style={priceStyles[2]}>$</a>
                        <a style={priceStyles[3]}>$</a>
                        <a style={priceStyles[4]}>$</a>
                      </strong>
        </p>
        <p> | Serving Beer & Cocktails</p>
        </div>

        <h5>Open11:00 AM - 11:00 PM</h5>

        <button><FontAwesomeIcon icon={faBookmark} /> Add To Favorites</button>
      </div>
     </section>

     <section id='place-backdrop-sec-info'>
      <div id='place-backdrop-sec-info-left'>
     <div id='place-secondary-info'>
        <p><FontAwesomeIcon icon={faPhone} /> (305) 909-8223</p>
        <p><FontAwesomeIcon icon={faDiamondTurnRight} /> 12161 SW 152nd St Miami, FL 33177</p>
      </div>

      <div id='msg-from-business'>
      <h2>Message From The Owners</h2>
      <div className='msg'>
        <h3>Ladies Night Thursday 7PM - 12AM</h3>
        <p>jnvojrnvpkfnvojefvoejfnvepnvjvnfepjvnepjnvpkernvpenvrnvojern</p>
      </div>
      </div>

      <div id='opening-hours-list'>
        <h4>Opening Hours</h4>
        <p>Mon  11:00 AM - 10:00 PM</p>
        <p>Mon  11:00 AM - 10:00 PM</p>
        <p>Mon  11:00 AM - 10:00 PM</p>
        <p>Mon  11:00 AM - 10:00 PM</p>
        <p>Mon  11:00 AM - 10:00 PM</p>
      </div>
      </div>
      <div id='place-backdrop-sec-info-right'>
        <h3>Similar Places</h3>
                 <div className='place-sec-info-recs'>
                  <h4>{localStorage.getItem(`suggestion0title`)}</h4>
                  <div className='place-sec-info-rating'>
                  <FontAwesomeIcon icon={faDiamond} /> <FontAwesomeIcon icon={faDiamond} /> <FontAwesomeIcon icon={faDiamond} /> <FontAwesomeIcon icon={faDiamond} /> {localStorage.getItem(`suggestion0rating`)}
                  </div>
                  <p>{localStorage.getItem(`suggestion0type`)} In {localStorage.getItem(`suggestion0area`)} | {localStorage.getItem(`suggestion0price`)}</p>
                  <div className='place-sec-info-recs-line'></div>
                </div>
        
      </div>
     </section>

     <section id='place-backdrop-reviews'>

      <h2>Reviews for {localStorage.getItem('title')}</h2>
      <div id='review-ratings-summary'>
       <div id='overall-rating'>
        <p>Overall Rating</p>
       <h1>{localStorage.getItem('rating')}</h1>
       </div>
       <div id='review-ratings-bars'>
       <div className='review-rating'>
        <p>5 Stars</p>
        <div className='rating-bar'>
          <div className='rating-bar-fill'></div>
        </div>
       </div>
       <div className='review-rating'>
       <p>4 Stars</p>
       <div className='rating-bar'>
       <div className='rating-bar-fill'></div>
       </div>
       </div>
       <div className='review-rating'>
       <p>3 Stars</p>
       <div className='rating-bar'>
       <div className='rating-bar-fill'></div>
       </div>
       </div>
       <div className='review-rating'>
       <p>2 Stars</p>
       <div className='rating-bar'>
       <div className='rating-bar-fill'></div>
       </div>
       </div>
       <div className='review-rating'>
       <p>1 Star</p>
       <div className='rating-bar'>
       <div className='rating-bar-fill'></div>
       </div>
       </div>
       </div>
      </div>

      <div id='review-filters'>
       <button>Sort By ▼</button>
       <button>Filter By Rating ▼</button>

       <button style={{backgroundColor: '#8a05ff', color: "white", border: "3px solid #8a05ff"}}>Write A Review</button>
      </div>
     </section>
    </>
  )
}

export default PlacePage