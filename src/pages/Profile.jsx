import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import ProfileHeader from '../components/ProfileHeader';
import StatsCard from '../components/StatsCard';
import AchievementPost from '../components/AchievementPost';
import PostModal from '../components/PostModal';
import EditLinksModal from '../components/EditLinksModal';
import EditProfileModal from '../components/EditProfileModal';
import SkillsModal from '../components/SkillsModal'; 
import SearchBar from '../components/SearchBar';
import FollowersModal from '../components/FollowersModal';
import { Github, Code2, PlusCircle, Linkedin, X, Briefcase, GraduationCap, Loader2 } from 'lucide-react';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Visibility States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false); 
  const [showSearch, setShowSearch] = useState(false);
  
  // Data States
  const [editingPost, setEditingPost] = useState(null);
  const [followersList, setFollowersList] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [ghStats, setGhStats] = useState({ repos: '...', followers: '...' });
  const [lcStats, setLcStats] = useState({ solved: '...', rank: '...' });

  // Profile Picture Upload States
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [isResumeUploading, setIsResumeUploading] = useState(false);

  const currentUser = {
    _id: localStorage.getItem('userId'),
    username: localStorage.getItem('username')
  };

  const isOwner = currentUser.username?.toLowerCase() === username?.toLowerCase();

  useEffect(() => {
    if (username) {
      setLoading(true);
      // <-- CRITICAL FIX: Replaced fetchProfile with direct axios.get
      axios.get(`/api/users/profile/${username}`)
        .then(res => {
          setUser(res.data);
          setLoading(false);
          setShowSearch(false);
          
          if (currentUser._id && res.data.followers) {
            setIsFollowing(res.data.followers.some(id => id.toString() === currentUser._id));
          }

          if (res.data.links?.github) fetchGithub(res.data.links.github);
          if (res.data.links?.leetcode) fetchLeetCode(res.data.links.leetcode);
        })
        .catch(err => {
          console.error("Profile fetch error:", err);
          setError(true);
          setLoading(false);
        });
    }
  }, [username, currentUser._id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert('Please select a valid image file (PNG/JPEG).');
    }
  };

  const handleUploadProfilePicture = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);

      // <-- CRITICAL FIX: Removed import.meta.env
      const res = await axios.post(`/api/users/${user.username}/upload-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setUser({ ...user, profilePicture: res.data.filePath });
      setSelectedFile(null);
      setPreviewUrl(null);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error("Upload error:", err);
      alert('Failed to upload profile picture.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    const isPdf = file && file.name.toLowerCase().endsWith('.pdf');
    if (file && isPdf) {
      setSelectedResume(file);
    } else {
      setSelectedResume(null);
      alert('Please upload a PDF resume.');
    }
  };

  const handleUploadResume = async () => {
    if (!selectedResume) {
      alert('Please select a PDF resume before uploading.');
      return;
    }

    setIsResumeUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', selectedResume);

      // <-- CRITICAL FIX: Removed import.meta.env
      const res = await axios.post(`/api/users/${user.username}/upload-resume`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setUser({ ...user, resume: res.data.filePath });
      setSelectedResume(null);

      alert('Resume uploaded successfully.');
    } catch (err) {
      console.error('Resume upload failed:', err);
      const message = err.response?.data?.message || 'Failed to upload resume. Please upload a PDF file.';
      alert(message);
    } finally {
      setIsResumeUploading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this milestone?")) return;

    try {
      // <-- CRITICAL FIX: Removed import.meta.env
      await axios.delete(`/api/users/${user._id}/delete-post/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setUser(prevUser => ({
        ...prevUser,
        achievements: prevUser.achievements.filter(post => post._id !== postId)
      }));
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Could not delete the post. Please try again.");
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser._id) {
      alert("Please login to follow friends!");
      return;
    }

    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing); 

    try {
      // <-- CRITICAL FIX: Removed import.meta.env
      const res = await axios.put(`/api/users/follow/${user._id}`, {
        currentUserId: currentUser._id
      });
      
      setIsFollowing(res.data.isFollowing);
      setUser(prev => ({
        ...prev,
        followers: res.data.isFollowing
          ? [...prev.followers, currentUser._id]
          : prev.followers.filter(id => id.toString() !== currentUser._id)
      }));
    } catch (err) {
      console.error("Follow failed", err);
      setIsFollowing(wasFollowing); 
      alert("Failed to follow user. Please try again.");
    }
  };

  const handleOpenFollowers = async () => {
    try {
      // <-- CRITICAL FIX: Removed import.meta.env
      const res = await axios.get(`/api/users/followers/${user._id}`);
      setFollowersList(res.data);
      setIsFollowersModalOpen(true);
    } catch (err) {
      console.error("Failed to load followers list", err);
    }
  };

  const extractHandle = (url) => {
    if (!url) return '';
    return url.split('/').filter(Boolean).pop().trim();
  };

  const fetchGithub = async (url) => {
    const handle = extractHandle(url);
    try {
      // <-- CRITICAL FIX: Removed import.meta.env
      const res = await axios.get(`/api/users/stats/github/${handle}`);
      setGhStats({ repos: res.data.repos, followers: res.data.followers });
    } catch (e) {
      setGhStats({ repos: 'N/A', followers: 'N/A' });
    }
  };

  const fetchLeetCode = async (url) => {
    const handle = extractHandle(url);
    try {
      // <-- CRITICAL FIX: Removed import.meta.env
      const res = await axios.get(`/api/users/stats/leetcode/${handle}`);
      setLcStats({ solved: res.data.solved, rank: res.data.rank });
    } catch (e) {
      setLcStats({ solved: 'N/A', rank: 'N/A' });
    }
  };

  if (loading) return <div className="h-screen bg-sky-50 flex items-center justify-center text-sky-700 text-xl animate-pulse font-semibold">Syncing Hub Data...</div>;
  if (error || !user) return <div className="h-screen bg-gradient-to-br from-sky-100 via-sky-50 to-slate-50 flex items-center justify-center text-red-600 text-xl font-bold uppercase">Hub not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-sky-50 to-slate-50 text-slate-900 pb-32 overflow-x-hidden relative">
      
      {showSearch && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-200 flex flex-col pt-20 animate-in fade-in zoom-in duration-300">
          <div className="max-w-2xl mx-auto w-full px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Search Network</h2>
              <button onClick={() => setShowSearch(false)} className="p-3 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition border border-slate-200">
                <X size={20} />
              </button>
            </div>
            <SearchBar />
          </div>
        </div>
      )}

      <div className="pt-6">
        <div className="max-w-5xl mx-auto px-4">
          
          <ProfileHeader
            user={user}
            currentUser={currentUser}
            onEditLinks={() => setIsLinksModalOpen(true)}
            onEditProfile={() => setIsEditProfileOpen(true)}
            onFollow={handleFollowToggle}
            onViewFollowers={handleOpenFollowers}
            followed={isFollowing}
            previewUrl={previewUrl}
            onFileChange={handleFileChange}
          />

          {selectedFile && (
            <div className="mt-4 flex justify-center gap-3 bg-white p-4 rounded-xl border border-sky-200 shadow-sm animate-in fade-in slide-in-from-top-4">
              <p className="text-slate-600 font-medium flex items-center mr-4">Save new profile picture?</p>
              <button
                onClick={handleUploadProfilePicture}
                disabled={isUploading}
                className="px-5 py-2 bg-sky-600 text-white text-sm font-bold rounded-full hover:bg-sky-700 flex items-center gap-2 disabled:bg-slate-300 transition"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Save Photo'
                )}
              </button>
              <button
                onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                className="px-5 py-2 bg-slate-100 text-slate-600 text-sm font-bold rounded-full hover:bg-slate-200 transition"
              >
                Cancel
              </button>
            </div>
          )}

          {isOwner && (
            <div className="mt-4 bg-white p-4 rounded-xl border border-sky-200 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Resume</h2>
                  <p className="text-sm text-slate-500">Upload a PDF resume to display on your profile.</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 transition">
                    Choose PDF
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleResumeChange} />
                  </label>
                  <button
                    onClick={handleUploadResume}
                    disabled={!selectedResume || isResumeUploading}
                    className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:bg-slate-300 transition"
                  >
                    {isResumeUploading ? 'Uploading...' : 'Upload Resume'}
                  </button>
                </div>
              </div>

              {selectedResume && (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-[#f8fafc] p-4 text-sm text-slate-700">
                  <p className="font-semibold">Selected resume:</p>
                  <p>{selectedResume.name}</p>
                  <p className="text-xs text-slate-500">PDF preview is available after upload.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      
      <main className="max-w-5xl mx-auto px-4 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-sky-200 p-4 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Briefcase size={14} /> Analytics
            </h3>
            <div className="space-y-4">
              <StatsCard title="GitHub" icon={Github} value={ghStats.repos !== '...' ? `${ghStats.repos} Repos` : 'Loading...'} label={`${ghStats.followers} Followers`} color="bg-slate-900" link={user.links?.github} />
              <StatsCard title="LeetCode" icon={Code2} value={lcStats.rank !== '...' ? `Rank: ${lcStats.rank}` : 'Loading...'} label={`${lcStats.solved} Solved`} color="bg-orange-500" link={user.links?.leetcode} />
              <StatsCard title="LinkedIn" icon={Linkedin} value="Verified" label="Professional Profile" color="bg-sky-600" link={user.links?.linkedin} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-sky-200 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <GraduationCap size={14} /> Education
                </h3>
                <p className="text-sm text-slate-500 mt-1">Academic milestones and professional learning history.</p>
              </div>
              {isOwner && (
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="text-sky-700 hover:text-sky-900 text-sm font-semibold transition"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="grid gap-3">
              {(Array.isArray(user.education) ? user.education : (user.education || '').split('\n').filter(Boolean)).length > 0 ? (
                (Array.isArray(user.education) ? user.education : (user.education || '').split('\n').filter(Boolean)).map((item, index) => (
                  <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    {typeof item === 'string' ? (
                      <p className="text-sm leading-6 text-slate-800">{item}</p>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-slate-900">{item.degree || item.institution || 'Education Entry'}</p>
                        <p className="text-sm text-slate-600 mt-1">{item.institution || item.school}</p>
                        {item.duration && <p className="text-xs text-slate-500 mt-1">{item.duration}</p>}
                        {item.details && <p className="text-sm text-slate-700 mt-2">{item.details}</p>}
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6">
                  <p className="text-sm text-slate-500">No education details provided yet. Add your degrees, schools, and academic milestones in the profile editor.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-sky-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Technical Skills</h2>
              {isOwner && (
                <button
                  onClick={() => setIsSkillsModalOpen(true)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-sky-700 transition"
                  title="Edit Skills"
                >
                  <PlusCircle size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-sky-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Resume</h2>
            </div>
            <div className="rounded-3xl overflow-hidden border border-sky-200 bg-sky-50 min-h-75">
              {user.resume ? (
                <div className="relative h-87.5 bg-white">
                  <iframe
                    // <-- CRITICAL FIX: Base URL for Resume Iframe
                    src={`${axios.defaults.baseURL || 'http://localhost:5000'}/${user.resume}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                    title="Resume Preview"
                    className="h-full w-full"
                  />
                </div>
              ) : (
                <div className="flex h-87.5 flex-col items-center justify-center gap-3 p-6 text-center text-slate-600">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                    <Briefcase size={28} />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">No resume uploaded yet</p>
                    <p className="text-sm text-slate-500">Upload your resume to show it directly on your profile.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-sky-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Achievements & Experience</h2>
              {isOwner && (
                <button
                  onClick={() => {setEditingPost(null); setIsModalOpen(true);}}
                  className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 px-5 py-2 rounded-full text-sm transition font-semibold text-white shadow-sm"
                >
                  <PlusCircle size={18} /> Add New
                </button>
              )}
            </div>

            <div className="space-y-6">
              {user.achievements?.length > 0 ? (
                [...user.achievements].reverse().map((post) => (
                  <AchievementPost
                    key={post._id}
                    post={post}
                    userId={user._id}
                    isOwner={isOwner}
                    onEdit={(p) => {setEditingPost(p); setIsModalOpen(true);}}
                    onDelete={handleDeletePost}
                  />
                ))
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
                  <p className="text-gray-400 font-medium">No professional milestones shared yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} user={user} onUpdate={(u) => setUser(u)} />
      <FollowersModal isOpen={isFollowersModalOpen} onClose={() => setIsFollowersModalOpen(false)} followers={followersList} />
      <EditLinksModal isOpen={isLinksModalOpen} onClose={() => setIsLinksModalOpen(false)} userId={user._id} currentLinks={user.links} />
      <PostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} userId={user._id} editData={editingPost} />
      <SkillsModal
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
        userId={user._id}
        currentSkills={user.skills}
        onUpdate={(u) => setUser(u)}
      />
    </div>
  );
};

export default Profile;