import React, { useState, useEffect } from 'react'; // Import React, useState, and useEffect from react

import { MasonryLayout, Spinner } from '.'; // Import MasonryLayout and Spinner from index
import { client } from '../client'; // Import client from client
import { feedQuery, searchQuery } from '../utils/data'; // Import feedQuery and searchQuery from data

const Search = ({ searchTerm, setSearchTerm }) => { // main component container for the Search
  const [pins, setPins] = useState(null); // useState hook for the pins
  const [loading, setLoading] = useState(false); // useState hook for the loading

  useEffect(() => { // useEffect hook
    if (searchTerm) { // if searchTerm exists
      setLoading(true); // set the loading state
      const query = searchQuery(searchTerm.toLowerCase()); // query variable for the searchQuery function
      client.fetch(query) // fetch the query
        .then((data) => { // then set the pins state
          setPins(data); // set the pins state
          setLoading(false); // set the loading state
        }); // end of then
    } else { // else
      setLoading(true); // set the loading state
      client.fetch(feedQuery()) // fetch the feedQuery
        .then((data) => { // then set the pins state
          setPins(data); // set the pins state
          setLoading(false); // set the loading state
        }); // end of then
    }
  }, [searchTerm]); // end of useEffect hook

  return ( // return the Search component
    <div> 
      {loading ? <Spinner message="Searching for pins..." /> : null} 
      {(pins?.length !== 0) ? (<MasonryLayout pins={pins} />) : null}
      {(pins?.length === 0 && searchTerm !== '' && !loading) ? (
        <div className='mt-10 text-center text-xl'>
          No Pins Found! 
        </div>
      ) : null} 
    </div> 
  ); // end of return
}; // end of Search component

export default Search; // export Search component