import React, { Component } from 'react';
// import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
// import { star} from "@fortawesome/free-solid-svg-icons"
// import "./Star.css";

function Star() {
    return (
    <div className='star'>
      <FontAwesomeIcon icon={faStar} style={{fontSize: '40px', marginRight: '7px'}}/>
      {/* <FontAwesomeIcon icon={Star} style={{fontSize: '50px'}}/> */}

    </div>
    ) 
  }


export default Star