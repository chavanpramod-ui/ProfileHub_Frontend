import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, MapPin, Users, Globe, Mail, MessageSquare, Camera } from 'lucide-react'; // Added Camera import

// Added previewUrl and onFileChange to props
const ProfileHeader = ({ user, onEditLinks, onEditProfile, onFollow, onViewFollowers, followed, currentUser, previewUrl, onFileChange }) => {
  const navigate = useNavigate();
  const isOwner = localStorage.getItem('username') === user.username;

  // Function to handle message button click
  const handleMessageClick = () => {
    if (!currentUser?._id) {
      alert('Please login to message this user.');
      return;
    }

    navigate('/inbox');
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="relative bg-white border border-sky-200 rounded-[2rem] shadow-[0_35px_60px_-40px_rgba(56,189,248,0.16)] overflow-hidden">
        <div className="h-32 md:h-44 bg-gradient-to-br from-sky-600 via-sky-700 to-blue-600 border-b border-sky-200" />

        <div className="px-6 md:px-10 pb-8 -mt-12 md:-mt-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            
            {/* --- UPDATED PROFILE PICTURE CONTAINER --- */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-sky-600 rounded-full border-4 border-white shadow-md flex items-center justify-center text-4xl md:text-5xl font-bold text-white uppercase overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : user.profilePicture ? (
                  <img src={`http://localhost:5000/${user.profilePicture}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.displayName?.charAt(0) || user.username?.charAt(0)
                )}
              </div>

              {/* Hidden Input & Hover Overlay (Only visible to the owner) */}
              {isOwner && (
                <>
                  <label 
                    htmlFor="profilePic" 
                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Camera className="text-white" size={32} />
                  </label>
                  <input 
                    type="file" 
                    id="profilePic" 
                    accept="image/png, image/jpeg, image/jpg" 
                    className="hidden" 
                    onChange={onFileChange} 
                  />
                </>
              )}
            </div>
            {/* --- END PROFILE PICTURE CONTAINER --- */}

            <div className="flex gap-2 mb-2 w-full md:w-auto">
              {isOwner ? (
                <>
                  <button 
                    onClick={onEditProfile}
                    className="flex-1 md:flex-none px-6 py-2 bg-white border border-sky-200 text-sky-700 rounded-full font-bold hover:bg-sky-50 transition-all active:scale-95"
                  >
                    Edit Hub
                  </button>
                  <button 
                    onClick={onEditLinks}
                    className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                    title="Connect Profiles"
                  >
                    <Settings size={20} />
                  </button>
                </>
              ) : (
                <>
                  {/* Message Button for visitors */}
                  <button 
                    onClick={handleMessageClick}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-white border border-sky-200 text-sky-700 rounded-full font-bold hover:bg-sky-50 transition-all active:scale-95"
                  >
                    <MessageSquare size={18} />
                    Message
                  </button>

                  <button 
                    onClick={onFollow}
                    className={`flex-1 md:flex-none px-8 py-2 rounded-full font-bold transition-all active:scale-95 ${
                      followed 
                      ? 'bg-slate-100 text-slate-700 border border-slate-200' 
                      : 'bg-sky-600 text-white hover:bg-sky-700'
                    }`}
                  >
                    {followed ? 'Following' : 'Follow'}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 text-left">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                {user.displayName || user.username}
              </h1>
              <div className="bg-sky-100 text-sky-700 p-1 rounded-full" title="Verified Professional">
                <Globe size={14} />
              </div>
            </div>

            <p className="text-md md:text-lg text-slate-600 font-medium mt-1">
              {user.bio || "MERN STACK DEVELOPER"}
            </p>
            
            <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-sky-400" />
                <span>{user.location || "Nashik, MH"}</span>
              </div>
              
              <button 
                onClick={onViewFollowers}
                className="flex items-center gap-1.5 hover:text-sky-700 transition-colors"
              >
                <Users size={16} className="text-sky-400" />
                <span className="font-bold text-slate-700">{user.followers?.length || 0}</span>
                <span className="ml-1">connections</span>
              </button>

              <div className="text-sky-700 font-bold cursor-pointer hover:underline flex items-center gap-1.5">
                <Mail size={16} />
                <span>Contact info</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;