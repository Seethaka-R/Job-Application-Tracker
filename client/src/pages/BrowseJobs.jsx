import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const BrowseJobs = () => {
  const [jobOffers, setJobOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await api.get('/job-offers');
        setJobOffers(res.data.jobOffers || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOffers();
  }, []);

  const handleApply = async (offer) => {
    try {
      await api.post('/jobs', {
        company: offer.company,
        position: offer.position,
        status: 'Applied',
        jobType: offer.jobType,
        jobLocation: offer.location
      });
      toast.success('Added to your tracked applications!');
    } catch (err) {
      toast.error('Failed to add application');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Browse Job Offers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobOffers.map(offer => (
          <div key={offer._id} className="p-6 glass rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">{offer.position}</h3>
              <p className="text-violet-400 font-semibold">{offer.company}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 text-xs rounded-lg bg-slate-700 text-slate-300">{offer.jobType}</span>
                <span className="px-2 py-1 text-xs rounded-lg bg-slate-700 text-slate-300">{offer.location}</span>
              </div>
              <p className="text-slate-300 mt-4 text-sm line-clamp-3">{offer.description}</p>
            </div>
            <button 
              onClick={() => handleApply(offer)}
              className="mt-6 w-full py-2 rounded-xl border border-violet-500/50 hover:bg-violet-500/20 text-violet-300 transition-colors"
            >
              Track / Apply
            </button>
          </div>
        ))}
        {jobOffers.length === 0 && <p className="text-slate-400">No job offers available right now.</p>}
      </div>
    </div>
  );
};
export default BrowseJobs;
