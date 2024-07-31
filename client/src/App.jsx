import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; 
import Login from './components/Login';
import Signup from './components/Signup';
import Stream from './components/Stream';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showLogin, setShowLogin] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId); 
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    } else {
      localStorage.removeItem('token');
      setUserId(null);
    }
  }, [token]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {!token ? (
        showLogin ? (
          <div className="card w-full max-w-sm">
            <Login setToken={setToken} />
            <p className="mt-4 text-center">
              Don't have an account?{' '}
              <button 
                onClick={() => setShowLogin(false)}
                className="text-blue-500 hover:underline"
              >
                Signup
              </button>
            </p>
          </div>
        ) : (
          <div className="card w-full max-w-sm">
            <Signup />
            <p className="mt-4 text-center">
              Already have an account?{' '}
              <button 
                onClick={() => setShowLogin(true)}
                className="text-blue-500 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        )
      ) : (
        <Stream token={token} setToken={setToken} userId={userId} />
      )}
    </div>
  );
};

export default App;
