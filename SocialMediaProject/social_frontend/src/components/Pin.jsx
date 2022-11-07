import React, { useEffect, useState } from 'react'; // Import useEffect and useState hooks
import { Link, useNavigate } from 'react-router-dom'; // <-- import useNavigate
import { v4 as uuidv4 } from 'uuid'; // https://www.npmjs.com/package/uuid for sidebar images
import { MdDownloadForOffline } from 'react-icons/md'; // import icon
import { AiTwotoneDelete } from 'react-icons/ai'; // Delete icon
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'; // import the icons

import { client, urlFor } from '../client'; // import the client and urlFor from the client.js file
import { getUserDataFromToken } from '../utils'; // import the getUserDataFromToken function from the utils.js file
//main component container for the pin page 
const Pin = ({ pin }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate(); // navigate to the user profile page

  const { postedBy, image, _id, destination, save } = pin;

  useEffect(() => { // get the user data from the token
    const userInfo = getUserDataFromToken();
    setUser(userInfo);
    return () => {
      setUser(null);
    };
  }, []); // empty array to run the useEffect only once

  const alreadySaved = !!(save?.filter((item) => item?.postedBy?._id === user?.id)?.length); // check if the user has already saved the post

  const savePin = (id) => { // save the pin
    if (!alreadySaved) {
      setSavingPost(true);
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{
          _key: uuidv4(), // generate a unique key
          userId: user?.id, // get the user id from the token
          postedBy: { 
            _type: 'postedBy', 
            _ref: user?.id, 
          },
        }])
        .commit() 
        .then(() => {
          window.location.reload();
          setSavingPost(false); // reload the page to show the saved post
        });
    }
  };

  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload();
      });
  }; // delete the pin

  return ( 
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        {image ? (<img className="rounded-lg w-full " src={(urlFor(image).width(250).url())} alt="user-post" />) : null}
        {postHovered ? (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: '100%' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2"> 
                <a
                  href={`${image?.asset?.url}?dl=`} // download the image
                  download
                  onClick={(e) => { // prevent the image from opening in a new tab
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline /> 
                </a>
              </div> 
              {alreadySaved ? ( // if the user has already saved the post
                <button type="button" className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none cursor-zoom-in">
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  onClick={(e) => { // save the post
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {save?.length} {savingPost ? 'Saving' : 'Save'}
                </button> 
              )}
            </div>
            <div className=" flex justify-between items-center gap-2 w-full">
              {destination?.slice(8).length > 0 ? (
                <a
                  href={destination} // open the destination link in a new tab
                  target="_blank"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  rel="noreferrer"
                >
                  {' '}
                  <BsFillArrowUpRightCircleFill /> 
                  {destination?.slice(8, 17)}... 
                </a>
              ) : undefined}
              { (postedBy?._id === user?.id) ? ( 
                <button
                  type="button"
                  onClick={(e) => { // delete the post
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                >
                  <AiTwotoneDelete /> 
                </button>) : null} 
            </div>
          </div>) : null}
      </div>
      <Link to={`/user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 ml-2 items-center"> 
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image} // get the user image
          alt="user-profile"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link> 
    </div> 
  );
};

export default Pin; // export the component