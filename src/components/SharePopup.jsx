import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SharePopup.css';

/**
 * EXERCISE 6: Share Popup Component
 * 
 * This component displays a popup with social media sharing options:
 * - Facebook icon
 * - Instagram icon
 * - Threads icon
 * 
 * Features:
 * - Close (X) button to dismiss the popup
 * - Overlay background that closes popup when clicked
 * - Only displays icons (no actual sharing functionality required)
 */
export default function SharePopup({ isVisible, onClose }) {
  // Don't render if not visible
  if (!isVisible) return null;

  // Handle overlay click to close popup
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle social icon click (display only, no actual sharing)
  const handleSocialClick = (platform) => {
    console.log(`Share to ${platform} clicked (display only)`);
    // No actual sharing implementation required per exercise
  };

  return (
    <div className="share-popup-overlay" onClick={handleOverlayClick}>
      <div className="share-popup-content">
        {/* Close button */}
        <button className="share-popup-close" onClick={onClose}>
          <FontAwesomeIcon icon="xmark" />
        </button>
        
        <h3 className="share-popup-title">Share Video</h3>
        
        <div className="share-icons-container">
          {/* Facebook icon */}
          <div 
            className="share-icon-item" 
            onClick={() => handleSocialClick('Facebook')}
          >
            <FontAwesomeIcon icon={['fab', 'facebook']} className="share-icon facebook-icon" />
            <span className="share-icon-label">Facebook</span>
          </div>
          
          {/* Instagram icon */}
          <div 
            className="share-icon-item" 
            onClick={() => handleSocialClick('Instagram')}
          >
            <FontAwesomeIcon icon={['fab', 'instagram']} className="share-icon instagram-icon" />
            <span className="share-icon-label">Instagram</span>
          </div>
          
          {/* Threads icon */}
          <div 
            className="share-icon-item" 
            onClick={() => handleSocialClick('Threads')}
          >
            <FontAwesomeIcon icon={['fab', 'threads']} className="share-icon threads-icon" />
            <span className="share-icon-label">Threads</span>
          </div>
        </div>
      </div>
    </div>
  );
}

