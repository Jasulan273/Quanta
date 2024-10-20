import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Registration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (password === confirmPassword) {
      console.log("Registering with:", email, password);
    } else {
      console.log("Passwords do not match");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-[400px] bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-orange-500">Register</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder='Enter email_'
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
            placeholder='Create password_'
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700">Confirm Password</label>
          <input 
            type="password" 
            id="confirm-password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder='Confirm password_'
          />
        </div>

        <button 
          onClick={handleRegister} 
          className="w-full bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition-all duration-300"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <NavLink to="/Auth" className="text-orange-500 hover:underline">
            Login here
          </NavLink>
        </p>
      </div>
    </div>
  );
}
