import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root'))

root.render(<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
  <Router>
    <App />
  </Router>
// </GoogleOAuthProvider>); 
// GooglwOAuthProvider is a component that wraps the entire application. It provides the Google OAuth functionality to the application. The clientId prop is the Google API token that you created in the console