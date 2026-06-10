import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; 
import { LogIn, Mail, Lock } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Kept just in case you use it elsewhere later

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/users/login', formData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId); 
      localStorage.setItem('username', data.username); 
      
      // --- CRITICAL FIX: Hard redirect to clear stale state ---
      window.location.href = `/${data.username}`;
    } catch (err) {
      alert("Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-sky-50 to-blue-50 p-3 md:p-6 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-300/30 blur-[120px] rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-300/25 blur-[120px] rounded-full" />

      <div className="relative z-10 bg-cool-gray/95 backdrop-blur-xl border border-sky-200/80 p-6 md:p-10 rounded-[2.5rem] w-full max-w-md shadow-[0_28px_60px_rgba(15,23,42,0.12)]">
        <div className="text-center mb-8 md:mb-10 flex flex-col items-center gap-4">
          <BrandLogo label={false} />
          <p className="text-sky-600 text-xs font-bold uppercase tracking-[0.2em] mt-2">Access your professional data</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-muted uppercase tracking-widest ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-muted" size={18} />
              <input 
                type="email" 
                placeholder="name@university.com" 
                required
                className="w-full bg-cool-gray border border-softgray rounded-2xl py-3 md:py-4 pl-14 pr-4 text-sm md:text-base text-charcoal focus:border-sky-400 outline-none transition-all shadow-sm"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-muted uppercase tracking-widest ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-muted" size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                className="w-full bg-cool-gray border border-softgray rounded-2xl py-3 md:py-4 pl-14 pr-4 text-sm md:text-base text-charcoal focus:border-sky-400 outline-none transition-all shadow-sm"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-sky-600 text-white font-black py-3 md:py-4 rounded-2xl transition-all mt-4 flex items-center justify-center gap-2 hover:bg-sky-700 active:scale-95 shadow-xl shadow-sky-300/30 disabled:opacity-50 text-sm md:text-base"
          >
            {loading ? "AUTHENTICATING..." : <><LogIn size={20} /> ENTER HUB</>}
          </button>
        </form>

        <p className="text-slate-muted text-center mt-6 md:mt-8 text-xs md:text-sm font-medium">
          New here? <Link to="/register" className="text-sky-600 font-bold hover:underline">Create a Hub</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;