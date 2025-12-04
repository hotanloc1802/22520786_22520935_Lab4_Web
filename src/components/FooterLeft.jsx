import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import './FooterLeft.css';

export default function FooterLeft(props) {
  const { username, description, song } = props;

  return (
    <div className="footer-container">
      <div className="footer-left">
        {/* Text content section */}
        <div className="text">
          {/* Username */}
          <h3>@{username}</h3>
          
          {/* Description */}
          <p>{description}</p>
          
          {/* Song name with music icon - using marquee for scrolling effect */}
          <div className="ticker">
            <FontAwesomeIcon icon="music" style={{ marginRight: '5px' }} />
            <marquee direction="left" scrollamount="2">
              {song}
            </marquee>
          </div>
        </div>
      </div>
    </div>
  );
}
