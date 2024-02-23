import React, { useRef } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import "./styles/xBtn.css"

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
