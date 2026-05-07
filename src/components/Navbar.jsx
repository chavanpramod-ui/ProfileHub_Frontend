import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Bell, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUsername = localStorage.getItem('username');

  // --- CRITICAL: LOGOUT LOGIC ---
  const handleLogout = () => {
    // 1. Clear all saved user data from the phone
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    
    // 2. Send them back to the login screen
    navigate('/login');
  };

  // Define the main navigation buttons
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/create-post', icon: PlusSquare, label: 'Post' },
    { path: '/notifications', icon: Bell, label: 'Alerts' },
    { path: `/${currentUsername}`, icon: User, label: 'Profile' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 py-3 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
      
      {/* Map through the standard navigation items */}
      {navItems.map((item) => {
        const Icon = item.icon;
        // Check if this button matches the page we are currently on
        const isActive = location.pathname === item.path;
        
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center p-2 transition-colors ${
              isActive ? 'text-sky-600' : 'text-slate-400 hover:text-sky-500'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
          </button>
        );
      })}
      
      {/* --- NEW: MOBILE LOGOUT BUTTON --- */}
      <div className="w-[1px] h-6 bg-slate-200 mx-1"></div> {/* Separator Line */}
      
      <button
        onClick={handleLogout}
        className="flex flex-col items-center p-2 text-red-400 hover:text-red-600 transition-colors"
        title="Logout"
      >
        <LogOut size={24} strokeWidth={2.5} />
      </button>

    </div>
  );
};

export default Navbar;