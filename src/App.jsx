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

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }) => {
  const location = useLocation();
  
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
        <Navbar />
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
          {/* Auth Routes - redirect to home if already logged in */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
          
          {/* Protected Routes - require authentication */}
          <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Home /></ProtectedRoute>} />
          <Route path="/create-post" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CreatePost /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute isAuthenticated={isAuthenticated}><SearchPage /></ProtectedRoute>} />
          <Route path="/inbox" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Messages /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Notifications /></ProtectedRoute>} />
          <Route path="/:username" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Profile /></ProtectedRoute>} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          
          {/* 404 Page */}
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