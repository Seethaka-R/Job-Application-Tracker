import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ company: '', position: '', status: '' });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setFormData(res.data.job);
      } catch (err) {
        toast.error('Error loading job');
      }
    };
    fetchJob();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/jobs/${id}`, formData);
      toast.success('Job updated');
      navigate('/all-jobs');
    } catch (err) {
      toast.error('Error updating job');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 glass rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Edit Job</h2>
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
        <select 
          className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white"
          value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="submit" className="w-full py-3 rounded-xl gradient-btn text-white font-bold">Update</button>
      </form>
    </div>
  );
};
export default EditJob;
