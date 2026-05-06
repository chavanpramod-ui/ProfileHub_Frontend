import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Bell, Search, MessageSquare, PlusSquare } from 'lucide-react';

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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-2xl border-t border-white/10 px-4 py-3 flex items-center justify-around shadow-2xl z-50">
      
      {/* 1. Global Feed Button */}
      <button 
        onClick={() => navigate('/')} 
        className={`p-2 transition transform active:scale-90 ${isActive('/') ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
        title="Home Feed"
      >
        <Home size={22} />
      </button>

      {/* 2. Search Button */}
      <button 
        onClick={onSearchClick} 
        className="p-2 text-slate-400 hover:text-indigo-400 transition transform active:scale-90"
        title="Search Hubs"
      >
        <Search size={22} />
      </button>

      {/* 3. Create Post Button */}
      <button 
        onClick={() => navigate('/create-post')} 
        className={`p-2 transition transform active:scale-90 ${isActive('/create-post') ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
        title="Create Post"
      >
        <PlusSquare size={22} />
      </button>

      {/* 4. Message Hub Button */}
      <button 
        onClick={() => navigate('/inbox')} 
        className={`p-2 transition transform active:scale-90 ${isActive('/inbox') ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
        title="Message Hub"
      >
        <MessageSquare size={22} />
      </button>

      {/* 5. Notifications Button */}
      <button 
        onClick={() => navigate('/notifications')}
        className={`p-2 transition transform active:scale-90 ${isActive('/notifications') ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
        title="Notifications"
      >
        <Bell size={22} />
      </button>

      {/* 6. Personal Profile Hub Button */}
      <button 
        onClick={handleProfileClick}
        className={`p-2 transition transform active:scale-90 ${isActive(`/${loggedInUsername}`) ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
        title="My Hub Profile"
      >
        <User size={22} />
      </button>
    </nav>
  );
};

export default Navbar;