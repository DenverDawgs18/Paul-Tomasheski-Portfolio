import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import './styles/chrome.css';

// A note for anyone who opens devtools.
console.info(
  '%c¶%c This page is one paragraph. Add #everything to the address to unfold all of it at once, or just write to pautomas55@gmail.com.',
  'font:24px Georgia,serif;color:#c63a1c;',
  'font:13px Georgia,serif;color:inherit;'
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
