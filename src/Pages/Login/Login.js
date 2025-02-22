// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from 'jwt-decode'; // Corrected import
// // require('dotenv').config()

// function Login() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userEmail, setUserEmail] = useState('');
//   const [userName, setUserName] = useState('');
//   const navigate = useNavigate();
  

//   useEffect(() => {
//     if (isLoggedIn) {
//       const timeoutId = setTimeout(handleSignOut, 30 * 60000);
//       return () => clearTimeout(timeoutId);
//     }
//   }, [isLoggedIn]);

//   const handleLoginSuccess = (credentialResponse) => {
//     const decoded = jwtDecode(credentialResponse.credential); // Corrected function call
//     const userEmail = decoded.email;
//     console.log('User Email:', userEmail); // Print user's email to console
//     console.log('User Name:', decoded.username); // Print user's username to console
//     setIsLoggedIn(true);
//     setUserEmail(userEmail); // Extracting user's email
//     setUserName(decoded.username);
//     sendtobackend(decoded.email); // Pass decoded email to sendtobackend function
//     sessionStorage.setItem('token', credentialResponse.credential);
//     navigate('/home'); // Redirect to home page after successful login
//   };

//   const handleLoginError = () => {
//     console.log('Login Failed');
//   };

//   const handleSignOut = () => {
//     setIsLoggedIn(false);
//     setUserEmail('');
//     setUserName('');
//     sessionStorage.removeItem('token');
//   };

//   function sendtobackend(userEmail) {
//     console.log(userEmail)
//     const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
//     axios.post(`${backendUrl}/logindetails`, {
//       Mail: userEmail
//     })
    
//     .then(() => console.log("Mail sent to backend"))
//     .catch((error) => console.error("Error sending mail to backend:", error));
//   }

//   return (
//     <div className="center-container">
//       <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
//         {isLoggedIn ? (
//           <div>
//             <p>Welcome, {userEmail}</p> {/* Displaying user's email */}
//             <p>{userName}</p>
//             <button onClick={handleSignOut}>Sign Out</button>
//           </div>
//         ) : (
//           <GoogleLogin
//             onSuccess={handleLoginSuccess}
//             onError={handleLoginError}
//           />
//         )}
//       </GoogleOAuthProvider>
//     </div>
//   );
// }

// export default Login;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Search/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode'; // Importing correctly without destructuring
import axios from 'axios';

const Login = () => {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    //console.log('Google login successful:', credentialResponse);
    const decoded = jwtDecode(credentialResponse.credential); 
    //console.log('Decoded JWT Token:', decoded);

    const userEmail = decoded.email;
    //console.log('User Email:', userEmail);

    if (!userEmail.endsWith('@meltwater.com')) {
      setError('Meltwater Internal Users only!!!');
      return;
    }

    let userName = decoded.name || 'N/A';

    if (userName === 'N/A') {
      try {
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${credentialResponse.credential}`,
          },
        });
        userName = userInfoResponse.data.name || userName;
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }

    //console.log('User Name:', userName);

    sendToBackend(userEmail, userName); // Pass decoded email and username to sendToBackend function
    sessionStorage.setItem('token', credentialResponse.credential);
    login();
    navigate('/Home');
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google login failed:', error);
    setError('Google login failed. Please try again.');
  };

  function sendToBackend(userEmail, userName) {
    console.log("Logged In User - ",userEmail);
    console.log("User Name - ",userName);
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
    axios.post(`${backendUrl}/logindetails`, {
      Mail: userEmail,
      Username: userName
    })
    .then(() => console.log("Mail and username sent to backend"))
    .catch((error) => console.error("Error sending mail and username to backend:", error));
  }

  return (
    <GoogleOAuthProvider clientId = {process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
          />
        </div>
      
    </GoogleOAuthProvider>
  );
};

export default Login;