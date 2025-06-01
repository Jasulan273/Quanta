import { useState, useEffect } from 'react';
import { User, Edit, Calendar, Save, BookOpen, Upload } from 'lucide-react';
import { updateUserProfile, updateUserAvatar } from '../../Api/profile';
import { API_URL } from '../../Api/api';

const UserProfile = ({ user, setUser }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    email: '',
    about: '',
    birthday: '',
    phone_number: '',
    gender: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email ?? '',
        about: user.about ?? '',
        birthday: user.birthday ?? '',
        phone_number: user.phone_number ?? '',
        gender: user.gender ?? '',
      });
    }
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = e => {
    setAvatarFile(e.target.files[0]);
  };

  const handleEdit = () => setEditing(true);

  const handleSave = async () => {
    setLoading(true);
    try {
     
      let patchData = {};
      Object.keys(form).forEach(key => {
        if ((user[key] ?? '') !== form[key]) {
          patchData[key] = form[key] === '' ? null : form[key];
        }
      });
      if (Object.keys(patchData).length > 0) {
        await updateUserProfile(patchData);
        setUser(prev => ({
          ...prev,
          ...patchData
        }));
      }

   
      if (avatarFile) {
        const avatarResponse = await updateUserAvatar(avatarFile);
        setUser(prev => ({
          ...prev,
          avatar: avatarResponse.avatar || prev.avatar
        }));
        setAvatarFile(null);
      }

      setEditing(false);
    } catch (error) {
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold overflow-hidden">
            {user?.avatar ? (
              <img src={`${API_URL}${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.username?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          {editing && (
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer">
              <Upload size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{user?.username || 'User Name'}</h2>
            {!editing ? (
              <button
                onClick={handleEdit}
                className="ml-2 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                title="Edit profile"
              >
                <Edit size={16} /> Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={loading}
                className="ml-2 flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                title="Save profile"
              >
                <Save size={16} /> {loading ? "Saving..." : "Save"}
              </button>
            )}
          </div>
          {editing ? (
            <>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input w-full mt-1 mb-1 p-1 border rounded"
                placeholder="Email"
              />
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                className="input w-full mt-1 mb-1 p-1 border rounded"
                placeholder="Phone"
              />
            </>
          ) : (
            <>
              <p className="text-gray-600">{user?.email || 'No email provided'}</p>
              <p className="text-gray-600">Role: {user?.role || 'No role'}</p>
              <p className="text-gray-600">Phone: {user?.phone_number || '+7 747 777 77 77'}</p>
            </>
          )}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <User size={20} /> Gender
          </h3>
          {editing ? (
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="input w-full mt-1 mb-1 p-1 border rounded"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <p>{user?.gender || 'Не указано'}</p>
          )}
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Calendar size={20} /> Birthday
          </h3>
          {editing ? (
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              className="input w-full mt-1 mb-1 p-1 border rounded"
            />
          ) : (
            <p>{user?.birthday || 'Не указано'}</p>
          )}
        </div>
        <div className="p-4 bg-white shadow rounded-lg col-span-2">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <BookOpen size={20} /> About Me
          </h3>
          {editing ? (
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              className="input w-full mt-1 mb-1 p-1 border rounded"
              placeholder="About you"
            />
          ) : (
            <p>{user?.about || 'Hello! My name is Bakhtyar, and I am a passionate author...'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;