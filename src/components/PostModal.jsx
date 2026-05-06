import React, { useState, useEffect } from 'react';
import { X, Send, Award, Image as ImageIcon, Type } from 'lucide-react';
import axios from 'axios';
import { updateAchievement } from '../services/api';
import { useNavigate } from 'react-router-dom';

const PostModal = ({ isOpen, onClose, userId, editData }) => {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Sync form data with editData or reset for new posts
  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || '',
        content: editData.description || editData.content || ''
      });
      // Handle existing image preview
      if (editData.image) {
        setPreview(editData.image.startsWith('http') ? editData.image : `http://localhost:5000/${editData.image}`);
      }
    } else {
      setFormData({ title: '', content: '' });
      setFile(null);
      setPreview(null);
    }
  }, [editData, isOpen]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData) {
        // CALL UPDATE API (Preserves your existing update logic)
        await updateAchievement(userId, editData._id, formData);
      } else {
        // CALL CREATE API WITH FILE UPLOAD
        const uploadData = new FormData();
        uploadData.append('userId', userId);
        uploadData.append('title', formData.title);
        uploadData.append('content', formData.content);
        if (file) {
          uploadData.append('image', file);
        }

        await axios.post('http://localhost:5000/api/users/create-post', uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      setLoading(false);
      onClose();
      
      // Redirect to Home Feed to see the post instantly
      navigate('/'); 
      window.location.reload(); 
    } catch (err) {
      console.error("Operation failed", err);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-250 p-4 animate-in fade-in duration-300">
      {/* Main Glassmorphic Container */}
      <div className="bg-slate-900/80 border border-white/10 w-full max-w-lg rounded-[3rem] p-10 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
        >
          <X size={20} />
        </button>
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-linear-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg shadow-indigo-500/20">
            <Award size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {editData ? "Refine Entry" : "New Milestone"}
            </h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
              {editData ? "Update your achievement" : "Share a new success"}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
              <Type size={12} /> Achievement Title
            </label>
            <input 
              type="text" 
              placeholder="e.g., Completed MERN Stack Training" 
              value={formData.title}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          {/* Content Textarea */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
              <Award size={12} /> The Story
            </label>
            <textarea 
              placeholder="Tell the community about your journey..." 
              rows="4" 
              value={formData.content}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner resize-none"
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required
            />
          </div>

          {/* LOCAL FILE UPLOAD INPUT */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
              <ImageIcon size={12} /> Showcase Image (Upload)
            </label>
            
            {preview ? (
              <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-80" />
                <button 
                  type="button" 
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-3 right-3 bg-slate-900/80 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-24 bg-white/5 border border-dashed border-white/20 hover:border-indigo-500/50 rounded-2xl cursor-pointer transition-all shadow-inner">
                <div className="flex items-center gap-2 text-slate-500">
                  <ImageIcon size={16} />
                  <span className="font-medium text-sm">Click to browse local files</span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-white text-slate-950 font-black py-5 rounded-3xl flex items-center justify-center gap-3 transition-all hover:bg-indigo-50 active:scale-95 shadow-xl shadow-white/5 mt-4 group"
          >
            {loading ? (
              <span className="animate-pulse">Syncing with Hub...</span>
            ) : (
              <>
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                {editData ? "Update Achievement" : "Publish to Global Feed"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostModal;