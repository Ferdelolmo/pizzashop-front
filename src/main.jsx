import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { initFaro } from './faro.js';
import './styles.css';

initFaro();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
