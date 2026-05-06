import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await registerUser(formData);
      localStorage.setItem('token', data.token);
      navigate(`/${formData.username}`); // Redirect to their new profile hub
    } catch (err) {
      alert("Registration failed. Try a different username.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-sky-50 to-blue-50 p-6">
      <div className="bg-white border border-sky-200 p-8 rounded-3xl w-full max-w-md shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="text-center mb-8">
          <BrandLogo label={false} />
          <h2 className="text-3xl font-bold text-slate-900 text-center mt-6">Create Hub</h2>
          <p className="text-slate-500 text-center mt-2">Join the professional community</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input 
              type="text" placeholder="Username" required
              className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:border-sky-400 outline-none"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input 
              type="email" placeholder="Email Address" required
              className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:border-sky-400 outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input 
              type="password" placeholder="Password" required
              className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:border-sky-400 outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl transition mt-4 flex items-center justify-center gap-2 shadow-lg shadow-sky-300/30">
            <UserPlus size={20} /> Register
          </button>
        </form>
        <p className="text-slate-500 text-center mt-6 text-sm">
          Already have a hub? <Link to="/login" className="text-sky-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;