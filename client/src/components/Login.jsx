import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      setToken(response.data.token);
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input 
          type="text" 
          id="username"
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Username"
          className="input"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input 
          type="password" 
          id="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password"
          className="input"
        />
      </div>
      <div className="flex items-center justify-between">
        <button 
          type="submit"
          className="button w-full"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default Login;