import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ company: '', position: '', description: '', jobType: 'Full-Time', location: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/job-offers', formData);
      toast.success('Job offer posted successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to post job');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 glass rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" placeholder="Company Name" required 
          className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white"
          value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}
        />
        <input 
          type="text" placeholder="Position" required 
          className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white"
          value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})}
        />
        <input 
          type="text" placeholder="Location (e.g. Remote, NY)" required 
          className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white"
          value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
        />
        <select 
          className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white"
          value={formData.jobType} onChange={e => setFormData({...formData, jobType: e.target.value})}
        >
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>
        <textarea 
          placeholder="Job Description" required rows="5"
          className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white"
          value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
        ></textarea>
        <button type="submit" className="w-full py-3 rounded-xl gradient-btn text-white font-bold">Post Job</button>
      </form>
    </div>
  );
};
export default PostJob;
