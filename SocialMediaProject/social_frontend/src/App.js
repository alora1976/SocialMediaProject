import React, { useEffect } from 'react'; // Import React and useEffect from react
import { Routes, Route, useNavigate } from 'react-router-dom'; // Import Routes, Route, and useNavigate from react-router-dom
import { Login } from './components'; // Import Login from components
import Home from './container/Home'; // Import Home from container/Home
import { getUserDataFromToken } from './utils'; // Import getUserDataFromToken from utils

const App = () => { // main component container for the App
  const navigate = useNavigate(); // navigate variable for the useNavigate function

  useEffect(() => { // useEffect hook
    const userInfo = getUserDataFromToken(); // userInfo variable for the getUserDataFromToken function
    if (!userInfo) { // if userInfo does not exist
      localStorage.clear(); // clear localStorage
      navigate('/login');  // navigate to /login
    } // end if
  }, [navigate]); // end of useEffect hook

  return ( // return the App component
    <Routes> 
      <Route path='login' element={<Login />} />
      <Route path='/*' element={<Home />} />
    </Routes> // end of Routes
  ); // end of return
}; // end of App component

export default App; // export App component