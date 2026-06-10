import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; 
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate(); // Kept just in case you use it elsewhere later

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/register', formData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);
      
      // --- CRITICAL FIX: Hard redirect to clear stale state ---
      window.location.href = `/${formData.username}`; 
    } catch (err) {
      alert("Registration failed. Try a different username.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-sky-100 via-sky-50 to-blue-50 p-3 md:p-6">
      <div className="bg-cool-gray border border-sky-200 p-6 md:p-8 rounded-3xl w-full max-w-md shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="text-center mb-6 md:mb-8">
          <BrandLogo label={false} />
          <h2 className="text-2xl md:text-3xl font-bold text-charcoal text-center mt-6">Create Hub</h2>
          <p className="text-slate-muted text-center mt-2 text-sm">Join the professional community</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3 md:space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-3 md:top-3.5 text-slate-muted" size={20} />
            <input 
              type="text" placeholder="Username" required
              className="w-full bg-cool-gray border border-softgray rounded-xl py-2.5 md:py-3 pl-12 pr-4 text-sm md:text-base text-charcoal focus:border-sky-400 outline-none"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-3 md:top-3.5 text-slate-muted" size={20} />
            <input 
              type="email" placeholder="Email Address" required
              className="w-full bg-cool-gray border border-softgray rounded-xl py-2.5 md:py-3 pl-12 pr-4 text-sm md:text-base text-charcoal focus:border-sky-400 outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-3 md:top-3.5 text-slate-muted" size={20} />
            <input 
              type="password" placeholder="Password" required
              className="w-full bg-cool-gray border border-softgray rounded-xl py-2.5 md:py-3 pl-12 pr-4 text-sm md:text-base text-charcoal focus:border-sky-400 outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl transition mt-4 flex items-center justify-center gap-2 shadow-lg shadow-sky-300/30 text-sm md:text-base">
            <UserPlus size={20} /> Register
          </button>
        </form>
        <p className="text-slate-muted text-center mt-4 md:mt-6 text-xs md:text-sm">
          Already have a hub? <Link to="/login" className="text-sky-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;