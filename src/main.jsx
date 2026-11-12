import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/site.css';

// A note for anyone who opens devtools.
console.info(
  '%c∴%c This page is one buffer of points and one draw call. The source is at github.com/DenverDawgs18/Paul-Tomasheski-Portfolio, or just write to pautomas55@gmail.com.',
  'font:24px Georgia,serif;color:#ff5a2b;',
  'font:13px Georgia,serif;color:inherit;'
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
