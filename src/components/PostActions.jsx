import React, { useState } from 'react';
import axios from 'axios';
import { Heart, MessageSquare, Share2 } from 'lucide-react';

const PostActions = ({ post }) => {
  const currentUserId = localStorage.getItem('userId');
  const currentUsername = localStorage.getItem('username');
  const currentDisplayName = localStorage.getItem('displayName');

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  const handleLike = async () => {
    if (!currentUserId || !currentUsername) {
      return alert('Please login to like posts.');
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${post.author.id}/post/${post._id}/like`,
        { currentUsername, currentUserId }
      );
      setLiked(!liked);
      setLikeCount(res.data.likes?.length ?? (liked ? likeCount - 1 : likeCount + 1));
    } catch (err) {
      console.error('Like request failed', err);
      alert('Unable to like the post right now.');
    }
  };

  const handleComment = async () => {
    if (!currentUserId || !currentUsername) {
      return alert('Please login to comment.');
    }

    const text = window.prompt('Write your comment:');
    if (!text || !text.trim()) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/${post.author.id}/post/${post._id}/comment`,
        {
          authorUsername: currentUsername,
          authorDisplayName: currentDisplayName || currentUsername,
          text,
          currentUserId
        }
      );
      alert('Comment submitted successfully.');
    } catch (err) {
      console.error('Comment request failed', err);
      alert('Unable to post comment right now.');
    }
  };

  const handleShare = async () => {
    navigator.clipboard.writeText(window.location.href);

    if (!currentUserId || !currentUsername) {
      return alert('Link copied to clipboard! Please login to notify the author.');
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/${post.author.id}/post/${post._id}/share`,
        {
          currentUserId,
          currentUsername,
          currentDisplayName: currentDisplayName || currentUsername
        }
      );
      alert('Link copied to clipboard! The author was also notified.');
    } catch (err) {
      console.error('Share request failed', err);
      alert('Link copied, but notification failed to send.');
    }
  };

  return (
    <div className="px-6 py-3 border-t border-softgray flex items-center justify-between bg-[#eff6ff] rounded-b-[1.75rem]">
      
      {/* Left Side: Like and Comment */}
      <div className="flex items-center gap-6">
        <button 
          onClick={handleLike} 
          className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
            liked ? 'text-red-500' : 'text-slate-muted hover:text-red-500 hover:bg-red-50'
          } px-3 py-1.5 rounded-lg -ml-3`}
        >
          <Heart size={20} className={liked ? 'fill-current' : ''} />
          <span>{likeCount > 0 ? likeCount : 'Like'}</span>
        </button>

        <button onClick={handleComment} className="flex items-center gap-2 text-sm font-semibold text-slate-muted hover:text-[#0f4c81] hover:bg-[#eff6ff] px-3 py-1.5 rounded-lg transition-colors">
          <MessageSquare size={20} />
          <span>Comment</span>
        </button>
      </div>

      {/* Right Side: Share */}
      <button 
        onClick={handleShare}
        className="flex items-center gap-2 text-sm font-semibold text-slate-muted hover:text-[#0f4c81] hover:bg-[#eff6ff] px-3 py-1.5 rounded-lg transition-colors -mr-3"
      >
        <Share2 size={20} />
        <span className="hidden sm:inline">Share</span>
      </button>

    </div>
  );
};

export default PostActions;
