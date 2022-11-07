import sanityClient from '@sanity/client'; // Import sanityClient from @sanity/client
import imageUrlBuilder from '@sanity/image-url'; // Import imageUrlBuilder from @sanity/image-url

export const client = sanityClient({ // client variable for the sanityClient function
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID, // projectId property
  dataset: 'production', // dataset property
  apiVersion: '2021-11-16', // apiVersion property
  useCdn: true, // useCdn property
  token: process.env.REACT_APP_SANITY_TOKEN, // token property
}); // end of client variable

const builder = imageUrlBuilder(client); // builder variable for the imageUrlBuilder function

export const urlFor = (source) => builder.image(source);  // urlFor function