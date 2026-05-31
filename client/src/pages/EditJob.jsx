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

  const stages = ['Applied', 'Interview', 'Offer'];
  const currentStageIndex = stages.indexOf(formData.status);
  const isRejected = formData.status === 'Rejected';

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 glass rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Job Details</h2>
      
      {/* Visual Tracker */}
      <div className="mb-10 px-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-700 -z-10"></div>
          {stages.map((stage, index) => {
            let active = !isRejected && currentStageIndex >= index;
            let current = !isRejected && currentStageIndex === index;
            let bgColor = isRejected ? 'bg-rose-500' : active ? 'bg-violet-500' : 'bg-slate-700';
            let textColor = isRejected || active ? 'text-white' : 'text-slate-400';
            
            return (
              <div key={stage} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${bgColor} ${current ? 'ring-4 ring-violet-500/30' : ''}`}>
                  {index + 1}
                </div>
                <span className={`mt-2 text-xs font-semibold ${textColor}`}>{stage}</span>
              </div>
            );
          })}
        </div>
        {isRejected && (
          <div className="mt-4 text-center text-sm font-bold text-rose-500">
            Application Rejected
          </div>
        )}
      </div>

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
