import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { updateSkills } from '../services/api';
import axios from 'axios';

const SkillsModal = ({ isOpen, onClose, userId, currentSkills, onUpdate }) => {
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState(currentSkills || []);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

 const handleSave = async () => {
  try {
    // 1. Send the data to the backend
    const res = await updateSkills(userId, skills); 
    
    // 2. Pass the NEW user data back to Profile.jsx so it updates the UI
    if (res.data) {
      onUpdate(res.data); 
      onClose();
    }
  } catch (err) {
    console.error("Skills Update Error:", err);
    alert("Check your server console. Ensure the /update-skills route exists.");
  }
};

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-300 flex items-center justify-center p-4">
      <div className="bg-cool-gray rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-softgray">
          <h2 className="text-xl font-bold text-charcoal">Manage Technical Skills</h2>
          <button onClick={onClose} className="p-2 hover:bg-cool-gray rounded-full text-slate-muted">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g. React, Node.js, Java"
              className="flex-1 bg-cool-gray border border-softgray rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#0f4c81]"
            />
            <button onClick={handleAddSkill} className="bg-[#0f4c81] text-white p-2 rounded-xl hover:bg-[#113d66] transition">
              <Plus size={24} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-6 min-h-12 max-h-40 overflow-y-auto">
            {skills.map((skill, i) => (
              <span key={i} className="flex items-center gap-2 bg-cool-gray px-3 py-1.5 rounded-full text-xs font-bold text-slate-muted">
                {skill}
                <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500">
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <button onClick={handleSave} className="w-full bg-[#0f4c81] text-white py-3 rounded-xl font-bold hover:bg-[#113d66] transition shadow-md">
            Save Skills
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsModal;
