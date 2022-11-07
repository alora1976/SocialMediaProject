import React, { useState, useRef, useEffect } from 'react';  // Import React, useState, useRef, and useEffect from react
import { HiMenu } from 'react-icons/hi';  // Import HiMenu from react-icons/hi
import { AiFillCloseCircle } from 'react-icons/ai'; // Import AiFillCloseCircle from react-icons/ai
import { Link, Route, Routes } from 'react-router-dom'; // Import Link, Route, and Routes from react-router-dom

import { Sidebar, UserProfile } from '../components'; // Import Sidebar and UserProfile from components
import Pins from './Pins'; // Import Pins from container/Pins
import { client } from '../client'; // Import client from client
import logo from '../assets/logo.png'; // Import logo from assets
import { getUserDataFromToken } from '../utils'; // Import getUserDataFromToken from utils
import { userQuery } from '../utils/data'; // Import userQuery from utils/data

const Home = () => { // main component container for the Home

  const [toggleSidebar, setToggleSidebar] = useState(false); // toggleSidebar variable for useState hook
  const [user, setUser] = useState(null); // user variable for useState hook
  const scrollRef = useRef(null); // scrollRef variable for useRef hook

  useEffect(() => { // useEffect hook
    const userInfo = getUserDataFromToken(); // userInfo variable for getUserDataFromToken function
    if (userInfo) { // if userInfo exists
      const query = userQuery(userInfo.id); // query variable for userQuery function
      client.fetch(query).then((data) => { // fetch the data from the query
        setUser(data[0]); // set the user variable to the data
      }); // end of fetch
    }
    return () => { // return the useEffect hook
      setUser(null); // set the user variable to null
    }; // end of return
  }, []); // end of useEffect hook

  useEffect(() => { // useEffect hook
    scrollRef.current.scrollTo(0, 0); // scroll to the top of the page
  }, []); // end of useEffect hook

  return ( // return the Home component
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen'>
        <Sidebar user={ user } /> 
      </div>
      <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)} />
          <Link to='/'>
            <img src={logo} alt='logo' className='w-28' />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt='logo' className='w-28' />
          </Link>
        </div>
        { toggleSidebar ? ( // if toggleSidebar is true
          <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
            <div className='absolute w-full flex justify-end items-center p-2'>
              <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)} />
            </div>
            <Sidebar user={ user } closeToggle={ setToggleSidebar } />
          </div>
        ) : null } 
      </div>
      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={ scrollRef }>
        <Routes>
          <Route path="/user-profile/:userId" element={ <UserProfile /> } />
          <Route path="/*" element={ <Pins user={ user } /> } />
        </Routes>
      </div>
    </div>
  ); // end of return
}; // end of Home component

export default Home; // export the Home component