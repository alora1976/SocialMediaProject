import React from 'react'; // Import React
import Masonry from 'react-masonry-css'; // Import Masonry from react-masonry-css
import { Pin } from '.'; // Import Pin component

const breakpointColumnsObj = { // breakpointColumnsObj for the Masonry component
  default: 4, // default is 4
  3000: 6, 
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins }) => ( // main component container for the MasonryLayout
  <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointColumnsObj}> 
    {pins?.map((pin) => <Pin key={pin._id} pin={pin} className="w-max" />)}
  </Masonry> // return Masonry component with pins
); 

export default MasonryLayout; // export the MasonryLayout component