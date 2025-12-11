import React from 'react';
import ReactDOM from 'react-dom/client';

// Import global CSS (if needed)
// import './index.css';
import './App.css';
// import './App1.css';
import App from './App.jsx';

// Create the root container and render the App component. React 19 uses
// createRoot from react-dom/client to enable concurrent rendering. See
// https://react.dev for details on the latest React APIs【282894523125242†L68-L70】.
ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <App />
    // </React.StrictMode>
);
