import { useState, useEffect } from 'react';
import api from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/jobs/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 glass rounded-2xl">
            <h3 className="text-xl font-semibold text-white">Total Jobs</h3>
            <p className="text-3xl text-violet-400 mt-2">{stats.totalJobs || 0}</p>
          </div>
        </div>
      ) : (
        <p className="text-slate-300">Loading stats...</p>
      )}
    </div>
  );
};
export default Dashboard;
