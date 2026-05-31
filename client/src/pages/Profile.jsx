import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, loadUser } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      await api.post('/auth/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Resume uploaded successfully');
      loadUser();
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 glass rounded-2xl text-white">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
      <div className="mb-6">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>

      <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
        <h3 className="text-lg font-semibold mb-4">Resume</h3>
        {user?.resume ? (
          <div className="mb-4">
            <a href={`http://localhost:5000/${user.resume}`} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">
              View Current Resume
            </a>
          </div>
        ) : (
          <p className="mb-4 text-slate-400">No resume uploaded.</p>
        )}

        <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-4">
          <input 
            type="file" 
            accept=".pdf,.doc,.docx"
            onChange={e => setFile(e.target.files[0])}
            className="flex-1 p-2 rounded-xl border border-slate-700/50 text-sm bg-slate-900/50"
          />
          <button 
            type="submit" 
            disabled={uploading}
            className="px-6 py-2 rounded-xl gradient-btn font-semibold disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Profile;
