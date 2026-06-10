import React from 'react';
import SearchBar from '../components/SearchBar'; // Importing your existing component!

const SearchPage = () => {
  return (
    <div className="min-h-screen bg-[#eef4ff] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-black text-charcoal mb-6 tracking-tight">Discover Network</h2>
        
        <div className="bg-cool-gray rounded-[2rem] shadow-[0_24px_60px_-24px_rgba(15,23,42,0.12)] border border-softgray p-6 overflow-hidden">
          <p className="text-sm text-slate-muted mb-6 font-medium">
            Search for developers, skills, or specific milestones across the platform.
          </p>
          
          {/* This drops your existing search logic right into the page */}
          <SearchBar />
          
        </div>
      </div>
    </div>
  );
};

export default SearchPage;