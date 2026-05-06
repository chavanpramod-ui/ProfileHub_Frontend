import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, MapPin, GraduationCap } from 'lucide-react';
import axios from 'axios';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  // Sync local state with user prop whenever modal opens
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    education: '',
    location: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        bio: user.bio || '',
        education: user.education || '',
        location: user.location || '',
        email: user.email || ''
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  // Integrated Logic: Handles the database update and UI refresh
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Send updated data to your MERN backend
      // Using the dynamic userId from the logged-in session
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/update/${user._id}`, formData);
      
      // 2. Refresh the UI in Profile.jsx with the new data
      onUpdate(res.data); 
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile. Ensure your server is running on port 5000.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-[250] p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-8 relative shadow-2xl">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <User className="text-indigo-400" /> Edit Profile Info
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Input */}
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1 flex items-center gap-1 tracking-widest">
              <User size={12}/> Full Name
            </label>
            <input 
              type="text" 
              value={formData.displayName} 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-3.5 text-white mt-1 outline-none focus:border-indigo-500 transition shadow-inner"
              onChange={(e) => setFormData({...formData, displayName: e.target.value})} 
            />
          </div>

          {/* Bio Input */}
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1 flex items-center gap-1 tracking-widest">
              <GraduationCap size={12}/> Qualification / Bio
            </label>
            <input 
              type="text" 
              value={formData.bio} 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-3.5 text-white mt-1 outline-none focus:border-indigo-500 transition shadow-inner"
              onChange={(e) => setFormData({...formData, bio: e.target.value})} 
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1 flex items-center gap-1 tracking-widest">
              <GraduationCap size={12}/> Education Details
            </label>
            <textarea
              value={formData.education}
              rows={4}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-3.5 text-white mt-1 outline-none focus:border-indigo-500 transition shadow-inner resize-none"
              onChange={(e) => setFormData({...formData, education: e.target.value})}
              placeholder="Enter your school, college, degree, year, and any relevant academic details"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Location Input */}
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1 flex items-center gap-1 tracking-widest">
                <MapPin size={12}/> Location
              </label>
              <input 
                type="text" 
                value={formData.location} 
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-3.5 text-white mt-1 outline-none focus:border-indigo-500 transition shadow-inner"
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1 flex items-center gap-1 tracking-widest">
                <Mail size={12}/> Email Address
              </label>
              <input 
                type="email" 
                value={formData.email} 
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-3.5 text-white mt-1 outline-none focus:border-indigo-500 transition shadow-inner"
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>

          {/* Submit Button Linked to Logic */}
          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-3xl mt-4 flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            <Save size={18} /> Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;