import React, { useState, useEffect, useCallback } from 'react'; // Import React, useState, useEffect, and useCallback from react
import { MdDownloadForOffline } from 'react-icons/md'; // Import MdDownloadForOffline from react-icons/md
import { Link, useParams } from 'react-router-dom'; // Import Link and useParams from react-router-dom
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 from uuid

import { client, urlFor } from '../client'; // Import client and urlFor from client
import { MasonryLayout, Spinner } from '.'; // Import MasonryLayout and Spinner from index
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data'; // Import pinDetailMorePinQuery and pinDetailQuery from data

const PinDetail = ({ user }) => { // main component container for the PinDetail
  const [pins, setPins] = useState(null); // useState hook for the pins
  const [pinDetail, setPinDetail] = useState(null); // useState hook for the pinDetail
  const [comment, setComment] = useState(''); // useState hook for the comment
  const [addingComment, setAddingComment] = useState(false); // useState hook for the addingComment
  const { pinId } = useParams(); // useParams hook for the pinId

  const fetchPinDetails = useCallback(() => { // useCallback hook for the fetchPinDetails function
    let query = pinDetailQuery(pinId); // query variable for the pinDetailQuery function
    if (query) { // if query exists
      client.fetch(query) // fetch the query
        .then((data) => { // then set the pinDetail state
          setPinDetail(data[0]); // set the pinDetail state
          if (data[0]) { // if data[0] exists
            query = pinDetailMorePinQuery(data[0]); // query variable for the pinDetailMorePinQuery function
            client.fetch(query).then((res) => setPins(res)); // fetch the query and set the pins state
          } // end if
        }); // end of then
    } // end if
  }, [pinId]); // end of fetchPinDetails function

  const addComment = () => { // addComment function
    if (comment) { // if comment exists
      setAddingComment(true); // set the addingComment state
      client // client
        .patch(pinId) // patch the pinId 
        .setIfMissing({ comments: [] }) // setIfMissing for the comments
        .insert('after', 'comments[-1]', [{ // insert after the comments[-1]
          comment, // comment
          _key: uuidv4(), // _key
          postedBy: { 
            _type: 'postedBy', // _type
            _ref: user?._id, // _ref
          } // end of postedBy
        }]) // end of insert
        .commit() // commit
        .then(() => { // then
          fetchPinDetails(); // fetchPinDetails function
          setComment(''); // set the comment state
          setAddingComment(false); // set the addingComment state
        });  // end of then
    }
  };

  useEffect(() => { // useEffect hook
    fetchPinDetails(); // fetchPinDetails function
  }, [fetchPinDetails]); // end of useEffect hook

  if (!pinDetail) { // if pinDetail does not exist
    return <Spinner message="Loading pin..." />; // return Spinner component with message
  } // end if

  return ( // return the PinDetail component
    <> 
      <div className='flex xl:flex-row flex-col m-auto bg-white' style={{ maxWidth: '1500px', borderRadius: '32px' }}> 
        <div className='flex justify-center items-center md:items-start flex-initial'>
          <img src={pinDetail?.image && urlFor(pinDetail.image).url()} alt='user-post' className='rounded-t-3xl rounded-b-lg' /> 
        </div> 
        <div className='w-full p-5 flex-1 xl:min-w-620'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-2 items-center'>
              <a
                href={`${pinDetail?.image?.asset?.url}?dl=`} // download the image
                download // download the image
                onClick={(e) => { // onClick event
                  e.stopPropagation(); // stopPropagation
                }} // end of onClick event
                className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              >
                <MdDownloadForOffline /> 
              </a> 
            </div> 
            <a href={pinDetail?.destination} target="_blank" rel="noreferrer"> 
              {(pinDetail?.destination?.length > 60) ? `${pinDetail?.destination?.slice(0, 60)}...` : pinDetail?.destination} 
            </a> 
          </div> 
          <div> 
            <h1 className='text-4xl font-bold break-words mt-3'>{pinDetail?.title}</h1>
            <p className='mt-3'>{pinDetail?.about}</p>
          </div> 
          <Link to={`/user-profile/${pinDetail?.postedBy?._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
            <img 
              className="w-8 h-8 rounded-full object-cover"
              src={pinDetail?.postedBy?.image} 
              alt="user-profile" 
            /> 
            <p className="font-semibold capitalize">{pinDetail?.postedBy?.userName}</p>
          </Link>
          <h2 className='mt-5 text-2xl'>Comments</h2>
          <div className='max-h-370 overflow-y-auto'>
            {pinDetail?.comments?.map((comment, i) => (<div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i}>
              <img
                src={comment?.postedBy?.image} 
                alt="user-profile"
                className='w-10 h-10 rounded-full cursor-pointer'
              />
              <div className='flex flex-col'>
                <p className='font-bold'>{comment?.postedBy?.userName}</p> 
                <p>{comment?.comment}</p> 
              </div>
            </div>))}
          </div>
          <div className='flex flex-wrap mt-6 gap-3'>
            <Link to={`/user-profile/${user?._id}`}>
              <img
                className="w-10 h-10 rounded-full cursor-pointer"
                src={user?.image}
                alt="user-profile"
              />
            </Link> 
            <input 
              className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
              type='text'
              placeholder='Add a comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type='button'
              className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
              onClick={addComment}
            >
              {addingComment ? 'Posting the comment...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {pins ? (
        <MasonryLayout pins={pins} /> // MasonryLayout component
      ) : (
        <Spinner message="Loading more pins" /> // Spinner component
      )} 
    </> 
  ); // end of return
}; // end of PinDetail component

export default PinDetail;  // export PinDetail component