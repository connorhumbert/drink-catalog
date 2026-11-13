import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Use createRoot instead of ReactDOM.render
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Caches the app so it opens without a connection. App shows a reload prompt when a new version arrives.
serviceWorkerRegistration.register();
