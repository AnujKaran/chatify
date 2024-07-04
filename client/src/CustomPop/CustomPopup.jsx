import React, { useState, useEffect } from 'react';
import './CustomPopup.css'
const CustomPopup = ({ callerName, onClose, autoCloseTime , setPopupVisible ,onAcceptPopup}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
    //   onClose('timeout');
    setPopupVisible(false)
    }, autoCloseTime);

    // Clear the timer when the component is unmounted or when the popup is closed
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='overlay'>
      <div className='popup'>
        <p>Incoming video call from {callerName}</p>
        <button onClick={()=>onAcceptPopup()}>Accept</button>
        <button onClick={()=>setPopupVisible(false)} >Reject</button>
      </div>
    </div>
  );
};
export default CustomPopup
