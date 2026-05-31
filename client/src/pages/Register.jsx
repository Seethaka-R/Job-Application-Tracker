import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(formData);
    if (res.success) navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 glass rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input 
            type="text" 
            placeholder="Name" 
            className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white" 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div>
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white" 
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        <button type="submit" className="w-full py-3 rounded-xl gradient-btn text-white font-bold">Register</button>
      </form>
    </div>
  );
};
export default Register;
