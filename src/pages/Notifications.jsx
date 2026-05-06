import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, Heart, MessageSquare, Share2, UserPlus, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const currentUsername = localStorage.getItem('username');
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch the user's profile to get their notifications array
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile/${currentUsername}`);
        
        // Reverse them so the newest notifications are at the top
        const reversedAlerts = (res.data.notifications || []).reverse();
        setNotifications(reversedAlerts);
        
        // Automatically tell the backend to mark them all as "read"
        if (reversedAlerts.some(n => !n.isRead)) {
          await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${currentUserId}/notifications/read`);
        }
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUsername) {
      fetchNotifications();
    }
  }, [currentUsername, currentUserId]);

  const getIcon = (type) => {
    switch(type) {
      case 'like': return <Heart className="text-red-500" fill="currentColor" size={20} />;
      case 'comment': return <MessageSquare className="text-[#0f4c81]" fill="currentColor" size={20} />;
      case 'follow': return <UserPlus className="text-green-500" size={20} />;
      case 'share': return <Share2 className="text-indigo-500" size={20} />;
      default: return <Bell className="text-indigo-500" size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef4ff] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0f4c81]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef4ff] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="rounded-t-[2rem] bg-gradient-to-r from-[#0f4c81] to-[#1463b9] p-6 shadow-lg flex items-center gap-3 mb-2 text-white">
          <div className="bg-white/10 p-2 rounded-2xl">
            <Bell className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-white/80 font-medium">Stay updated with your network.</p>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-b-[2rem] border border-slate-200 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.12)] overflow-hidden">
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <div 
                key={notif._id || index}
                onClick={() => navigate(`/${notif.senderUsername || notif.senderName}`)}
                className={`flex items-start gap-4 p-5 border-b border-slate-100 cursor-pointer transition-all hover:bg-[#eff6ff] ${
                  !notif.isRead ? 'bg-[#eff6ff]/40' : ''
                }`}
              >
                <div className="mt-1 bg-[#eff6ff] p-3 rounded-2xl shadow-sm shrink-0">
                  {getIcon(notif.type)}
                </div>
                
                <div className="flex-1">
                  <p className="text-slate-800">
                    <span className="font-bold text-slate-900 mr-1">{notif.senderName || notif.senderUsername || 'Someone'}</span>
                    {notif.message}
                  </p>
                  <p className="text-xs text-slate-400 font-semibold mt-1 uppercase tracking-wider">
                    {new Date(notif.date).toLocaleDateString()}
                  </p>
                </div>

                {!notif.isRead && (
                  <div className="w-2.5 h-2.5 bg-[#0f4c81] rounded-full mt-2 shrink-0 shadow-sm"></div>
                )}
              </div>
            ))
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="text-gray-300 mb-3" size={48} />
              <h3 className="text-lg font-bold text-slate-700">You're all caught up!</h3>
              <p className="text-slate-500 text-sm mt-1">When someone interacts with you, it will appear here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Notifications;
