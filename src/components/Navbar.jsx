import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Bell, Search, MessageSquare } from 'lucide-react';

const Navbar = ({ onSearchClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const loggedInUsername = localStorage.getItem('username');

  const isActive = (path) => location.pathname === path;

  const handleProfileClick = () => {
    if (loggedInUsername) {
      navigate(`/${loggedInUsername}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-full flex items-center gap-10 shadow-2xl z-100">
      
      {/* 1. Global Feed Button */}
      <button 
        onClick={() => navigate('/')} 
        className={`transition transform active:scale-90 ${isActive('/') ? 'text-indigo-400 scale-110' : 'text-slate-400 hover:text-white'}`}
        title="Home Feed"
      >
        <Home size={24} />
      </button>

      {/* 2. Search Button */}
      <button 
        onClick={onSearchClick} 
        className="text-slate-400 hover:text-indigo-400 transition transform active:scale-90"
        title="Search Hubs"
      >
        <Search size={24} />
      </button>

      {/* NEW: 3. Message Hub Button */}
      <button 
        onClick={() => navigate('/inbox')} 
        className={`transition transform active:scale-90 ${isActive('/inbox') ? 'text-indigo-400 scale-110' : 'text-slate-400 hover:text-white'}`}
        title="Message Hub"
      >
        <MessageSquare size={24} />
      </button>
      
      {/* Visual Separator */}
      <div className="w-px h-6 bg-white/10"></div>

      {/* 4. Notifications Button */}
      <button 
        className="text-slate-400 hover:text-white transition transform active:scale-90"
        title="Notifications"
      >
        <Bell size={24} />
      </button>

      {/* 5. Personal Profile Hub Button */}
      <button 
        onClick={handleProfileClick}
        className={`transition transform active:scale-90 ${isActive(`/${loggedInUsername}`) ? 'text-indigo-400 scale-110' : 'text-slate-400 hover:text-white'}`}
        title="My Hub Profile"
      >
        <User size={24} />
      </button>
    </nav>
  );
};

export default Navbar;