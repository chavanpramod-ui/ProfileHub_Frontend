import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './components/Sidebar'; 
import CreatePost from './pages/CreatePost';
import SearchPage from './pages/SearchPage'; 
import Messages from './pages/Messages'; 
import Notifications from './pages/Notifications';

const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // Hide sidebar on auth pages
  const hideSidebarRoutes = ['/login', '/register'];
  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="bg-gradient-to-br from-[#f4f7fc] via-[#eef4ff] to-[#f8fbff] min-h-screen text-slate-900 flex">
      {shouldShowSidebar && <Sidebar />}
      <main className={`flex-1 w-full transition-all duration-300 ${shouldShowSidebar ? 'ml-72' : ''}`}>
        {children}
      </main>
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
            <div className="h-screen flex items-center justify-center text-slate-500 font-black uppercase tracking-widest">
              Hub Not Found
            </div>
          } />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;