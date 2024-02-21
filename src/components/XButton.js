import React, { useRef, useState, useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPlaneDeparture, faX } from "@fortawesome/free-solid-svg-icons";
import "./styles/xBtn.css"
import { Link } from "react-router-dom";
import { useAuth } from './contexts/AuthContext'

function XButton () {

  const xOutBtn = useRef();

  function xOut(parent) {
    parent.style.display = 'none';
  }

  return (
    <>
    <div ref={xOutBtn} id='XButtonComponent' onClick={() => xOut(xOutBtn.current.parentNode)}><FontAwesomeIcon icon={faX} /></div>
    </>
  )
}

export default XButton
