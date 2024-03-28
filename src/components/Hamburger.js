import React, { useRef, useState, useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHouse, faX } from "@fortawesome/free-solid-svg-icons";
import "./styles/Navbar.css"
import { Link } from "react-router-dom";
import { useAuth } from './contexts/AuthContext'

function Hamburger () {
    const { currentUser, info, logout } = useAuth();
    const user = currentUser;
    async function handleLogout() {
        try {
          await logout()
        } catch {
          alert('Failed to log out')
        }
      }

      const [firstname, setFirstname] = useState('')

useEffect(() => {
  if (user) {
  setTimeout(() => {
    setFirstname(info.name)
  }, 2500)
}
})

const sideBar = useRef()

function changeWidth(e) {
    e.target.nextElementSibling.style.right =  0
    if (window.innerWidth <= 710) {
        e.target.nextElementSibling.style.width = '25vw'
    }
    if (window.innerWidth <= 557) {
        e.target.nextElementSibling.style.width = '30vw'
    }
    if (window.innerWidth <= 467) {
        e.target.nextElementSibling.style.width = '35vw'
    }
    if (window.innerWidth <= 404) {
        e.target.nextElementSibling.style.width = '40vw'
    }
    if (window.innerWidth <= 354) {
        e.target.nextElementSibling.style.width = '45vw'
    }
    if (window.innerWidth <= 311) {
        e.target.nextElementSibling.style.width = '50vw'
    }
    if (window.innerWidth <= 276) {
        e.target.nextElementSibling.style.width = '55vw'
    }
}


  return (
    <>
    <button onClick={(e) => changeWidth(e)} id={window.location.href.includes('/Home') ? 'home-hamburger' : 'hamburger'}><FontAwesomeIcon icon={faBars} /></button>
    <div id='sideBar' ref={sideBar}>
        <ul>
            <li>
            <button onClick={() => sideBar.current.style.right = '-50%'} id='mobile-XOUT'><FontAwesomeIcon icon={faX} /></button>
            {user ? <div id="mobile-user-name"><p>Hello, {firstname} 👋</p>
            <button id="mobile-trips-btn" value="My Trips">
            <Link to="/Home">Home&nbsp;&nbsp;<FontAwesomeIcon icon={faHouse} /></Link></button>
            <button id='mobile-logout' onClick={() => handleLogout()}><Link to="/login">Log Out</Link></button></div> 
            : <div>
            <button id="header-login">
             LOG IN 
            </button>
            <button id="header-signup">
             SIGN UP
            </button>
            </div>}
            </li>
        </ul>
    </div>
    </>
  )
}

export default Hamburger