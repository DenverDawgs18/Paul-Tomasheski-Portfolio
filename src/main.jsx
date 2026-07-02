import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

// Calling card for anyone who opens devtools.
const mono = 'font-family:ui-monospace,monospace;font-size:12px;';
console.info(
  '%c$ whoami\n%cPaul Tomasheski · self-taught developer building AI-first tools.\n%c> pautomas55@gmail.com · github.com/DenverDawgs18',
  `${mono}color:#e6b872;`,
  `${mono}color:#e8e8e4;`,
  `${mono}color:#8a8d94;`
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
