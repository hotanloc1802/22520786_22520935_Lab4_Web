import React, { useRef, useEffect, useState } from 'react';
import FooterLeft from './FooterLeft';
import FooterRight from './FooterRight';
import UserInfoPanel from './UserInfoPanel';
import './VideoCard.css';

/**
 * EXERCISE 3: Added drag gesture navigation
 * EXERCISE 5: Added UserInfoPanel integration
 */
const VideoCard = (props) => {
  // Destructure props to access video data
  const { 
    url, profilePic, username, description, song, likes, comments, saves, shares, 
    setVideoRef, autoplay, uploadDate, videoIndex, onNavigateVideo, 
    showUserPanel, onShareClick 
  } = props;
  
  // Create a ref for the video element
  const videoRef = useRef(null);
  
  // EXERCISE 3: State for drag gesture tracking
  const [dragStart, setDragStart] = useState({ y: 0, time: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Callback ref to set the video element reference for IntersectionObserver
  // This ensures the ref is passed to the parent component as soon as the video element is mounted
  const setRef = (element) => {
    videoRef.current = element;
    if (setVideoRef) {
      setVideoRef(element);
    }
  };

  // Handle video autoplay for the first video
  useEffect(() => {
    if (autoplay && videoRef.current) {
      videoRef.current.play().catch(err => {
        // Autoplay may be blocked by browser, this is expected behavior
        console.log('Autoplay prevented:', err);
      });
    }
  }, [autoplay]);

  // EXERCISE 3: Handle mouse down - start tracking drag gesture
  const handleMouseDown = (e) => {
    setDragStart({ y: e.clientY, time: Date.now() });
    setIsDragging(true);
  };

  // EXERCISE 3: Handle mouse move during drag
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaY = e.clientY - dragStart.y;
    const dragThreshold = 50; // Minimum pixels to trigger navigation
    
    // If user drags up (negative deltaY), go to next video
    if (deltaY < -dragThreshold && onNavigateVideo) {
      onNavigateVideo('next');
      setIsDragging(false);
    }
    // If user drags down (positive deltaY), go to previous video
    else if (deltaY > dragThreshold && onNavigateVideo) {
      onNavigateVideo('prev');
      setIsDragging(false);
    }
  };

  // EXERCISE 3: Handle mouse up - end drag gesture
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // EXERCISE 3: Handle mouse leave - end drag gesture if mouse leaves element
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Get video URL for clipboard copy
  // Use the video element's src if available, otherwise use the url prop or current page URL
  const getVideoUrl = () => {
    if (videoRef.current && videoRef.current.src) {
      return videoRef.current.src;
    }
    // Fallback to current page URL for clipboard copy
    return window.location.href;
  };

  return (
    <div 
      className="video"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none' }}
    >
      {/* Video player element */}
      <video
        ref={setRef}
        className="player"
        loop
        muted
        playsInline
        src={url}
      />
      
      {/* Bottom controls container with footer components */}
      <div className="bottom-controls">
        {/* Left footer with username, description, and song */}
        <FooterLeft 
          username={username}
          description={description}
          song={song}
        />
        
        {/* Right footer with interactive buttons */}
        <FooterRight
          likes={likes}
          comments={comments}
          saves={saves}
          shares={shares}
          profilePic={profilePic}
          videoRef={videoRef}
          videoUrl={getVideoUrl()}
          onShareClick={onShareClick}
        />
      </div>
      
      {/* EXERCISE 5: User Information Panel - appears on scroll or right arrow key */}
      <UserInfoPanel
        username={username}
        description={description}
        song={song}
        likes={likes}
        uploadDate={uploadDate}
        isVisible={showUserPanel}
      />
    </div>
  );
};

export default VideoCard;
