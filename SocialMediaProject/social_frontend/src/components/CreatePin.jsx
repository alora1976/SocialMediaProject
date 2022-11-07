import React, { useMemo, useState } from 'react'; // Import useMemo and useState hooks
import { AiOutlineCloudUpload } from 'react-icons/ai'; // import the icons
import { MdDelete } from 'react-icons/md'; // import the icons
import { useNavigate } from 'react-router-dom'; // <-- import useNavigate

import { client } from '../client'; // import the client from the client.js file
import { Spinner } from '.'; // import the Spinner component
import { categories } from '../utils/data'; // import the categories data

const CreatePin = ({ user }) => {  // main component container for the create pin page
  const [title, setTitle] = useState(''); // set the title state
  const [about, setAbout] = useState(''); // set the state for the title and about
  const [destination, setDestination] = useState(''); // set the state for the destination
  const [loading, setLoading] = useState(false); // loading state
  const [displayInvalidFieldsWarning, setDisplayInvalidFieldsWarning] = useState(false); // display the warning if the fields are invalid
  const [category, setCategory] = useState('other'); // set the default category to other
  const [imageAsset, setImageAsset] = useState(null); // set the image asset to null
  const [wrongImageType, setWrongImageType] = useState(false); // set the wrong image type to false

  const navigate = useNavigate();  

  const uploadImage = (e) => { // upload the image
    const selectedFile = e.target.files[0]; // get the selected file
    const { name, type } = selectedFile; // get the name and type of the file
    if (type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff') {
      setWrongImageType(false); // check if the image is of the correct type
      setLoading(true); // set the loading state to true
      client.assets // upload the image to the asset
        .upload('image', selectedFile, { contentType: type, filename: name })  
        .then((document) => { 
          setImageAsset(document); // set the image asset
          setLoading(false); // set the loading state to false
        })
        .catch((error) => {   // catch any errors
          console.error(`Image upload error. Details: `, error);
        });
    } else {
      setWrongImageType(true); // set the wrong image type state to true
    }
  };

  const isFormDataValid = useMemo(() => { // check if the form data is valid
    return !!(title && about && destination && imageAsset?._id && category); // return the form data
  }, [about, category, destination, imageAsset?._id, title]); 

  const createPin = () => { // create the pin
    if (isFormDataValid) { // check if the form data is valid
      const doc = { // create the document
        _type: 'pin',
        title, about, destination, category,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference', 
            _ref: imageAsset?._id // <-- use optional chaining
          }
        },
        userId: user?._id, 
        postedBy: {
          _type: 'postedBy', 
          _ref: user?._id,
        },
      };
      client.create(doc) 
        .then(() => {
          navigate('/');
        });
    } else { // if the form data is not valid
      setDisplayInvalidFieldsWarning(true); // display the warning
      setTimeout(() => { // set a timeout
        setDisplayInvalidFieldsWarning(false); // set the warning to false
      }, 2000); // set the timeout to 2 seconds
    } 
  }; 

  return ( 
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'> 
      { displayInvalidFieldsWarning ? (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Please fill in all the fields.</p> // display the invalid fields warning
      ) : null }
      <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-420'>
            { loading ? <Spinner /> : null } 
            { wrongImageType ? <p>Wrong image type</p> : null } 
            { !imageAsset ? ( // if there is no image asset
              <label>
                <div className='flex flex-col items-center justify-center h-full cursor-pointer'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-bold text-2xl'> 
                      <AiOutlineCloudUpload /> 
                    </p>
                    <p className='text-lg'>
                      Click to upload 
                    </p>
                  </div>
                  <p className='mt-32 mx-1 text-center text-gray-400'>Use high-quality JPG, SVG, PNG, GIF or TIFF less than 10 MB</p>
                </div>
                <input
                  type="file"
                  name="upload-image" 
                  onChange={uploadImage} // call the uploadImage function
                  className='w-0 h-0'
                />
              </label>
            ) : (
              <div className='relative h-full'> 
                <img src={imageAsset?.url} alt='uploaded-pic' className='h-full w-full' /> 
                <button
                  type="button"
                  className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                  onClick={() => { // call the onClick function
                    setImageAsset(null);  // set the image asset to null
                  }}
                >
                  <MdDelete /> 
                </button>
              </div>
            ) } 
          </div>
        </div> 
        
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // set the title
            placeholder='Add your title here' // placeholder
            className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2' // styling
          />
          { user ? (
            <div className='flex gap-2 mt-2 mx-1 items-center bg-white rounded-lg'> 
              <img
                src={user?.image} // display the user image
                className='w-10 h-10 rounded-full'
                alt='user-profile' // alt text
              />
              <p className='font-bold'>{user.userName}</p> 
            </div> // display the user name
          ) : null }
          <input
            type="text"
            value={about} // set the about
            onChange={(e) => setAbout(e.target.value)} // set the about
            placeholder='What is your pin about?'
            className='outline-none text-base sm:text-lg font-bold border-b-2 border-gray-200 p-2'
          />
          <input
            type="text"
            value={destination} // set the destination
            onChange={(e) => setDestination(e.target.value)}
            placeholder='Add a destination link'
            className='outline-none text-base sm:text-lg font-bold border-b-2 border-gray-200 p-2'
          />
          <div className='flex flex-col'>
            <div>
              <p className='mb-2 mx-1 font-semibold text-lg sm:text-xl'>Choose Pin Category</p>
              <select
                onChange={(e) => setCategory(e.target.value)} // set the category
                className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer capitalize'
                value={category} // set the value
              >
                <option value="other" className='bg-white'>Select Category</option> 
                { categories.map(({ name }) => ( // map through the categories
                  <option className='text-base border-0 border-none capitalize bg-white text-black' value={name} key={name}>
                    {name} 
                  </option> // display the category name
                )) }
              </select> 
            </div>
            <div className='flex justify-end items-end mt-5'>
              <button
                type="button"
                onClick={createPin}
                className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none cursor-pointer'
              >
                Create Pin 
              </button> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin; // export the component