import { useState, useEffect } from 'react';
import api from '../utils/api';

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">All Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map(job => (
          <div key={job._id} className="p-6 glass rounded-2xl">
            <h3 className="text-xl font-semibold text-white">{job.position}</h3>
            <p className="text-slate-300">{job.company}</p>
            <span className="inline-block px-3 py-1 mt-2 text-sm rounded-full bg-violet-500/20 text-violet-300">{job.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AllJobs;
