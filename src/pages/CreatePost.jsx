import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Image as ImageIcon, X, Loader2, Send, Award, UserCircle2 } from 'lucide-react';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get current username for the UI (Optional nice touch)
  const username = localStorage.getItem('username') || 'Developer';

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('userId', localStorage.getItem('userId'));
      formData.append('title', title);
      formData.append('content', content);
      formData.append('provider', provider);
      
      if (image) {
        formData.append('image', image);
      }

      await axios.post('http://localhost:5000/api/users/create-post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      navigate('/');
      window.location.reload(); 
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if form is ready to submit
  const isFormValid = title.trim() && content.trim();

  return (
    <div className="min-h-screen bg-[#eef4ff] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Create a New Post</h2>

        {/* --- NEW STYLED CARD --- */}
        <div className="bg-white rounded-4xl shadow-[0_24px_60px_-24px_rgba(15,23,42,0.18)] border border-slate-200 overflow-hidden transition-all hover:shadow-[0_28px_80px_-40px_rgba(15,23,42,0.18)]">
          
          {/* Top Banner Context */}
          <div className="px-6 py-5 bg-linear-to-r from-[#0f4c81] to-[#1663b4] border-b border-slate-200 flex items-center gap-3 text-white">
            <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center">
              <UserCircle2 size={24} />
            </div>
            <div>
              <p className="font-semibold text-white text-sm capitalize">{username}</p>
              <p className="text-xs text-white/80 font-medium">Sharing a new professional milestone</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
            
            {/* Input Area */}
            <div className="p-6 space-y-5">
              
              {/* Title Input */}
              <div>
                <input
                  type="text"
                  required
                  className="w-full text-2xl font-bold text-slate-800 placeholder-slate-300 border-none focus:ring-0 px-0"
                  placeholder="Achievement Title (e.g., Earned Java Certificate)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Organization Input with Icon */}
              <div className="flex items-center gap-3 text-slate-500 bg-[#f8fafc] px-4 py-2.5 rounded-xl border border-slate-200">
                <Award size={18} className="text-[#0f4c81]" />
                <input
                  type="text"
                  className="w-full text-sm font-medium bg-transparent border-none focus:ring-0 px-0 placeholder-slate-400 text-slate-700"
                  placeholder="Issuing Organization (e.g., Apna College, Coursera)"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                />
              </div>

              {/* Main Content Textarea */}
              <div>
                <textarea
                  required
                  className="w-full min-h-35 text-lg leading-relaxed text-slate-700 placeholder-slate-400 border-none focus:ring-0 resize-none px-0 mt-2"
                  placeholder="What do you want to talk about? Share your experience..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {/* Image Preview Area */}
              {preview && (
                <div className="relative mt-4 rounded-xl overflow-hidden border-2 border-slate-200 bg-white group">
                  <img src={preview} alt="Upload preview" className="w-full h-auto max-h-100 object-contain transition-transform duration-300 group-hover:scale-[1.02]" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-slate-900/70 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-all shadow-lg"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Action Footer */}
            <div className="px-6 py-4 bg-[#eff6ff] border-t border-slate-100 flex items-center justify-between">
              
              {/* Image Upload Button */}
              <div>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label 
                  htmlFor="image-upload"
                  className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-[#0f4c81] hover:bg-[#eff6ff] px-4 py-2.5 rounded-full transition-all font-semibold text-sm"
                >
                  <ImageIcon size={20} className={preview ? "text-[#0f4c81]" : ""} />
                  <span>{preview ? 'Change Image' : 'Add Image'}</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`flex items-center gap-2 px-7 py-2.5 rounded-full font-bold text-sm transition-all duration-200 shadow-sm ${
                  !isFormValid || loading
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#0f4c81] text-white hover:bg-[#113d66] hover:shadow-md active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Publish Post
                  </>
                )}
              </button>
            </div>
            
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default CreatePost;
