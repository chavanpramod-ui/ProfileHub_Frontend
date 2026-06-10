import React from 'react';
import { Award, Calendar, Trash2, Edit2 } from 'lucide-react';

const AchievementPost = ({ post, isOwner, onEdit, onDelete, compact = false }) => {
  const formattedDate = new Date(post.date || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    day: 'numeric'
  });

  return (
    <div className={compact ? 'group p-0' : 'group bg-cool-gray border border-softgray rounded-4xl p-6 transition-all hover:shadow-[0_24px_60px_-24px_rgba(15,23,42,0.18)]'}>
      <div className={compact ? 'flex flex-col gap-3' : 'flex justify-between items-start'}>
        <div className={compact ? 'flex items-start gap-3 w-full' : 'flex gap-4'}>
          <div className="mt-1 p-3 bg-[#eff6ff] rounded-3xl text-[#0f4c81] shadow-sm">
            <Award size={24} />
          </div>
          
          <div className="flex-1">
            <h3 className="text-base font-bold text-charcoal group-hover:text-[#0f4c81] transition-colors">
              {post.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-2 mt-1 text-[13px] text-slate-muted font-medium">
              <span className="px-3 py-1 rounded-full bg-cool-gray text-slate-muted">{post.provider || "Professional Update"}</span>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1">
                <Calendar size={14} className="text-slate-muted" />
                <span>Issued {formattedDate}</span>
              </div>
            </div>

            <p className="mt-3 text-slate-muted text-sm leading-6 whitespace-pre-wrap">
              {post.description || post.content}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-1">
            <button onClick={() => onEdit(post)} className="p-2 text-slate-muted hover:text-[#0f4c81] hover:bg-[#eff6ff] rounded-lg transition-all">
              <Edit2 size={16} />
            </button>
            <button onClick={() => onDelete(post._id)} className="p-2 text-slate-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {post.image && (
        <div className={compact ? 'mt-4 rounded-2xl overflow-hidden border border-softgray bg-[#f8fafc] shadow-sm' : 'mt-5 rounded-xl overflow-hidden border border-softgray bg-[#f8fafc] shadow-sm flex items-center justify-center'}>
          <img 
            src={post.image.startsWith('http') ? post.image : `${import.meta.env.VITE_API_URL}/${post.image}`} 
            alt={post.title} 
            className="w-full max-h-72 object-contain hover:scale-[1.02] transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none'; 
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AchievementPost;
