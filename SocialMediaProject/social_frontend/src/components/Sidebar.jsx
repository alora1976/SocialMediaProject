import React from 'react'; // Import React
import { NavLink, Link } from 'react-router-dom'; // Import NavLink and Link from react-router-dom
import { RiHomeFill } from 'react-icons/ri'; // Import RiHomeFill from react-icons/ri
import { IoIosArrowForward } from 'react-icons/io'; // Import IoIosArrowForward from react-icons/io

import logo from '../assets/logo.png'; // Import logo from assets
import { categories } from '../utils/data'; // Import categories from utils/data

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize'; 
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';
// responsive sidebar with styling using Tailwind CSS
const Sidebar = ({ user, closeToggle }) => { // main component container for the Sidebar
  const handleCloseSidebar = () => { // function to close the sidebar
    if (closeToggle) { // if closeToggle is true
      closeToggle(false); // set closeToggle to false
    } // end if
  }; // end of handleCloseSidebar function

  return ( // return the Sidebar component
    <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>  
      <div className='flex flex-col'>
        <Link
          to='/'
          className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
          onClick={handleCloseSidebar} // call handleCloseSidebar function
        >
          <img src={logo} alt='logo' className='w-full' />
        </Link>
        <div className='flex flex-col gap-5'>
          <NavLink 
            to='/' // link to the home page
            className={({ isActive }) => ((isActive) ? isActiveStyle : isNotActiveStyle) } // if the link is active, use isActiveStyle, otherwise use isNotActiveStyle
            onClick={handleCloseSidebar} // call handleCloseSidebar function
            end
          >
            <RiHomeFill /> Home
          </NavLink>
          <h3 className='mt-2 px-5 text-base 2xl:text-xl'>Categories</h3> 
          { categories.slice(0, categories.length - 1).map((category) => ( // map through the categories array
            <NavLink 
              to={`/category/${category.name}`} // link to the category page
              className={({ isActive }) => ((isActive) ? isActiveStyle : isNotActiveStyle) } // display active style if the link is active
              onClick={handleCloseSidebar} // call handleCloseSidebar function
              key={category.name} // use category name as the key
            >
              <img src={category.image} className="w-8 h-8 rounded-full shadow-sm" alt={category.name} />      
              { category.name }    
            </NavLink> // display the category name and circle image
          )) } 
        </div> 
      </div> 
      { user ? ( // if user exists
        <Link 
          to={`user-profile/${user._id}`} // link to the user profile page
          className='flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3'
          onClick={handleCloseSidebar} // close the sidebar when the user clicks on the profile link
        >
          <img src={user.image} className='w-10 h-10 rounded-full' alt='user-profile' />
          <p>{user.userName}</p>
          <IoIosArrowForward />  
        </Link>
      ) : null } 
    </div> 
  ); // end of return
}; // end of Sidebar component

export default Sidebar; // export Sidebar component