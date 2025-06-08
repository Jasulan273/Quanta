import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../Api/api';

const Applications = ({ user, setUser }) => {
  const [statuses, setStatuses] = useState({
    author_status: 'none',
    author_reject_reason: '',
    journalist_status: 'none',
    journalist_reject_reason: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.role === 'student') {
      fetchApplicationStatuses();
    }
  }, [user]);

  const fetchApplicationStatuses = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/author/applies-status/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatuses(response.data);
    } catch (error) {
      console.error('Error fetching application statuses:', error);
    }
  };

  const applyForRole = async (role) => {
    try {
      const token = localStorage.getItem('accessToken');
      const endpoint = role === 'author' ? 'apply-author' : 'apply-journalist';
      const response = await axios.post(`${API_URL}/author/${endpoint}/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
      fetchApplicationStatuses();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error submitting application');
    }
  };

  const withdrawApplication = async (role) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`${API_URL}/author/withdraw/${role}/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
      fetchApplicationStatuses();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error withdrawing application');
    }
  };

  if (user?.role !== 'student' && (user?.role === 'author' || user?.is_journalist)) {
    return null;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Apply for Additional Roles</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      
      {user?.role === 'student' && statuses.author_status !== 'approved' && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Become a Course Author</h3>
          <p className="text-gray-600 mb-2">Status: {statuses.author_status}</p>
          {statuses.author_reject_reason && (
            <p className="text-red-600 mb-2">Rejection Reason: {statuses.author_reject_reason}</p>
          )}
          {statuses.author_status === 'pending' ? (
            <button
              onClick={() => withdrawApplication('author')}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Withdraw Application
            </button>
          ) : (
            <button
              onClick={() => applyForRole('author')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={statuses.author_status === 'rejected'}
            >
              Apply to be an Author
            </button>
          )}
        </div>
      )}

      {user?.role === 'student' && statuses.journalist_status !== 'approved' && (
        <div>
          <h3 className="text-xl font-semibold">Become a Journalist</h3>
          <p className="text-gray-600 mb-2">Status: {statuses.journalist_status}</p>
          {statuses.journalist_reject_reason && (
            <p className="text-red-600 mb-2">Rejection Reason: {statuses.journalist_reject_reason}</p>
          )}
          {statuses.journalist_status === 'pending' ? (
            <button
              onClick={() => withdrawApplication('journalist')}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Withdraw Application
            </button>
          ) : (
            <button
              onClick={() => applyForRole('journalist')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={statuses.journalist_status === 'rejected'}
            >
              Apply to be a Journalist
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Applications;