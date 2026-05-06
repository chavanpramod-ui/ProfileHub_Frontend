import React, { useEffect, useState } from 'react';
import AchievementPost from '../components/AchievementPost';
import PostActions from '../components/PostActions'; 
import { Loader2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { API } from '../services/api';

const Home = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await API.get('/users/achievements/feed');
        console.log('🔍 Feed API Response count:', res.data?.length);
        if (res.data && res.data.length > 0) {
          res.data.forEach((post, idx) => {
            console.log(`Post ${idx}: author.username="${post.author?.username}", profilePicture="${post.author?.profilePicture}"`);
          });
        }
        setFeed(res.data);
      } catch (err) {
        console.error("Feed error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const profileImageUrl = (author) => {
    if (!author) {
      console.warn('profileImageUrl: No author object provided');
      return null;
    }
    const src = author?.profilePicture || author?.avatar;
    console.log(`profileImageUrl(${author.username}): src="${src}"`);
    if (!src || src.trim() === '') {
      console.log(`  → Returning NULL (src is empty)`);
      return null;
    }
    const result = src.startsWith('http') ? src : `${import.meta.env.VITE_API_URL}/${src}`;
    console.log(`  → Returning: "${result}"`);
    return result;
  };

  const filteredFeed = feed.filter((post) => {
    const searchLower = searchQuery.toLowerCase();
    const usernameMatch = post.author?.username?.toLowerCase().includes(searchLower);
    const nameMatch = post.author?.displayName?.toLowerCase().includes(searchLower);
    return usernameMatch || nameMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-sky-50 to-slate-50 text-slate-900 pb-10">
      <header className="sticky top-0 z-50 bg-white/95 border-b border-sky-200 px-4 py-3 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1.5 rounded-lg shadow-sm">
              <BrandLogo label={false} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden md:block whitespace-nowrap">
              Global Feed
            </h1>
          </div>

          <div className="relative flex-1 max-w-md hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:bg-white focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all duration-200"
              placeholder="Search developers or milestones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900">Discover Professional Milestones</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Trending updates from the developer community.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-sky-700">
            <Loader2 className="animate-spin mb-4 text-sky-600" size={40} />
            <span className="font-bold">Syncing Hub Updates...</span>
          </div>
        ) : filteredFeed.length > 0 ? (
          <div className="space-y-4">
            {filteredFeed.map((post) => (
              <div key={post._id} className="bg-white rounded-[1.75rem] border border-sky-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="p-5">
                  <div 
                    className="flex items-center gap-3 mb-4 cursor-pointer group w-fit"
                    onClick={() => navigate(`/${post.author.username}`)}
                  >
                    {profileImageUrl(post.author) ? (
                      <img
                        src={profileImageUrl(post.author)}
                        alt={post.author.displayName || post.author.username}
                        className="w-10 h-10 rounded-full object-cover border border-sky-200"
                        onError={(e) => {
                          console.error(`❌ Image failed to load: ${e.target.src}`);
                          e.target.style.display = 'none';
                          // Shows a fallback icon if image fails to load
                          e.target.outerHTML = `<div class="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center text-white font-bold uppercase">${post.author.username.charAt(0)}</div>`;
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center text-white font-bold uppercase">
                        {post.author.username.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                        {post.author.displayName || post.author.username}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                        Visit Hub Profile
                      </p>
                    </div>
                  </div>

                  <AchievementPost post={post} isOwner={false} compact />
                </div>

                <PostActions post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 font-medium bg-white rounded-xl border border-sky-200 shadow-sm">
            No milestones found matching "{searchQuery}".
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
