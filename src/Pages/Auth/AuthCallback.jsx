import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthCallback({ setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const code = new URLSearchParams(location.search).get('code');
      const provider = localStorage.getItem('authProvider');

      if (!code || !provider) {
        navigate('/Auth', { state: { error: 'Authentication failed. Please try again.' } });
        return;
      }

      try {
        const endpoint = provider === 'google' 
          ? 'https://quant.up.railway.app/auth/google/callback/'
          : 'https://quant.up.railway.app/auth/github/callback/';

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });

        const data = await response.json();

        if (data.access) {
          localStorage.setItem('accessToken', data.access);
          localStorage.setItem('username', data.username || 'Social User');
          setUser(data.username || 'Social User');
          localStorage.removeItem('authProvider');
          navigate('/Home');
        } else {
          throw new Error('No access token received');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/Auth', { state: { error: 'Authentication failed. Please try again.' } });
      }
    };

    handleCallback();
  }, [navigate, setUser, location]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700">Processing authentication...</h2>
      </div>
    </div>
  );
}