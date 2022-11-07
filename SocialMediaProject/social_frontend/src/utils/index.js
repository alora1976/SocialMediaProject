import jwt_decode from 'jwt-decode';

export const getUserDataFromToken = (token) => { // get the user data from the token
  const jwtToken = token ?? localStorage.getItem('profile'); // get the token from the local storage
  if (jwtToken) { // if the token exists
    const tokenData = jwt_decode(jwtToken); // decode the token
    return { // return the user data
      name: tokenData?.name,
      imageUrl: tokenData?.picture,
      email: tokenData?.email,
      id: tokenData?.sub,
      exp: tokenData?.exp,
    };
  }
  return null; // return null if the token does not exist
}; // end of getUserDataFromToken function