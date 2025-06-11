import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../Api/api';

const Certificates = ({ user }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/certificates/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCertificates(response.data);
        setLoading(false);
      } catch {
        setError('Failed to fetch certificates');
        setLoading(false);
      }
    };

    if (user && user.role?.toLowerCase() !== 'moderator') {
      fetchCertificates();
    }
  }, [user]);

  if (user?.role?.toLowerCase() === 'moderator') return null;
  if (loading) return <div>Loading certificates...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Certificates</h2>
      {certificates.length === 0 ? (
        <p className="text-gray-500">No certificates available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {certificates.map((cert, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow border border-gray-200 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{cert.course}</h3>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Issued:</strong> {new Date(cert.issued_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Score:</strong> {cert.score}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={cert.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
                >
                  View Certificate
                </a>
                <a
                  href={cert.verify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-sm font-medium"
                >
                  Verify Certificate
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
