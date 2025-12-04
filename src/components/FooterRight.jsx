import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCircleCheck, faHeart, faCommentDots, faBookmark, faShare, faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import './FooterRight.css';

/**
 * EXERCISE 2: Added MUTE/UNMUTE button
 * EXERCISE 4: Added clipboard copy functionality to SAVE button
 */
function FooterRight({ likes, comments, saves, shares, profilePic, videoRef, videoUrl, onShareClick }) {
  // State for interactive buttons (like, save, follow)
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // EXERCISE 2: State for mute/unmute functionality
  const [isMuted, setIsMuted] = useState(true); // Videos start muted by default

  // EXERCISE 2: Toggle mute/unmute for the video
  const handleMuteToggle = () => {
    if (videoRef && videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // EXERCISE 4: Handle save button click - copy video URL to clipboard
  const handleSaveClick = async () => {
    setIsSaved(!isSaved);
    
    // Copy video URL to clipboard
    try {
      // Use the videoUrl prop passed from VideoCard, or fallback to current page URL
      const urlToCopy = videoUrl || window.location.href;
      await navigator.clipboard.writeText(urlToCopy);
      console.log('Video URL copied to clipboard:', urlToCopy);
      
      // Show feedback (optional - could add a toast notification)
      alert('Video URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL to clipboard:', err);
      // Fallback for older browsers
      const urlToCopy = videoUrl || window.location.href;
      const textArea = document.createElement('textarea');
      textArea.value = urlToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Video URL copied to clipboard!');
    }
  };

  return (
    <div className="footer-right">
      <div className="sidebar-icon">
        {/* Profile picture with follow button */}
        <div className="userprofile">
          <img 
            src={profilePic} 
            alt={profilePic} 
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
        </div>
        
        {/* Follow button */}
        <div className="useradd" onClick={() => setIsFollowing(!isFollowing)}>
          <FontAwesomeIcon 
            icon={isFollowing ? "circle-check" : "circle-plus"} 
            style={{ color: isFollowing ? '#fff' : '#000', fontSize: '20px' }}
          />
        </div>
        
        {/* EXERCISE 2: MUTE/UNMUTE button */}
        <div onClick={handleMuteToggle} style={{ cursor: 'pointer', marginBottom: '15px' }}>
          <FontAwesomeIcon 
            icon={isMuted ? "volume-xmark" : "volume-high"} 
            style={{ 
              color: '#fff', 
              fontSize: '30px',
              cursor: 'pointer'
            }} 
          />
          <p style={{ fontSize: '12px', marginTop: '5px' }}>
            {isMuted ? 'Unmute' : 'Mute'}
          </p>
        </div>
        
        {/* Like button with count */}
        <div onClick={() => setIsLiked(!isLiked)}>
          <FontAwesomeIcon 
            icon="heart" 
            style={{ 
              color: isLiked ? '#ff3040' : '#fff', 
              fontSize: '30px',
              cursor: 'pointer'
            }} 
          />
          <p>{likes}</p>
        </div>
        
        {/* Comment button with count */}
        <div>
          <FontAwesomeIcon icon="comment-dots" style={{ fontSize: '30px', cursor: 'pointer' }} />
          <p>{comments}</p>
        </div>
        
        {/* EXERCISE 4: Save button with count - copies URL to clipboard */}
        <div onClick={handleSaveClick}>
          <FontAwesomeIcon 
            icon="bookmark" 
            style={{ 
              color: isSaved ? '#fff' : '#fff', 
              fontSize: '30px',
              cursor: 'pointer'
            }} 
          />
          <p>{saves}</p>
        </div>
        
        {/* Share button with count - opens share popup */}
        <div onClick={onShareClick}>
          <FontAwesomeIcon icon="share" style={{ fontSize: '30px', cursor: 'pointer' }} />
          <p>{shares}</p>
        </div>
        
        {/* Spinning record icon */}
        <div className="record">
          <img 
            src="https://static.thenounproject.com/png/934821-200.png" 
            alt="record"
          />
        </div>
      </div>
    </div>
  );
}

export default FooterRight;
