import React from 'react'; // Import React
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin from @react-oauth/google
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

import shareVideo from '../assets/share.mp4'; // Import shareVideo from assets
import logo from '../assets/logowhite.png'; // Import logo from assets
import { getUserDataFromToken } from '../utils'; // Import getUserDataFromToken from utils
import { client } from '../client'; // Import client from client.js

const Login = () => { // main component container for the login page

  const navigate = useNavigate(); // useNavigate hook

  const googleLoginSuccess = async ({ credential }) => { // googleLoginSuccess function
    try { // try
      localStorage.setItem('profile', credential); // set profile in localStorage to credential
      const { name, id, imageUrl } = getUserDataFromToken(credential); // set name, id, and imageUrl to getUserDataFromToken with credential as the argument
      const doc = { // set doc to an object
        _id: id, // set _id to id
        _type: 'user', // set _type to user
        userName: name, // set userName to name
        image: imageUrl, // set image to imageUrl
      }; // end of doc object
      client.createIfNotExists(doc) // createIfNotExists doc
        .then(() => { // then
          navigate('/', { replace: true }); // navigate to the home page
        }); // end of then
    } catch (error) { // catch
      console.error(error); // log error
    }
  }; // end of googleLoginSuccess function

  const googleLoginError = (error) => { // googleLoginError function
    console.error("Google Sign In was not successful. Try again later. Details: ", error); // log error
  }; // end of googleLoginError function

  return ( // return
    <div className='flex justify-start items-center flex-col h-screen'> {/* main container */}
      <div className='relative w-full h-full'> {/* video container */}
        <video // video
          src={ shareVideo } // set src to shareVideo
          type="video/mp4" // set type to video/mp4
          loop // loop
          controls={ false } // set controls to false
          muted // muted
          autoPlay // autoPlay
          className='w-full h-full object-cover' // set className to w-full h-full object-cover
        />
        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'> {/* overlay container */}
          <div className='p-5'> {/* logo container */}
            <img src={ logo } width="130px" alt='logo' /> {/* logo */}
          </div> {/* end of logo container */}
          <div className='shadow-2xl'> {/* login container */}
            <GoogleLogin // GoogleLogin component
            
              onSuccess={googleLoginSuccess} // set onSuccess to googleLoginSuccess
              onError={googleLoginError} // set onError to googleLoginError
              useOneTap // useOneTap
            /> {/* end of GoogleLogin component */}
          </div> {/* end of login container */}
        </div> {/* end of overlay container */}
      </div> {/* end of video container */}
    </div> // end of main container
  );
};

export default Login; // export the Login component