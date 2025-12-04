import React from 'react';
import './UserInfoPanel.css';

/**
 * EXERCISE 5: User Information Panel Component
 * 
 * This component displays detailed video information including:
 * - Username
 * - Description
 * - Song name
 * - Likes count
 * - Upload date
 * 
 * It appears when:
 * - User scrolls (triggered by parent)
 * - User presses right arrow key (triggered by parent)
 * 
 * The panel overlays the video on the right side.
 */
export default function UserInfoPanel({ 
  username, 
  description, 
  song, 
  likes, 
  uploadDate,
  isVisible 
}) {
  // Format the upload date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div className="user-info-panel">
      <div className="user-info-content">
        <h3 className="info-title">Video Information</h3>
        
        <div className="info-section">
          <span className="info-label">Username:</span>
          <span className="info-value">@{username}</span>
        </div>
        
        <div className="info-section">
          <span className="info-label">Description:</span>
          <p className="info-value description-text">{description}</p>
        </div>
        
        <div className="info-section">
          <span className="info-label">Song:</span>
          <span className="info-value">{song}</span>
        </div>
        
        <div className="info-section">
          <span className="info-label">Likes:</span>
          <span className="info-value">{likes}</span>
        </div>
        
        <div className="info-section">
          <span className="info-label">Upload Date:</span>
          <span className="info-value">{formatDate(uploadDate)}</span>
        </div>
      </div>
    </div>
  );
}

