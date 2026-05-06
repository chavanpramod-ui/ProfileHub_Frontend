import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import CreatePost from './pages/CreatePost';
import SearchPage from './pages/SearchPage'; 
import Messages from './pages/Messages'; 
import Notifications from './pages/Notifications';
import { useState } from 'react';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  
  // Hide sidebar on auth pages
  const hideSidebarRoutes = ['/login', '/register'];
  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="bg-gradient-to-br from-[#f4f7fc] via-[#eef4ff] to-[#f8fbff] min-h-screen text-slate-900 flex flex-col md:flex">
      {/* Desktop Sidebar - hidden on mobile */}
      {shouldShowSidebar && <div className="hidden md:block">
        <Sidebar />
      </div>}
      
      <main className={`flex-1 w-full transition-all duration-300 pb-24 md:pb-0 ${shouldShowSidebar ? 'md:ml-72' : ''}`}>
        {children}
      </main>
      
      {/* Mobile Bottom Navigation - hidden on desktop */}
      {shouldShowSidebar && <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <Navbar onSearchClick={() => setShowSearch(true)} />
      </div>}
    </div>
  );
};

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/inbox" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/:username" element={<Profile />} />
          <Route path="/dashboard" element={<Navigate to="/" />} />
          <Route path="*" element={
            <div className="h-screen flex items-center justify-center px-4 text-slate-500 font-black uppercase tracking-widest text-center">
              Hub Not Found
            </div>
          } />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;