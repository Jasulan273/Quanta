import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../Api/auth';

export default function VerifyEmail() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const key = new URLSearchParams(window.location.search).get('key');
      if (!key) {
        setMessage('Invalid or missing verification key.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await verifyEmail(key);
        setMessage(response.detail || 'Email confirmed successfully.');
        setTimeout(() => navigate('/Auth'), 3000);
      } catch (err) {
        setMessage(
          err?.response?.data?.detail ||
          'Verification failed. The link is invalid or has expired.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen py-10 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-10 text-center">
        <h2 className="text-3xl font-bold mb-8 text-orange-500">Email Verification</h2>
        {isLoading ? (
          <p className="text-lg text-gray-700">Verifying your email...</p>
        ) : (
          <p className={`text-lg ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}