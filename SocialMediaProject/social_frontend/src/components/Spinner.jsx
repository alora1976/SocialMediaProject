import React from 'react'; // Import React
import { Circles } from 'react-loader-spinner'; // Import Circles from react-loader-spinner

const Spinner = ({ message }) => { // main component container for the Spinner
  return ( // return the Spinner component
    <div className="flex flex-col justify-center items-center w-full h-full"> 
      <Circles 
        color="#00BFFF"
        height={50}
        width={200}
        className="m-5"
      />
      <p className="text-lg text-center px-2">{message}</p>
    </div> 
  ); // end of return
}; // end of Spinner component

export default Spinner; // export Spinner component