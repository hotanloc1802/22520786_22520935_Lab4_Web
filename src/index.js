import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Initialize FontAwesome library - required for FontAwesome icons to work
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faTv, faSearch, faHouse, faUserFriends, faPlus, 
  faInbox, faUser, faMusic, faCirclePlus, faCircleCheck, 
  faHeart, faCommentDots, faBookmark, faShare, faVolumeHigh,
  faVolumeXmark, faXmark, faArrowRight
} from '@fortawesome/free-solid-svg-icons';
// Import brand icons for social media
import { faFacebook, faInstagram, faThreads } from '@fortawesome/free-brands-svg-icons';

// Add all icons to the library so they can be used throughout the app
library.add(
  faTv, faSearch, faHouse, faUserFriends, faPlus, 
  faInbox, faUser, faMusic, faCirclePlus, faCircleCheck, 
  faHeart, faCommentDots, faBookmark, faShare, faVolumeHigh,
  faVolumeXmark, faXmark, faArrowRight, faFacebook, faInstagram, faThreads
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
