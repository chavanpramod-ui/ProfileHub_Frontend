import React from 'react';
import { X, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FollowersModal = ({ isOpen, onClose, followers }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-[120] p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] p-8 relative shadow-2xl animate-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24} /></button>
        
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Users className="text-blue-400" /> Followers Hub
        </h2>
        
        <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {followers?.length > 0 ? (
            followers.map((follower) => (
              <div 
                key={follower._id}
                onClick={() => { navigate(`/${follower.username}`); onClose(); }}
                className="flex items-center gap-4 p-4 hover:bg-slate-800/50 rounded-2xl cursor-pointer transition-colors mb-2"
              >
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
                  {follower.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{follower.username}</p>
                  <p className="text-slate-500 text-xs">{follower.bio || "MERN Developer"}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 py-10">No followers yet. Share your Hub!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;