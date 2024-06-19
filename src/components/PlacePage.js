import React, { useEffect, useRef, useState } from 'react'
import HomeHeader from "./HomeHeader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiamondTurnRight, faPhone,faBookmark, faDiamond } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "./contexts/AuthContext";
import './styles/placepage.css'
import Footer from './footer';

function PlacePage() {

  const { currentUser } = useAuth();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [hours, setHours] = useState([]);
  const [reviews, setReviews] = useState([])
  const [ratingChosen, setRatingChosen] = useState(false)

  const fivestar = useRef();
  const fourstar = useRef();
  const threestar = useRef();
  const twostar = useRef();
  const onestar = useRef();

  const choosingRating = useRef();
  const chooseRatingText = useRef();
  const reviewTextarea = useRef();
  const postReview = useRef();
  const writeReviewContainer = useRef();
  const writeAReviewBtn = useRef();

  useEffect(() => {
    
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { placeId: localStorage.getItem("ID") },
      function (results, status) {
        if (status === window.google.maps.GeocoderStatus.OK) {
          const request = {
            placeId: localStorage.getItem("ID"),
            fields: ["reviews", "formatted_address", "opening_hours", "formatted_phone_number"],
          };

          var service = new window.google.maps.places.PlacesService(window.map);
          service.getDetails(request, function (place, status) {
            if (status == "OK") {
              setAddress(place.formatted_address)
              setPhone(place.formatted_phone_number)
              setHours(place.opening_hours.weekday_text)
              let list = []
              for (let i = 0; i < place.reviews.length; i++) {
                list.push({
                  author: place.reviews[i].author_name,
                  time: place.reviews[i].relative_time_description,
                  rating: place.reviews[i].rating,
                  text: place.reviews[i].text
                })
              }
              setReviews(list)
              // addressText.current.textContent = place.formatted_address;
              // for (let i = 0; i < place.reviews.length; i++) {
              //   renderReviews(place.reviews[i]);
              // }
            }
          });
        }
      }
    );

    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];

    const today = new Date();
    const dayOfWeek = today.getDay(); 


  }, [])

  useEffect(() => {
     let five = 0;
     let four = 0;
     let three = 0;
     let two = 0;
     let one = 0;
     for (let i = 0; i < reviews.length; i++) {
      switch (reviews[i].rating) {
        case 5:
          five++;
          break;
        case 4:
          four++;
          break;
        case 3:
          three++;
          break;
        case 2:
          two++;
          break;
        case 1:
          one++;
          break;
      }
     }

     fivestar.current.style.width = `${(five/reviews.length) * 100}%`
     fourstar.current.style.width = `${(four/reviews.length) * 100}%`
     threestar.current.style.width = `${(three/reviews.length) * 100}%`
     twostar.current.style.width = `${(two/reviews.length) * 100}%`
     onestar.current.style.width = `${(one/reviews.length) * 100}%`

  }, [reviews])

    const priceLS = localStorage.getItem("price");
    const priceStyles = {
        1: { color: priceLS >= 1 ? "black" : "lightgray" },
        2: { color: priceLS >= 2 ? "black" : "lightgray" },
        3: { color: priceLS >= 3 ? "black" : "lightgray" },
        4: { color: priceLS >= 4 ? "black" : "lightgray" },
      };
  return (
    <>
     <HomeHeader name={currentUser.name}/>
     <section id='place-backdrop'>
      <div id='place-basic-info'>
        <h2>{localStorage.getItem('title')}</h2>
        <div id='place-basic-rating'>
             <h4>{`◆`.repeat(localStorage.getItem('rating'))}</h4> <p>{localStorage.getItem('rating')}</p>
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
        <p><FontAwesomeIcon icon={faPhone} /> {phone}</p>
        <p><FontAwesomeIcon icon={faDiamondTurnRight} /> {address}</p>
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
        {
          hours.map((item) => <p>{item}</p>)
        }
      </div>
      </div>
      <div id='place-backdrop-sec-info-right'>
        <h3>Similar Places</h3>
        { localStorage.getItem('suggestion0title') ?
                 <div className='place-sec-info-recs'>
                  <h4>{localStorage.getItem(`suggestion0title`)}</h4>
                  <div className='place-sec-info-rating'>
                   <FontAwesomeIcon icon={faDiamond} /> {localStorage.getItem(`suggestion0rating`)}
                  </div>
                  <p>{localStorage.getItem(`suggestion0type`)} In {localStorage.getItem(`suggestion0area`)} | {localStorage.getItem(`suggestion0price`)}</p>
                  <div className='place-sec-info-recs-line'></div>
                </div>
                : null
        }
        { localStorage.getItem('suggestion1title') ?
                 <div className='place-sec-info-recs'>
                  <h4>{localStorage.getItem(`suggestion1title`)}</h4>
                  <div className='place-sec-info-rating'>
                   <FontAwesomeIcon icon={faDiamond} /> {localStorage.getItem(`suggestion1rating`)}
                  </div>
                  <p>{localStorage.getItem(`suggestion1type`)} In {localStorage.getItem(`suggestion1area`)} | {localStorage.getItem(`suggestion1price`)}</p>
                  <div className='place-sec-info-recs-line'></div>
                </div>
                : null
        }
        { localStorage.getItem('suggestion2title') ?
                 <div className='place-sec-info-recs'>
                  <h4>{localStorage.getItem(`suggestion2title`)}</h4>
                  <div className='place-sec-info-rating'>
                   <FontAwesomeIcon icon={faDiamond} /> {localStorage.getItem(`suggestion2rating`)}
                  </div>
                  <p>{localStorage.getItem(`suggestion2type`)} In {localStorage.getItem(`suggestion2area`)} | {localStorage.getItem(`suggestion2price`)}</p>
                  <div className='place-sec-info-recs-line'></div>
                </div>
                : null
        }
        { localStorage.getItem('suggestion3title') ?
                 <div className='place-sec-info-recs'>
                  <h4>{localStorage.getItem(`suggestion3title`)}</h4>
                  <div className='place-sec-info-rating'>
                   <FontAwesomeIcon icon={faDiamond} /> {localStorage.getItem(`suggestion3rating`)}
                  </div>
                  <p>{localStorage.getItem(`suggestion3type`)} In {localStorage.getItem(`suggestion3area`)} | {localStorage.getItem(`suggestion3price`)}</p>
                  <div className='place-sec-info-recs-line'></div>
                </div>
                : null
        }
        { localStorage.getItem('suggestion4title') ?
                 <div className='place-sec-info-recs'>
                  <h4>{localStorage.getItem(`suggestion4title`)}</h4>
                  <div className='place-sec-info-rating'>
                   <FontAwesomeIcon icon={faDiamond} /> {localStorage.getItem(`suggestion4rating`)}
                  </div>
                  <p>{localStorage.getItem(`suggestion4type`)} In {localStorage.getItem(`suggestion4area`)} | {localStorage.getItem(`suggestion4price`)}</p>
                  <div className='place-sec-info-recs-line'></div>
                </div>
                : null
        }
        
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
          <div className='rating-bar-fill' ref={fivestar}></div>
        </div>
       </div>
       <div className='review-rating'>
       <p>4 Stars</p>
       <div className='rating-bar'>
       <div className='rating-bar-fill' ref={fourstar}></div>
       </div>
       </div>
       <div className='review-rating'>
       <p>3 Stars</p>
       <div className='rating-bar'>
       <div className='rating-bar-fill' ref={threestar}></div>
       </div>
       </div>
       <div className='review-rating'>
       <p>2 Stars</p>
       <div className='rating-bar'>
       <div className='rating-bar-fill' ref={twostar}></div>
       </div>
       </div>
       <div className='review-rating'>
       <p>1 Star</p>
       <div className='rating-bar'>
       <div className='rating-bar-fill' ref={onestar}></div>
       </div>
       </div>
       </div>
      </div>

      <div id='review-filters'>
       <button>Sort By ▼</button>
       <button>Filter By Rating ▼</button>

       <button style={{backgroundColor: '#8a05ff', color: "white", border: "3px solid #8a05ff"}}
       onClick={(e) => {
          writeReviewContainer.current.style.display = 'flex';
            setRatingChosen(false)
       }} ref={writeAReviewBtn}>Write A Review</button>
      </div>

      <div id='list-of-reviews'>
        <div id='write-review-container' ref={writeReviewContainer}>
        <h4>Your Review</h4>
        <div id='choose-rating'>
        <div ref={choosingRating}
        onClick={(e) => {
          if (!ratingChosen) {
          if (e.target.tagName === 'svg') {
          const rating = e.target.getAttribute('number')
          chooseRatingText.current.textContent = `${rating}/5`;
          e.target.style.color = '#8a05ff'
          for (let i = 0; i < rating - 1; i++) {
              choosingRating.current.childNodes[i].style.color = '#8a05ff'
          }
          }
          setRatingChosen(true)
          if (reviewTextarea.current.value.length > 10) {
          postReview.current.style.pointerEvents = 'all';
          postReview.current.style.backgroundColor = '#8a05ff';
          postReview.current.style.color = 'white'
        }
        }
        }}
         onMouseOver={(e) => {
          if (!ratingChosen) {
          if(e.target.tagName === 'svg') {
            const index = Array.from(choosingRating.current.children).indexOf(e.target);
            for (let i = 0; i < 5; i++) {
              if (Array.from(choosingRating.current.children).indexOf(choosingRating.current.childNodes[i]) <= index) {
                choosingRating.current.childNodes[i].style.color = 'black'
              } else {
                choosingRating.current.childNodes[i].style.color = '#EAEAEA'
              }
            }
          }
        }
        }} onMouseLeave={() => {
          if (!ratingChosen) {
          for (let i = 0; i < 5; i++) {
              choosingRating.current.childNodes[i].style.color = '#EAEAEA';
          }
        }
        }}
      >
        <FontAwesomeIcon icon={faDiamond} number={1} /><FontAwesomeIcon icon={faDiamond} number={2} /><FontAwesomeIcon icon={faDiamond} number={3} /><FontAwesomeIcon icon={faDiamond} number={4} /><FontAwesomeIcon icon={faDiamond} number={5} />
        </div>
        <p ref={chooseRatingText}>Choose Your Rating</p>
        
        </div>
        
        <textarea ref={reviewTextarea} rows="8" cols="100" id='review-textarea' placeholder='What Did You Think About This Place?'
        onKeyUp={(e) => {
          if (e.target.value.length > 10 && chooseRatingText.current.textContent !== 'Choose Your Rating') {
          postReview.current.style.pointerEvents = 'all';
          postReview.current.style.backgroundColor = '#8a05ff';
          postReview.current.style.color = 'white'
          } else {
          postReview.current.style.pointerEvents = 'none';
          postReview.current.style.backgroundColor = '#EAEAEA';
          postReview.current.style.color = 'black'
          }
        }}/>

        <button ref={postReview} onClick={() => {
          const user_rating = String(chooseRatingText.current.textContent).split('/')[0]
          if (writeAReviewBtn.current.textContent !== 'Edit Review') {
          const fragment = document.createElement('div');
          fragment.innerHTML = `<div className='user-review' id='my-review'>
              <h5>${currentUser.name} | Today</h5>
              <h4 className='review-rating' id='my-rating' rating=${chooseRatingText.current.textContent}>${'◆'.repeat(parseInt(user_rating))} ${user_rating}/5</h4>
              <p>${reviewTextarea.current.value}</p>
            </div>`
            document.getElementById('user-review-section').prepend(fragment)
            writeReviewContainer.current.style.display = 'none';
            writeAReviewBtn.current.textContent = 'Edit Review';
          } else {
            document.getElementById('my-review').childNodes[5].textContent = reviewTextarea.current.value;
            document.getElementById('my-rating').textContent = `${'◆'.repeat(parseInt(user_rating))} ${user_rating}/5`
            writeReviewContainer.current.style.display = 'none';
          }
        }}>Post Review</button>

        </div>
        <div id='user-review-section'>
        {
            reviews.map((review) => <div className='user-review'>
              <h5>{review.author} | {review.time}</h5>
              <h4 className='review-rating' rating={review.rating}>{`◆`.repeat(Math.round(parseInt(review.rating)))} {review.rating}/5</h4>
              <p>{review.text}</p>
            </div>)
        }
        </div>
      </div>
     </section>
     <Footer/>
    </>
  )
}

export default PlacePage