import React, { useState, useEffect } from 'react';
import { X, Save, Globe, Github, Code2, Linkedin } from 'lucide-react';
import { updateLinks } from '../services/api';

const EditLinksModal = ({ isOpen, onClose, userId, currentLinks }) => {
  const [links, setLinks] = useState({
    github: '',
    leetcode: '',
    linkedin: ''
  });
  const [loading, setLoading] = useState(false);

  // Sync state with existing links when modal opens
  useEffect(() => {
    if (currentLinks) {
      setLinks({
        github: currentLinks.github || '',
        leetcode: currentLinks.leetcode || '',
        linkedin: currentLinks.linkedin || ''
      });
    }
  }, [currentLinks, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Sends data to your Node.js backend to update the User document
      await updateLinks({ userId, ...links });
      setLoading(false);
      onClose();
      window.location.reload(); // Refresh to trigger the new real-time stats fetch
    } catch (err) {
      console.error("Failed to update links:", err);
      setLoading(false);
      alert("Could not update links. Ensure your server is running.");
    }
  };
// Updated styling for EditLinksModal.jsx
return (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-110 p-4">
    <div className="bg-cool-gray border border-softgray w-full max-w-md rounded-3xl p-8 relative shadow-2xl">
      <button onClick={onClose} className="absolute top-6 right-6 text-slate-muted hover:text-charcoal">
        <X size={24} />
      </button>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-charcoal flex items-center gap-3">
          <Globe className="text-[#0f4c81]" /> Connect Profiles
        </h2>
        <p className="text-slate-muted text-sm mt-1">Sync your professional data hubs.</p>
      </div>
      
      <form onSubmit={handleSave} className="space-y-4">
        {['github', 'leetcode', 'linkedin'].map((platform) => (
          <div key={platform} className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-muted uppercase tracking-widest flex items-center gap-2">
              {platform === 'github' && <Github size={12} />}
              {platform === 'leetcode' && <Code2 size={12} />}
              {platform === 'linkedin' && <Linkedin size={12} />}
              {platform} Profile URL
            </label>
            <input 
              type="url" 
              value={links[platform]} 
              className="w-full bg-cool-gray border border-softgray rounded-xl px-4 py-3 text-charcoal outline-none focus:border-[#0f4c81] transition-all"
              onChange={(e) => setLinks({...links, [platform]: e.target.value})}
            />
          </div>
        ))}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#0f4c81] hover:bg-[#113d66] text-white font-bold py-3.5 rounded-xl mt-4 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "Syncing..." : "Update Connections"}
        </button>
      </form>
    </div>
  </div>
);
};

export default EditLinksModal;
