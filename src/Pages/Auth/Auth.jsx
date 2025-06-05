import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { loginUser, handleSocialLogin } from '../../Api/auth';
import { FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa';

export default function Auth({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
    }
  }, [location]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const data = await loginUser(username, password);
      setError('');
      localStorage.setItem('accessToken', data.access); 
      localStorage.setItem('username', username);
      setUser(username);
      navigate('/Home');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLoginClick = (provider) => {
    handleSocialLogin(provider);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-10 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-10 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-orange-500">Login</h2>
        
        <div className="mb-6">
          <label htmlFor="username" className="block text-lg font-medium text-gray-700 mb-2">Username</label>
          <input 
            type="text" 
            id="username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full px-5 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all"
            placeholder='Enter username'
          />
        </div>

        <div className="mb-6 relative">
          <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-5 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all"
              placeholder='Enter password'
            />
            <button 
              type="button" 
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </div>

        <button 
          onClick={handleLogin} 
          disabled={isLoading}
          className={`w-full bg-orange-500 text-white font-bold py-3 text-lg rounded-xl hover:bg-orange-600 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'}`}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {error && <p className="text-red-500 text-center mt-4 text-lg">{error}</p>}

        <div className="mt-6 mb-6 flex items-center">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-gray-500">or continue with</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button 
            onClick={() => handleSocialLoginClick('google')}
            className="p-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-all duration-300"
          >
            <FaGoogle size={24} className="text-red-500" />
          </button>
          <button 
            onClick={() => handleSocialLoginClick('github')}
            className="p-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-all duration-300"
          >
            <FaGithub size={24} className="text-gray-800" />
          </button>
        </div>

        <p className="mt-4 text-lg text-center">
          Don't have an account?{' '}
          <NavLink to="/Registration" className="text-orange-500 hover:underline font-medium">
            Register here
          </NavLink>
        </p>
      </div>
    </div>
  );
}