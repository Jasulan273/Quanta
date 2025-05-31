import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { loginUser } from '../../Api/auth';

export default function Auth({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await loginUser(username, password);
      setError('');
      
      localStorage.setItem('accessToken', data.access); 
      localStorage.setItem('username', username);
      setUser(username);
      navigate('/Home');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-[400px] bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-orange-500">Login</h2>
        
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-semibold text-gray-700">Username</label>
          <input 
            type="text" 
            id="username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder='Enter username'
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder='Enter password'
          />
        </div>

        <button 
          onClick={handleLogin} 
          className="w-full bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition-all duration-300"
        >
          Login
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <p className="mt-4 text-sm text-center">
          Don't have an account?{' '}
          <NavLink to="/Registration" className="text-orange-500 hover:underline">
            Register here
          </NavLink>
        </p>
      </div>
    </div>
  );
}