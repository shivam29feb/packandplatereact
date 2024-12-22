import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Ensure this file exists at this path
import reportWebVitals from './reportWebVitals'; // Ensure this file exists at this path

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
