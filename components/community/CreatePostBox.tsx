
import React, { useState, useEffect } from 'react';
import { profileService, UserProfile } from '../../services/profile';
import { forgeAIService } from '../../services/gemini';
import { communityBus } from '../../services/communityBus';

const CreatePostBox = () => {
  const [profile, setProfile] = useState<UserProfile>(profileService.getProfile());
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [moderation, setModeration] = useState<{ status: string, reason?: string } | null>(null);

  useEffect(() => {
    return profileService.subscribe((updated) => setProfile(updated));
  }, []);

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsAnalyzing(true);
    const result = await forgeAIService.checkContentSafety(title, content);
    setIsAnalyzing(false);
    
    if (result.status === 'FLAGGED') {
      setModeration(result);
      return;
    }

    // Success flow
    const newPost = {
      id: `p-${Date.now()}`,
      author: {
        name: profile.name,
        username: profile.username,
        avatar: profile.avatar,
        karma: profile.communityKarma
      },
      time: 'Just now',
      visibility: 'Public',
      title,
      content,
      tags: ['Discussion'],
      upvotes: 0,
      comments: 0,
      moderation: result.status,
      moderationReason: result.reason
    };

    communityBus.publish({ type: 'POST_CREATED', data: newPost });
    // Karma: creating posts (+2)
    profileService.handleNewPost();
    
    // Reset
    setTitle('');
    setContent('');
    setModeration(null);
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-8 flex flex-col gap-4 shadow-sm group hover:border-[#8b949e] transition-all relative">
      <div className="flex items-start gap-4">
        <img src={profile.avatar} className="size-11 rounded-full border border-border-dark object-cover" />
        <div className="flex-1 space-y-3">
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 p-0 text-[18px] font-bold text-white placeholder:text-slate-600"
            placeholder="Title of your discussion..."
          />
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 p-0 text-[15px] text-slate-300 placeholder:text-slate-600 resize-none min-h-[80px]" 
            placeholder="Share context, ask a question, or log a build..."
          />
        </div>
      </div>

      {moderation && moderation.status !== 'SAFE' && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 animate-in slide-in-from-top-2 ${moderation.status === 'FLAGGED' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
           <span className="material-symbols-outlined">{moderation.status === 'FLAGGED' ? 'block' : 'warning'}</span>
           <div className="flex-1">
             <p className="text-xs font-black uppercase tracking-widest mb-1">ForgeAI Moderation Insight</p>
             <p className="text-[13px] font-medium leading-relaxed">{moderation.reason}</p>
             {moderation.status === 'WARNING' && (
               <button onClick={handlePost} className="mt-2 text-[10px] font-black uppercase underline hover:text-white">Post anyway</button>
             )}
           </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-[#30363d]/30">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined !text-[22px]">code</span>
          </button>
          <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined !text-[22px]">image</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">
               <span className="material-symbols-outlined !text-[16px] animate-spin">progress_activity</span>
               AI Reviewing...
            </div>
          )}
          <button 
            onClick={handlePost}
            disabled={isAnalyzing || !title.trim() || !content.trim()}
            className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 disabled:opacity-30"
          >
             Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostBox;
