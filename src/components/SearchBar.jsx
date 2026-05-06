import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, User as UserIcon, ChevronRight } from 'lucide-react';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/suggestions');
        setSuggestions(res.data);
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      }
    };
    fetchSuggestions();
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/users/search?q=${encodeURIComponent(query.trim())}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchSearchResults, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleSuggestionClick = (username) => {
    navigate(`/${username}`);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative mb-6">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input
          type="text"
          className="w-full bg-white text-slate-900 placeholder-slate-400 pl-12 pr-4 py-3 rounded-[2rem] border border-slate-200 focus:outline-none focus:border-[#0f4c81] focus:ring-2 focus:ring-[#0f4c81]/20 transition-all shadow-sm"
          placeholder="Find friends on Profile Hub..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {suggestions.length > 0 && (
        <div className="mt-4 animate-in fade-in duration-500">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
            {query.trim() ? 'Matching Profiles' : 'Suggested Creators'}
          </h4>
          
          <div className="flex flex-col gap-2">
            {suggestions.map((user, index) => {
              
              // Determine the image source (checks both profilePicture and avatar fields)
              const imageSource = user.profilePicture || user.avatar;
              const hasImage = Boolean(imageSource && imageSource.trim() !== "");

              return (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(user.username)}
                  className="flex items-center justify-between p-4 rounded-3xl border border-slate-200 bg-white shadow-sm hover:border-[#0f4c81] hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-4">
                    
                    {/* AVATAR RENDERING */}
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center shrink-0 border border-slate-200">
                      {hasImage ? (
                        <img 
                          src={imageSource.startsWith('http') ? imageSource : `http://localhost:5000/${imageSource}`} 
                          alt={user.username}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // If the image link is broken, fall back to the grey icon
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user text-slate-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
                          }}
                        />
                      ) : (
                        <UserIcon size={24} className="text-slate-400" />
                      )}
                    </div>

                    {/* PROFILE INFO RENDERING */}
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 group-hover:text-[#0f4c81] transition-colors">
                        {user.displayName || user.username}
                      </span>
                      <span className="text-sm text-slate-500 line-clamp-1">
                        {/* If they have a bio, show it. Otherwise, show a professional default. */}
                        {user.bio && user.bio.trim() !== "" 
                          ? user.bio 
                          : "MERN Stack Developer | Tech Enthusiast"}
                      </span>
                    </div>

                  </div>

                  <button className="hidden sm:flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-semibold text-[#0f4c81] bg-[#eff6ff] group-hover:bg-[#0f4c81] group-hover:text-white transition-all">
                    View
                    <ChevronRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
