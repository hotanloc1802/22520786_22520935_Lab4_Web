import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUserFriends, faPlus, faInbox, faUser } from '@fortawesome/free-solid-svg-icons';

function BottomNavbar() {
  return (
    <div className="bottom-navbar">
      {/* Home icon - active by default */}
      <div className="nav-item">
        <FontAwesomeIcon icon="house" className="icon active" />
        <span className="item-name">Home</span>
      </div>
      
      {/* Friends icon */}
      <div className="nav-item">
        <FontAwesomeIcon icon="user-friends" className="icon" />
        <span className="item-name">Friends</span>
      </div>
      
      {/* Plus icon with special styling */}
      <div className="nav-item">
        <FontAwesomeIcon icon="plus" className="icon plus" />
      </div>
      
      {/* Inbox icon with notification badge */}
      <div className="nav-item">
        <FontAwesomeIcon icon="inbox" className="icon" />
        <span className="item-name">Inbox</span>
        <span className="notification">5</span>
      </div>
      
      {/* Profile icon */}
      <div className="nav-item">
        <FontAwesomeIcon icon="user" className="icon" />
        <span className="item-name">Profile</span>
      </div>
    </div>
  );
}

export default BottomNavbar;
