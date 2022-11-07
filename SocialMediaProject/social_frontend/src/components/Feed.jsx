import React, { useState, useEffect } from 'react';  // Import useState and useEffect hooks
import { useParams } from 'react-router-dom'; // Import useParams hook

import { client } from '../client'; // Import client from client.js
import { MasonryLayout, Spinner } from '.'; // Import MasonryLayout and Spinner components
import { feedQuery, searchQuery } from '../utils/data'; // Import feedQuery and searchQuery from data.js

const Feed = () => { // main component container for the feed page
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => { // useEffect hook
    setLoading(true);
    if (categoryId) { // if categoryId is true
      const query = searchQuery(categoryId); // set query to searchQuery with categoryId as the argument
      client.fetch(query) // fetch the query
        .then((data) => { // then set pins to data
          setPins(data); // set pins to data
          setLoading(false); // set loading to false
        });
    } else { // else
      const query = feedQuery(); // set query to feedQuery
      client.fetch(query) // fetch the query
        .then((data) => { // then set pins to data
          setPins(data); // set pins to data
          setLoading(false); // set loading to false
        }); 
    }
  }, [categoryId]); // useEffect hook dependencies

  if (loading) { // if loading is true
    return <Spinner message="Adding new ideas to your feed!" /> // return Spinner component with message
  } 

  if (!pins?.length) { // if pins is not true
    return <h2 className='text-center'>No Pins Found</h2>; // return h2 with message
  } 

  return (
    <div>
      {(pins && pins.length > 0) ? (<MasonryLayout pins={pins} />) : null}
    </div> // return MasonryLayout component with pins
  );
};

export default Feed; // export the Feed component