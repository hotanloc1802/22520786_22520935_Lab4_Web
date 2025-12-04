import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import VideoCard from './components/VideoCard';
import BottomNavbar from './components/BottomNavbar';
import TopNavbar from './components/TopNavbar';
import SharePopup from './components/SharePopup';

// This array holds information about different videos
// EXERCISE 1: Profile pictures have been changed to new URLs
const videoUrls = [
  {
    url: require('./videos/video1.mp4'),
    profilePic: 'https://i.pravatar.cc/150?img=1', // Changed profile picture
    username: 'csjackie',
    description: 'Lol nvm #compsci #chatgpt #ai #openai #techtok',
    song: 'Original sound - Famed Flames',
    likes: 430,
    comments: 13,
    saves: 23,
    shares: 1,
    uploadDate: '2024-01-15', // Added for UserInfoPanel
  },
  {
    url: require('./videos/video2.mp4'),
    profilePic: 'https://i.pravatar.cc/150?img=12', // Changed profile picture
    username: 'dailydotdev',
    description: 'Every developer brain @francesco.ciulla #developerjokes #programming #programminghumor #programmingmemes',
    song: 'tarawarolin wants you to know this isnt my sound - Chaplain J Rob',
    likes: '13.4K',
    comments: 3121,
    saves: 254,
    shares: 420,
    uploadDate: '2024-01-20', // Added for UserInfoPanel
  },
  {
    url: require('./videos/video3.mp4'),
    profilePic: 'https://i.pravatar.cc/150?img=33', // Changed profile picture
    username: 'wojciechtrefon',
    description: '#programming #softwareengineer #vscode #programmerhumor #programmingmemes',
    song: 'help so many people are using my sound - Ezra',
    likes: 5438,
    comments: 238,
    saves: 12,
    shares: 117,
    uploadDate: '2024-01-25', // Added for UserInfoPanel
  },
  {
    url: require('./videos/video4.mp4'),
    profilePic: 'https://i.pravatar.cc/150?img=47', // Changed profile picture
    username: 'faruktutkus',
    description: 'Wait for the end | Im RTX 4090 TI | #softwareengineer #softwareengineer #coding #codinglife #codingmemes ',
    song: 'orijinal ses - Computer Science',
    likes: 9689,
    comments: 230,
    saves: 1037,
    shares: 967,
    uploadDate: '2024-02-01', // Added for UserInfoPanel
  },
];

function App() {
  // Original state
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]);
  
  // EXERCISE 7: Search state - filter videos by hashtag
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVideos, setFilteredVideos] = useState([]);
  
  // EXERCISE 5: User panel visibility state
  const [userPanelVisible, setUserPanelVisible] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // EXERCISE 6: Share popup state
  const [sharePopupVisible, setSharePopupVisible] = useState(false);
  
  // Container ref for scroll detection
  const containerRef = useRef(null);

  // Initialize videos
  useEffect(() => {
    setVideos(videoUrls);
    setFilteredVideos(videoUrls);
  }, []);

  // EXERCISE 7: Filter videos based on search query (hashtag)
  useEffect(() => {
    if (!searchQuery.trim()) {
      // If no search query, show all videos
      setFilteredVideos(videos);
    } else {
      // Filter videos by hashtag in description
      const hashtag = searchQuery.trim().toLowerCase();
      // Remove # if user included it
      const cleanHashtag = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;
      
      const filtered = videos.filter(video => {
        // Check if description contains the hashtag
        const description = video.description.toLowerCase();
        return description.includes(`#${cleanHashtag}`) || description.includes(hashtag);
      });
      
      setFilteredVideos(filtered);
    }
  }, [searchQuery, videos]);

  // EXERCISE 5: Handle scroll to show/hide user panel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout;
    
    const handleScroll = () => {
      // Show panel when scrolling
      setUserPanelVisible(true);
      
      // Hide panel after scrolling stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setUserPanelVisible(false);
      }, 2000); // Hide after 2 seconds of no scrolling
    };

    container.addEventListener('scroll', handleScroll);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // EXERCISE 5: Handle right arrow key to toggle user panel
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') {
        setUserPanelVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // EXERCISE 3: Handle video navigation (for drag gesture)
  const handleNavigateVideo = (direction) => {
    if (direction === 'next' && currentVideoIndex < filteredVideos.length - 1) {
      const nextIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(nextIndex);
      // Scroll to next video
      scrollToVideo(nextIndex);
    } else if (direction === 'prev' && currentVideoIndex > 0) {
      const prevIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(prevIndex);
      // Scroll to previous video
      scrollToVideo(prevIndex);
    }
  };

  // Helper function to scroll to a specific video
  const scrollToVideo = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  // EXERCISE 7: Handle search from TopNavbar
  const handleSearch = (hashtag) => {
    setSearchQuery(hashtag);
    // Reset to first video when searching
    setCurrentVideoIndex(0);
  };

  // EXERCISE 6: Handle share button click
  const handleShareClick = () => {
    setSharePopupVisible(true);
  };

  // EXERCISE 6: Handle share popup close
  const handleShareClose = () => {
    setSharePopupVisible(false);
  };

  // Combined IntersectionObserver for play/pause and current video tracking
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.8, // Adjust this value to change the scroll trigger point
    };

    // This function handles the intersection of videos - play/pause and track current video
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const videoElement = entry.target;
          videoElement.play();
          
          // EXERCISE 5: Track current video index for user panel
          const videoIndex = videoRefs.current.findIndex(ref => ref === entry.target);
          if (videoIndex !== -1) {
            setCurrentVideoIndex(videoIndex);
          }
        } else {
          const videoElement = entry.target;
          videoElement.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // We observe each video reference to trigger play/pause and track current video
    // Filter out any null/undefined refs that haven't been set yet
    videoRefs.current.forEach((videoRef) => {
      if (videoRef) {
        observer.observe(videoRef);
      }
    });

    // We disconnect the observer when the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, [filteredVideos]); // Use filteredVideos instead of videos

  // This function handles the reference of each video
  const handleVideoRef = (index) => (ref) => {
    videoRefs.current[index] = ref;
  };

  return (
    <div className="app">
      <div className="container" ref={containerRef}>
        {/* EXERCISE 7: TopNavbar with search functionality */}
        <TopNavbar 
          className="top-navbar" 
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />
        
        {/* Map over filtered videos (EXERCISE 7: filtered by hashtag) */}
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video, index) => (
            <VideoCard
              key={`${video.username}-${index}`}
              username={video.username}
              description={video.description}
              song={video.song}
              likes={video.likes}
              saves={video.saves}
              comments={video.comments}
              shares={video.shares}
              url={video.url}
              profilePic={video.profilePic}
              uploadDate={video.uploadDate}
              setVideoRef={handleVideoRef(index)}
              autoplay={index === 0}
              videoIndex={index}
              onNavigateVideo={handleNavigateVideo}
              showUserPanel={userPanelVisible && index === currentVideoIndex}
              onShareClick={handleShareClick}
            />
          ))
        ) : (
          <div style={{ 
            color: '#fff', 
            textAlign: 'center', 
            padding: '50px 20px',
            fontSize: '16px'
          }}>
            No videos found matching "{searchQuery}"
          </div>
        )}
        
        <BottomNavbar className="bottom-navbar" />
      </div>
      
      {/* EXERCISE 6: Share Popup */}
      <SharePopup 
        isVisible={sharePopupVisible}
        onClose={handleShareClose}
      />
    </div>
  );
  
}

export default App;
