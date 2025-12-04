import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTv, faSearch } from '@fortawesome/free-solid-svg-icons';
import './TopNavbar.css';

/**
 * EXERCISE 7: Search Feature Component
 * 
 * Features:
 * - Click search icon to open search input
 * - Enter hashtag and press Enter to filter videos
 * - Only displays videos matching the hashtag
 */
const TopNavbar = ({ onSearch, searchQuery }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery || '');

  // Handle search icon click - toggle search input
  const handleSearchIconClick = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus on input when opening
      setTimeout(() => {
        const input = document.getElementById('hashtag-search-input');
        if (input) input.focus();
      }, 100);
    } else {
      // Clear search when closing
      setInputValue('');
      if (onSearch) onSearch('');
    }
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const hashtag = inputValue.trim();
      if (onSearch) {
        onSearch(hashtag);
      }
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="top-navbar">
      {/* TikTok logo/branding section */}
      <FontAwesomeIcon icon="tv" className="icon" />
      
      {!isSearchOpen ? (
        <h2>
          Following <span>For You</span>
        </h2>
      ) : (
        <div className="search-input-container">
          <input
            id="hashtag-search-input"
            type="text"
            className="hashtag-search-input"
            placeholder="Enter hashtag (e.g., #programming)"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </div>
      )}
      
      {/* EXERCISE 7: Search icon - click to open/close search */}
      <FontAwesomeIcon 
        icon="search" 
        className="icon" 
        onClick={handleSearchIconClick}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
};

export default TopNavbar;
