import '@fontsource/inter';
import '@fontsource/plus-jakarta-sans';
import '@fontsource/ibm-plex-mono';
import '@fontsource/space-grotesk';
import '@fontsource/cormorant-garamond';
import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
