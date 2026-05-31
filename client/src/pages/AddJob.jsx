import { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ company: '', position: '', status: 'Applied' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', formData);
      toast.success('Job added');
      navigate('/all-jobs');
    } catch (err) {
      toast.error('Error adding job');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 glass rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Add Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" placeholder="Company" required 
          className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white" 
          value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}
        />
        <input 
          type="text" placeholder="Position" required 
          className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white" 
          value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})}
        />
        <button type="submit" className="w-full py-3 rounded-xl gradient-btn text-white font-bold">Add</button>
      </form>
    </div>
  );
};
export default AddJob;
