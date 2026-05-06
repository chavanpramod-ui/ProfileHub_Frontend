// client/src/components/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Bell, Search, MessageSquare, LogOut, PlusSquare } from 'lucide-react';
import BrandLogo from './BrandLogo';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUsername = localStorage.getItem('username');

  // Check if the current route matches the button
  const isActive = (path) => location.pathname === path;

  const handleProfileClick = () => {
    if (loggedInUsername) {
      navigate(`/${loggedInUsername}`);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // Clears token, username, and userId
    navigate('/login');
  };

  // List of navigation items
  const navItems = [
    { name: 'Home', icon: Home, path: '/', action: () => navigate('/') },
    { name: 'Create Post', icon: PlusSquare, path: '/create-post', action: () => navigate('/create-post') },
    
    // CRITICAL FIX: Updated path to '/search' and action to navigate!
    { name: 'Search', icon: Search, path: '/search', action: () => navigate('/search') }, 
    
    { name: 'Messages', icon: MessageSquare, path: '/inbox', action: () => navigate('/inbox') },
    { name: 'Notifications', icon: Bell, path: '/notifications', action: () => navigate('/notifications') },
    { name: 'Profile', icon: User, path: `/${loggedInUsername}`, action: handleProfileClick },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-72 bg-slate-950 border-r border-slate-800 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.65)] flex flex-col z-50">
      
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-900 bg-gradient-to-br from-[#0f4c81] to-[#1663b4]">
        <BrandLogo className="text-white" />
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 py-6 px-5 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.name}
              onClick={item.action}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-3xl transition-all duration-200 ${
                active 
                  ? 'bg-[#112c56] text-white font-semibold shadow-lg' 
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={24} className={active ? 'text-white' : 'text-slate-400'} />
              <span className="text-lg">{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Logout Button at the Bottom */}
      <div className="p-5 border-t border-slate-900">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 text-[#f97316] hover:bg-white/10 rounded-3xl transition-all font-semibold"
        >
          <LogOut size={24} />
          <span className="text-lg">Logout</span>
        </button>
      </div>
      
    </aside>
  );
};

export default Sidebar;