import React from 'react'
import HomeHeader from "./HomeHeader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPaperPlane,faStarOfLife, faDiamond } from "@fortawesome/free-solid-svg-icons";
import './styles/placepage.css'

function PlacePage() {

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
        <div>{
            Math.round(parseFloat(localStorage.getItem('rating')))
            }</div>
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
        <p>| Serving Beer & Cocktails</p>
        </div>

        <h5>Open11:00 AM - 11:00 PM</h5>
      </div>

      <div id='place-secondary-info'>
        <p>(305) 909-8223</p>
        <p>12161 SW 152nd St Miami, FL 33177</p>
      </div>

      <div id='msg-from-business'>
      <h2>Message From The Owners</h2>
      <div className='msg'>
        <h3>Ladies Night Thursday 7PM - 12AM</h3>
        <p>jnvojrnvpkfnvojefvoejfnvepnvjvnfepjvnepjnvpkernvpenvrnvojern</p>
      </div>
      </div>
     </section>
    </>
  )
}

export default PlacePage