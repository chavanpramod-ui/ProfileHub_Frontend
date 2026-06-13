import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Lazy loading pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const SearchPage = lazy(() => import('./pages/SearchPage')); 
const Messages = lazy(() => import('./pages/Messages')); 
const Notifications = lazy(() => import('./pages/Notifications'));

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
    <div className="bg-light-frost min-h-screen text-charcoal flex flex-col md:flex">
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
        <Suspense fallback={
          <div className="flex h-screen items-center justify-center text-charcoal">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep-blue"></div>
          </div>
        }>
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
              <div className="h-screen flex items-center justify-center px-4 text-slate-muted font-black uppercase tracking-widest text-center">
                Hub Not Found
              </div>
            } />
          </Routes>
        </Suspense>
      </AppLayout>
    </Router>
  );
}

export default App;