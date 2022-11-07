import React, { useState, useEffect } from 'react'; // Import React, useState, and useEffect from react
import { AiOutlineLogout } from 'react-icons/ai'; // Import AiOutlineLogout from react-icons/ai
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate from react-router-dom
import { googleLogout } from '@react-oauth/google'; // Import googleLogout from @react-oauth/google

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data'; // Import userCreatedPinsQuery, userQuery, and userSavedPinsQuery from utils/data
import { client } from '../client'; // Import client from client
import { MasonryLayout, Spinner } from '.'; // Import MasonryLayout and Spinner from components

const randomImage = 'https://source.unsplash.com/1600x900/?flowers'; // Random image from unsplash
const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none'; 
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none'; 

const UserProfile = () => { // main component container for the UserProfile
  const [user, setUser] = useState(null); // set user to null
  const [pins, setPins] = useState(null); // set pins to null
  const [text, setText] = useState('Created'); // set text to 'Created'
  const [activeBtn, setActiveBtn] = useState('created'); // set activeBtn to 'created'
  const navigate = useNavigate(); // use navigate from react-router-dom
  const { userId } = useParams(); // use userId from useParams

  useEffect(() => { // useEffect hook
    const query = userQuery(userId); // query variable for the userQuery function
    client.fetch(query) // client fetch query
      .then((data) => { // then function
        setUser(data[0]); // set user to data[0]
      }); // end of then function
  }, [userId]); // end of useEffect hook

  useEffect(() => { // useEffect hook
    if (text === 'Created') { // if text is equal to 'Created'
      const createdPinsQuery = userCreatedPinsQuery(userId); // createdPinsQuery variable for the userCreatedPinsQuery function
      client.fetch(createdPinsQuery) // client fetch createdPinsQuery
        .then((data) => { // then function
          setPins(data); // set pins to data
        }); // end of then function
    } else { // else statement
      const savedPinsQuery = userSavedPinsQuery(userId); // savedPinsQuery variable for the userSavedPinsQuery function
      client.fetch(savedPinsQuery) // client fetch savedPinsQuery
        .then((data) => { // then function
          setPins(data); // set pins to data
        }); // end of then function
    }
  }, [text, userId]); // end of useEffect hook

  const logout = () => { // logout function
    googleLogout(); // googleLogout function
    localStorage.clear(); // clear localStorage 
    navigate('/login'); // navigate to /login
  }; // end of logout function

  if (!user) { // if user is not true
    return <Spinner message={'Loading profile...'} />;
  } // end if

  return ( // return the UserProfile component
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img
              src={randomImage} // src is equal to randomImage
              className='w-full h-370 2xl:h-510 shadow-lg object-cover'
              alt="banner"
            />
            <img
              className='rounded-full w-40 h-40 -mt-20 shadow-xl object-cover'
              src={user?.image} // src is equal to user?.image
              alt="user-profile"
            />
            <h1 className='font-bold text-3xl text-center mt-3'>{user?.userName}</h1> 
            <div className='absolute top-0 z-1 right-0 p-2'>
              { userId === user?._id ? ( // if userId is equal to user?._id
                <button 
                  type='button' 
                  className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md'
                  onClick={logout} // onClick is equal to logout function
                >
                  <AiOutlineLogout color="red" fontSize={21} /> 
                </button> // end of button
              ) : null } 
            </div> 
          </div> 
          <div className='text-center mb-7'> 
            <button
              type='button'
              onClick={(e) => { // onClick is equal to an anonymous function
                setText(e.target.textContent); // setText is equal to e.target.textContent
                setActiveBtn('created'); // setActiveBtn is equal to 'created'
              }}
              className={`${(activeBtn === 'created') ? activeBtnStyles : notActiveBtnStyles }`} // className is equal to activeBtnStyles or notActiveBtnStyles
            >
              Created
            </button> 
            <button 
              type='button'
              onClick={(e) => {
                setText(e.target.textContent); // setText is equal to e.target.textContent
                setActiveBtn('saved'); // setActiveBtn is equal to 'saved'
              }} 
              className={`${(activeBtn === 'saved') ? activeBtnStyles : notActiveBtnStyles }`} // className is equal to activeBtnStyles or notActiveBtnStyles
            >
              Saved
            </button>
          </div>
          { pins?.length ? ( // if pins?.length is true
            <div className='px-2'>
              <MasonryLayout pins={pins} /> 
            </div>
          ) : (
            <div className='flex justify-center font-bold items-center w-full text-xl mt-2'>
              No Pins Found!
            </div>
          ) } 
        </div>
      </div>
    </div>
  );
}; // end of UserProfile component

export default UserProfile; // export UserProfile component