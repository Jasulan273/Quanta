import { useState, useEffect } from 'react';
import { Edit, Plus, Trash2, Check, X, Power } from 'lucide-react';
import { 
  changeUserRole, 
  fetchUsers, 
  fetchAds, 
  createAd, 
  updateAd, 
  deleteAd,
  fetchApplications,
  approveApplication,
  rejectApplication,
  deactivateUser
} from '../../Api/moderator';

const ModeratorPanel = ({ activeTab }) => {
  const [users, setUsers] = useState([]);
  const [ads, setAds] = useState([]);
  const [applications, setApplications] = useState([]);
  const [adForm, setAdForm] = useState({
    name: '',
    content: '',
    url: '',
    image: null
  });
  const [editingAd, setEditingAd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editedRoles, setEditedRoles] = useState({});
  const [rejectReason, setRejectReason] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [userList, advertisements, apps] = await Promise.all([
          fetchUsers(),
          fetchAds(),
          fetchApplications()
        ]);
        setUsers(userList);
        setEditedRoles(userList.reduce((acc, user) => ({ ...acc, [user.id]: user.role }), {}));
        setAds(advertisements);
        setApplications(Array.isArray(apps) ? apps : []);
        console.log('Applications set:', apps);
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]);

  const handleRoleChange = (userId, newRole) => {
    setEditedRoles(prev => ({ ...prev, [userId]: newRole }));
  };

  const handleSaveRole = async (userId) => {
    const newRole = editedRoles[userId];
    if (newRole && newRole !== users.find(user => user.id === userId)?.role) {
      try {
        await changeUserRole(userId, { role: newRole });
        setUsers(prev => prev.map(user => user.id === userId ? { ...user, role: newRole } : user));
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Role change error:', error);
        setError('Failed to update role. Please try again.');
      }
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      await deactivateUser(userId);
      setUsers(prev => prev.map(user => user.id === userId ? { ...user, deactivation_status: true, deactivation_date: new Date().toISOString() } : user));
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Deactivate error:', error);
      setError('Failed to deactivate user. Please try again.');
    }
  };

  const handleApprove = async (userId, role) => {
    try {
      await approveApplication(userId, role);
      setApplications(prev => prev.map(app => 
        app.author_id === userId ? { ...app, [`${role}_status`]: 'approved', [`${role}_reject_reason`]: '' } : app
      ));
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Approve error:', error);
      setError(`Failed to approve ${role} application. Please try again.`);
    }
  };

  const handleReject = async (userId, role) => {
    if (!rejectReason) return;
    try {
      await rejectApplication(userId, role, { reason: rejectReason });
      setApplications(prev => prev.map(app => 
        app.author_id === userId ? { ...app, [`${role}_status`]: 'rejected', [`${role}_reject_reason`]: rejectReason } : app
      ));
      setRejectReason('');
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Reject error:', error);
      setError(`Failed to reject ${role} application. Please try again.`);
    }
  };

  const handleAdSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(adForm).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      if (editingAd) {
        const updatedAd = await updateAd(editingAd.id, formData);
        setAds(prev => prev.map(ad => ad.id === editingAd.id ? updatedAd : ad));
        setEditingAd(null);
      } else {
        const newAd = await createAd(formData);
        setAds(prev => [...prev, newAd]);
      }
      
      setAdForm({ name: '', content: '', url: '', image: null });
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Ad submit error:', error);
      setError('Failed to save advertisement. Please try again.');
    }
  };

  const handleAdEdit = (ad) => {
    setEditingAd(ad);
    setAdForm({
      name: ad.name,
      content: ad.content,
      url: ad.url,
      image: null
    });
  };

  const handleAdDelete = async (adId) => {
    try {
      await deleteAd(adId);
      setAds(prev => prev.filter(ad => ad.id !== adId));
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Ad delete error:', error);
      setError('Failed to delete advertisement. Please try again.');
    }
  };

  return (
    <div className="flex-1 bg-gray-100 p-6">
      {loading && <div className="text-center py-10">Loading...</div>}
      {error && <div className="text-center py-10 text-red-500">{error}</div>}

      {activeTab === 'users' && !loading && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 px-4 border-b">#</th>
                  <th className="py-2 px-4 border-b">Username</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Role</th>
                  <th className="py-2 px-4 border-b">Deactivation Status</th>
                  <th className="py-2 px-4 border-b">Deactivation Date</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                    <td className="py-2 px-4 border-b text-center">{user.username}</td>
                    <td className="py-2 px-4 border-b text-center">{user.email}</td>
                    <td className="py-2 px-4 border-b text-center">
                      <select
                        value={editedRoles[user.id] || user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="border rounded px-2 py-1 w-full text-center"
                      >
                        <option value="student">Student</option>
                        <option value="author">Author</option>
                        <option value="journalist">Journalist</option>
                        <option value="author_journalist">All</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 border-b text-center">{user.deactivation_status ? 'Deactivated' : 'None'}</td>
                    <td className="py-2 px-4 border-b text-center">{user.deactivation_date ? new Date(user.deactivation_date).toLocaleDateString() : 'N/A'}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleSaveRole(user.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleDeactivateUser(user.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded"
                        >
                          <Power size={16} /> Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ads' && !loading && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Advertisements</h2>
          <form onSubmit={handleAdSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Ad Name"
                value={adForm.name}
                onChange={(e) => setAdForm({ ...adForm, name: e.target.value })}
                className="border rounded px-3 py-2"
                required
              />
              <textarea
                placeholder="Ad Content"
                value={adForm.content}
                onChange={(e) => setAdForm({ ...adForm, content: e.target.value })}
                className="border rounded px-3 py-2"
                rows={4}
                required
              />
              <input
                type="url"
                placeholder="Ad URL"
                value={adForm.url}
                onChange={(e) => setAdForm({ ...adForm, url: e.target.value })}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAdForm({ ...adForm, image: e.target.files[0] })}
                className="border rounded px-3 py-2"
              />
              <button
                type="submit"
                className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded"
              >
                {editingAd ? <Edit size={16} /> : <Plus size={16} />}
                {editingAd ? 'Update Ad' : 'Create Ad'}
              </button>
            </div>
          </form>
          <div className="grid gap-4">
            {ads.map(ad => (
              <div key={ad.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{ad.name}</h3>
                  <p dangerouslySetInnerHTML={{ __html: ad.content }} />
                  <p>URL: <a href={ad.url} className="text-blue-500">{ad.url}</a></p>
                  {ad.image && (
                    <img src={ad.image} alt={ad.name} className="w-32 h-32 object-cover mt-2" />
                  )}
                  <p>Created: {new Date(ad.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAdEdit(ad)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleAdDelete(ad.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'applications' && !loading && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Applications (Total: {applications.length}, Pending: {
              applications.filter(app => 
                app.author_status === 'pending' || app.journalist_status === 'pending'
              ).length
            })
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 px-4 border-b">#</th>
                  <th className="py-2 px-4 border-b">Username</th>
                  <th className="py-2 px-4 border-b">Author Status</th>
                  <th className="py-2 px-4 border-b">Journalist Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-2 px-4 border-b text-center">No applications found</td>
                  </tr>
                ) : (
                  applications.map((app, index) => (
                    <tr key={app.author_id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                      <td className="py-2 px-4 border-b text-center">{app.author_username}</td>
                      <td className="py-2 px-4 border-b text-center">{app.author_status}</td>
                      <td className="py-2 px-4 border-b text-center">{app.journalist_status}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex gap-2 justify-center">
                          {app.author_status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(app.author_id, 'author')}
                                className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded"
                              >
                                <Check size={16} /> Approve
                              </button>
                              <button
                                onClick={() => setRejectReason('')}
                                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded"
                              >
                                <X size={16} /> Reject
                              </button>
                              <input
                                type="text"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Reason"
                                className="border rounded px-2 py-1"
                              />
                              <button
                                onClick={() => handleReject(app.author_id, 'author')}
                                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded"
                                disabled={!rejectReason}
                              >
                                <X size={16} /> Confirm Reject
                              </button>
                            </>
                          )}
                          {app.journalist_status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(app.author_id, 'journalist')}
                                className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded"
                              >
                                <Check size={16} /> Approve
                              </button>
                              <button
                                onClick={() => setRejectReason('')}
                                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded"
                              >
                                <X size={16} /> Reject
                              </button>
                              <input
                                type="text"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Reason"
                                className="border rounded px-2 py-1"
                              />
                              <button
                                onClick={() => handleReject(app.author_id, 'journalist')}
                                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded"
                                disabled={!rejectReason}
                              >
                                <X size={16} /> Confirm Reject
                              </button>
                            </>
                          )}
                          {(app.author_status !== 'pending' && app.journalist_status !== 'pending') && (
                            <span className="text-gray-500">No actions available</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorPanel;