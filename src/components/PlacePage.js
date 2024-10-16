import React, { useEffect, useRef, useState } from 'react'
import HomeHeader from "./HomeHeader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiamondTurnRight, faPhone,faBookmark, faDiamond, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "./contexts/AuthContext";
import './styles/placepage.css'
import Footer from './footer';
import { learnMoreAboutPlace, handleTripAdderPopup } from "./getPlaceInfo.mjs";

function PlacePage() {

  const { currentUser } = useAuth();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [hours, setHours] = useState([]);
  const [reviews, setReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [photo, setPhoto] = useState()
  const [reviewPosted, setReviewPosted] = useState(false)
  const [currDayHours, setCurrDayHours] = useState('')
  const [ratingChosen, setRatingChosen] = useState(false)


  const ratingFilterDropdown = useRef();
  const sortFilterDropdown = useRef();

  const fivestar = useRef();
  const fourstar = useRef();
  const threestar = useRef();
  const twostar = useRef();
  const onestar = useRef();

  const mapContainer = useRef();
  const choosingRating = useRef();
  const chooseRatingText = useRef();
  const reviewTextarea = useRef();
  const postReview = useRef();
  const writeReviewContainer = useRef();
  const writeAReviewBtn = useRef();

  useEffect(() => {

    mapContainer.current.appendChild(document.getElementById("google-map"))
    var map = window.map;
    map.panTo({lat: parseFloat(localStorage.getItem('lat')), lng: parseFloat(localStorage.getItem('lng'))})
    var marker = new window.google.maps.Marker({
      map: map,
      position: {lat: parseFloat(localStorage.getItem('lat')), lng: parseFloat(localStorage.getItem('lng'))},
    })

    marker.setMap(map)
    
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { placeId: localStorage.getItem("ID") },
      function (results, status) {
        if (status === window.google.maps.GeocoderStatus.OK) {
          const request = {
            placeId: localStorage.getItem("ID"),
            fields: ["reviews", "formatted_address", "opening_hours", "formatted_phone_number", "photo"],
          };

          var service = new window.google.maps.places.PlacesService(window.map);
          service.getDetails(request, function (place, status) {
            if (status == "OK") {
              for (let i = 1; i < 5; i++) {
              const photoUrl = place.photos[i].getUrl({ maxWidth: 400 });
              const imgElement = document.getElementById(`photo-img-${i}`);
              imgElement.src = photoUrl;
              }
              setAddress(place.formatted_address)
              setPhone(place.formatted_phone_number)
              const newHr = []
              for (let i = 0; i < place.opening_hours.weekday_text.length; i++) {
                newHr.push(String(place.opening_hours.weekday_text[i]).replace(':', '%'))

              }
              setHours(newHr)
              
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
              setFilteredReviews(list)
              // addressText.current.textContent = place.formatted_address;
              // for (let i = 0; i < place.reviews.length; i++) {
              //   renderReviews(place.reviews[i]);
              // }
            }
          });
        }
      }
    );

  }, [])

  useEffect(() => {

    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const today = new Date();
    const dayOfWeek = today.getDay(); 

    for (let i = 0; i < hours.length; i++) {
      const day = String(hours[i]).split(':')[0];
      if (daysOfWeek[dayOfWeek] == day) {
        setCurrDayHours(String(hours[i]))
      }
    }

  }, [hours])

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

      function matchKeyboardInput(e) {
        const value = e.target.value;
        const text = document.getElementsByClassName('review-text');
        const parentDiv = document.getElementsByClassName('user-review');

        for (let i = 0; i < text.length; i++) {

           if (String(text[i].textContent).toLocaleLowerCase().includes(String(value).toLocaleLowerCase())) {
               parentDiv[i].style.display = "block"
           } else {
               parentDiv[i].style.display = "none"
           }

        const paragraph = text[i].textContent;
        const wordToHighlight = e.target.value;
        const words = paragraph.split(' ');
        let highlightedHTML = '';
   
        words.forEach(word => {
        if (word === wordToHighlight) {
        highlightedHTML += `<span class="highlight">${word}</span> `;
        } else {
        highlightedHTML += `${word} `;
        }
        });
        paragraph.innerHTML = highlightedHTML;
        }
     }


     function filterRating(e, num) {
      if (e.target.checked === true) {
        for (let i = 0; i < document.getElementsByClassName('rating-filter-cb').length; i++) {
          document.getElementsByClassName('rating-filter-cb')[i].previousElementSibling.style.color = 'gray';
          document.getElementsByClassName("rating-filter-cb")[i].style.pointerEvents = 'none';
        }
        e.target.previousElementSibling.style.color = 'black'
        e.target.style.pointerEvents = 'all'
        const newReviews = reviews.filter(review => review.rating === num)
        setFilteredReviews(newReviews)
      } else {
        for (let i = 0; i < document.getElementsByClassName('rating-filter-cb').length; i++) {
          document.getElementsByClassName('rating-filter-cb')[i].previousElementSibling.style.color = 'black';
          document.getElementsByClassName("rating-filter-cb")[i].style.pointerEvents = 'all';
        }
        setFilteredReviews(reviews)
      }
     }


  return (
    <>
     <HomeHeader name={currentUser.name}/>
     <section id='place-backdrop'>
     
      <div id='place-basic-info'>
        <div id='place-basic-info-left'>
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

        <h5>{currDayHours}</h5>
        <div id='place-pg-btns'>
        <button onClick={(e) => handleTripAdderPopup(e)}>Add to Trip</button>
        <button onClick={(e) => {
          alert('This feature is coming soon!')
          // fetch("http://localhost:8080/updateFavorites", {
          //   method: 'POST',
          //   headers: {
          //   'Content-Type': 'application/json'
          //   },
          //   body: JSON.stringify({
          //     Operation: 'append',
          //     Item: localStorage.getItem('title')
          //   })
          // }).then(res => {
          //   if (res.ok) return res.json()
          // }).then(() => {
          //   e.target.style.backgroundColor = 'whitesmoke';
          //   e.target.style.color = 'black';
          //   e.target.textContent = ' Favorited';
          // }).catch(e => {
          //   console.error(e.error)
          // })

        }}><FontAwesomeIcon icon={faBookmark} 
        /> Save</button>
        </div>
        <div id='scroll-down-div'>
       <h3>Scroll Down</h3>
       <FontAwesomeIcon icon={faArrowDown} />
      </div>
      </div>
      <div id='place-basic-info-right'>
        <div>
          <div id='place-photos'>
          <img id='photo-img-1'></img>
          <div id='place-photos-middle'>
          <img id='photo-img-2'></img>
          <img id='photo-img-3'></img>
          </div>
          <img id='photo-img-4'></img>
          </div>
        </div>
      </div>
      </div>
     </section>

     <section id='place-backdrop-sec-info'>
      <div id='place-backdrop-sec-info-left'>
      <div id='msg-from-business' style={{display:'none'}}>
      <h2>Message From The Owners</h2>
      <div className='msg'>
        <h3>Ladies Night Thursday 7PM - 12AM</h3>
        <p>jnvojrnvpkfnvojefvoejfnvepnvjvnfepjvnepjnvpkernvpenvrnvojern</p>
      </div>
      </div>

      <h4 id='location-hours-text'>Location & Hours</h4>
      <div id='opening-hours-list'>
      
        <div id='map-and-directions'>
          <div id='map-dir-img' ref={mapContainer}></div>
          <p style={{fontWeight: 600}}><FontAwesomeIcon icon={faDiamondTurnRight} /> {address}</p>

        </div>
        
        <div id='hours-details'>
        {
          hours.map((item) => <div id='hrs-div'><p>{String(item).split('%')[0]}</p><p>{String(item).split('%')[1]}</p></div>)
        }
        </div>
      </div>
      <button className='get-dir' onClick={() => alert('This Feature is coming soon.')}>Get Directions</button>

      <div id='place-secondary-info'>
        <h4 style={{fontSize: '1.5rem', marginBottom: 0}}>Have Questions?</h4>
        <p><FontAwesomeIcon icon={faPhone} /> {phone}</p>
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
       <div id='sort-by-filter'>
       <button onClick={() => {
        if (sortFilterDropdown.current.style.display !== 'block') {
        sortFilterDropdown.current.style.display = 'block'
        } else {
        sortFilterDropdown.current.style.display = 'none'
        }
       }} style={window.innerWidth > 490 ? {width: '7rem'} : {width: '10rem'}}>Sort By ▼</button>
       <div id='sort-by-filter-dropdown' ref={sortFilterDropdown}>
       <li><p>Most Recent</p> <input type='checkbox' className='sort-filter-cb' 
       
       onClick={(e) => {
        const times = []
        const tempReviews = [...reviews]
        if (e.target.checked === true) {
        for (let i = 0; i < reviews.length; i++) {
          let timeNum = String(reviews[i].time).split(' ')[0]
            if (timeNum === 'a') {
              timeNum = '1'
            }
          if (String(reviews[i].time).split(' ')[1] === 'day' || String(reviews[i].time).split(' ')[1] === 'days') {
            times.push(Number(timeNum + '0'))
            tempReviews[i].timeSort = Number(timeNum + '0');
          } 
          if (String(reviews[i].time).split(' ')[1] === 'week' || String(reviews[i].time).split(' ')[1] === 'weeks') {
            times.push(Number(timeNum + '00'))
            tempReviews[i].timeSort = Number(timeNum + '00');
          } 
          if (String(reviews[i].time).split(' ')[1] === 'month' || String(reviews[i].time).split(' ')[1] === 'months') {
            times.push(Number(timeNum + '000'))
            tempReviews[i].timeSort = Number(timeNum + '000');
          } 
          if (String(reviews[i].time).split(' ')[1] === 'year' || String(reviews[i].time).split(' ')[1] === 'years') {
            times.push(Number(timeNum + '0000'))
            tempReviews[i].timeSort = Number(timeNum + '0000');
          } 
        }

        const results = tempReviews.sort((a, b) => a.timeSort - b.timeSort);
        setFilteredReviews(results)
        for (let i = 0; i < document.getElementsByClassName('sort-filter-cb').length; i++) {
          document.getElementsByClassName('sort-filter-cb')[i].previousElementSibling.style.color = 'gray';
          document.getElementsByClassName("sort-filter-cb")[i].style.pointerEvents = 'none';
        }
        e.target.previousElementSibling.style.color = 'black'
        e.target.style.pointerEvents = 'all'
      } else {
        setFilteredReviews(reviews)
        for (let i = 0; i < document.getElementsByClassName('sort-filter-cb').length; i++) {
          document.getElementsByClassName('sort-filter-cb')[i].previousElementSibling.style.color = 'black';
          document.getElementsByClassName("sort-filter-cb")[i].style.pointerEvents = 'all';
        }
      }
       }}

       /></li>
       <li><p>Highest Rated</p> <input type='checkbox' className='sort-filter-cb'

       onClick={(e) => {
        const tempReviews = [...reviews]
        if (e.target.checked === true) {
        const results = tempReviews.sort((a, b) => b.rating - a.rating);
        setFilteredReviews(results)

        for (let i = 0; i < document.getElementsByClassName('sort-filter-cb').length; i++) {
          document.getElementsByClassName('sort-filter-cb')[i].previousElementSibling.style.color = 'gray';
          document.getElementsByClassName("sort-filter-cb")[i].style.pointerEvents = 'none';
        }
        e.target.previousElementSibling.style.color = 'black'
        e.target.style.pointerEvents = 'all'
      } else {
        setFilteredReviews(reviews)
        for (let i = 0; i < document.getElementsByClassName('sort-filter-cb').length; i++) {
          document.getElementsByClassName('sort-filter-cb')[i].previousElementSibling.style.color = 'black';
          document.getElementsByClassName("sort-filter-cb")[i].style.pointerEvents = 'all';
        }
      }
       }}
       
       /></li>
       <li><p>Lowest Rated</p> <input type='checkbox' className='sort-filter-cb' onClick={(e) => {
        const tempReviews = [...reviews]
        if (e.target.checked === true) {
        const results = tempReviews.sort((a, b) => a.rating - b.rating);
        setFilteredReviews(results)

        for (let i = 0; i < document.getElementsByClassName('sort-filter-cb').length; i++) {
          document.getElementsByClassName('sort-filter-cb')[i].previousElementSibling.style.color = 'gray';
          document.getElementsByClassName("sort-filter-cb")[i].style.pointerEvents = 'none';
        }
        e.target.previousElementSibling.style.color = 'black'
        e.target.style.pointerEvents = 'all'
      } else {
        setFilteredReviews(reviews)
        for (let i = 0; i < document.getElementsByClassName('sort-filter-cb').length; i++) {
          document.getElementsByClassName('sort-filter-cb')[i].previousElementSibling.style.color = 'black';
          document.getElementsByClassName("sort-filter-cb")[i].style.pointerEvents = 'all';
        }
      }

       }}/></li>
       </div>
       </div>

       <div id='rating-filter'>
       <button onClick={() => {
        if (ratingFilterDropdown.current.style.display !== 'block') {
        ratingFilterDropdown.current.style.display = 'block'
        } else {
        ratingFilterDropdown.current.style.display = 'none'
        }
       }}>Filter By Rating ▼</button>
       <div id='rating-filter-dropdown' ref={ratingFilterDropdown}>
       <li><p>5 Star</p> <input type='checkbox' className='rating-filter-cb' onClick={(e) => filterRating(e, 5)}/></li>
       <li><p>4 Star</p> <input type='checkbox' className='rating-filter-cb' onClick={(e) => filterRating(e, 4)}/></li>
       <li><p>3 Star</p> <input type='checkbox' className='rating-filter-cb' onClick={(e) => filterRating(e, 3)}/></li>
       <li><p>2 Star</p> <input type='checkbox' className='rating-filter-cb' onClick={(e) => filterRating(e, 2)}/></li>
       <li><p>1 Star</p> <input type='checkbox' className='rating-filter-cb' onClick={(e) => filterRating(e, 1)}/></li>
       </div>
       </div>

       <button style={{backgroundColor: '#8a05ff', color: "white", border: "3px solid #8a05ff"}}
       onClick={(e) => {
            if (e.target.textContent === 'Cancel Review') {
              writeReviewContainer.current.style.display = 'none';
              if (!reviewPosted) {
              e.target.textContent = 'Write A Review'
              } else {
              e.target.textContent = 'Edit Review'
              }
            } else {
              writeReviewContainer.current.style.display = 'flex';
              e.target.textContent = 'Cancel Review'
              setRatingChosen(false)
            }
       }} ref={writeAReviewBtn}>Write A Review</button>
      </div>

      <div id='keyword-filter' style={{display: 'none'}}>
        <h5>Filter By Keywords</h5>
        <input placeholder='Type Keyword(s)... e.g.: service, best, crowded, etc' onKeyUp={(e) => {
          matchKeyboardInput(e)
        }}></input>
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
            setReviewPosted(true)
          } else {
            document.getElementById('my-review').childNodes[5].textContent = reviewTextarea.current.value;
            document.getElementById('my-rating').textContent = `${'◆'.repeat(parseInt(user_rating))} ${user_rating}/5`
            writeReviewContainer.current.style.display = 'none';
          }
        }}>Post Review</button>

        </div>
        <div id='user-review-section'>
        {
            filteredReviews.map((review) => <div className='user-review'>
              <h5>{review.author} | {review.time}</h5>
              <h4 className='review-rating' rating={review.rating}>{`◆`.repeat(Math.round(parseInt(review.rating)))} {review.rating}/5</h4>
              <p className='review-text'>{review.text}</p>
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