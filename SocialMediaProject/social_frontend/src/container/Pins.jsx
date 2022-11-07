import React, { useState } from 'react'; // Import useState hook
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route from react-router-dom

import { Navbar, Feed, PinDetail, CreatePin, Search } from '../components'; // Import Navbar, Feed, PinDetail, CreatePin, and Search components

const Pins = ({ user }) => { // main component container for the pins page
  const [searchTerm, setSearchTerm] = useState('');

  return (
    
    <div className='px-2 md:px-5'>
      <div className='bg-gray-50'> 
        <Navbar searchTerm={ searchTerm } setSearchTerm={ setSearchTerm } user={ user } />
        
      </div> 
      <div className='h-full'>
        <Routes>
          <Route path='/' element={<Feed />} />
          <Route path='/category/:categoryId' element={<Feed />} />     
          <Route path='/pin-detail/:pinId' element={<PinDetail user={ user } />} />
          <Route path='/create-pin' element={<CreatePin user={ user } />} />
          <Route path='/search' element={<Search searchTerm={ searchTerm } setSearchTerm={ setSearchTerm } />} />
        </Routes>
      </div>
    </div> // Routes for the different pages
  );
};

export default Pins; // export the Pins component