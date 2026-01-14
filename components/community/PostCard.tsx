
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import KarmaBadge from './KarmaBadge';
import CommentItem from './CommentItem';
import UserHoverCard from './UserHoverCard';
import { communityBus } from '../../services/communityBus';
import { CommunityComment } from '../../types';
import { profileService } from '../../services/profile';

// Typed as React.FC to allow standard props like 'key' when rendered in lists
const PostCard: React.FC<{ post: any }> = ({ post }) => {
  const navigate = useNavigate();
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [isTyping, setIsTyping] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showHoverCard, setShowHoverCard] = useState(false);
  const [justLiked, setJustLiked] = useState(false);
  const [commentsList, setCommentsList] = useState<CommunityComment[]>(post.commentsData || [
    {
      id: 'c1',
      author: { name: 'Marcus Thorne', username: 'm_thorne', avatar: 'https://picsum.photos/seed/marcus/64', karma: 120 },
      text: 'This is exactly what we were discussing in the last live session. Partitioning seems to be the way to go for the auth shards.',
      timestamp: '1 hour ago',
      upvotes: 12,
      replies: [
        {
          id: 'c2',
          author: { name: 'Alex Chen', username: 'alexcoder', avatar: 'https://picsum.photos/seed/alexprofile/600', karma: 320 },
          text: '@m_thorne I agree, but we need to ensure the foreign key consistency doesn\'t take a hit.',
          timestamp: '45 mins ago',
          upvotes: 5,
          replies: []
        }
      ]
    }
  ]);
  
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    return communityBus.subscribe((event) => {
      if (event.type === 'TYPING' && event.data.postId === post.id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
      
      if (event.type === 'REACTION_ADDED' && event.data.postId === post.id) {
        // Only increment if it's from another user (to avoid double count)
        if (event.data.userId !== 'current') {
          setUpvotes(prev => prev + 1);
          setJustLiked(true);
          setTimeout(() => setJustLiked(false), 1000);

          // If current user is author, show notification and gain karma
          const currentUser = profileService.getProfile();
          if (post.author.username === currentUser.username) {
            profileService.receiveLike();
            window.dispatchEvent(new CustomEvent('trackcodex-notification', {
              detail: {
                title: 'Post Liked',
                message: `@${event.data.userId} upvoted your post!`,
                type: 'success'
              }
            }));
          }
        }
      }

      if (event.type === 'COMMUNITY_COMMENT_ADDED' && event.data.postId === post.id) {
        // Check if we already have this comment (local submission)
        const isDuplicate = commentsList.some(c => c.id === event.data.comment.id);
        if (!isDuplicate) {
          addCommentToState(event.data.comment, event.data.parentCommentId);
          setShowComments(true);
          
          // Karma for receiving comments
          if (post.author.username === profileService.getProfile().username) {
            profileService.receiveComment();
          }
        }
      }
    });
  }, [post.id, commentsList]);

  const addCommentToState = (newComment: CommunityComment, parentId?: string) => {
    if (!parentId) {
      setCommentsList(prev => [...prev, newComment]);
      return;
    }

    const recursiveAdd = (comments: CommunityComment[]): CommunityComment[] => {
      return comments.map(c => {
        if (c.id === parentId) {
          return { ...c, replies: [...(c.replies || []), newComment] };
        }
        if (c.replies) {
          return { ...c, replies: recursiveAdd(c.replies) };
        }
        return c;
      });
    };

    setCommentsList(prev => recursiveAdd(prev));
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/profile');
  };

  const handleEntityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.linkedEntity.type === 'repo') {
      navigate(`/repo/${post.linkedEntity.id}`);
    } else if (post.linkedEntity.type === 'workspace') {
      navigate('/workspaces');
    }
  };

  const handleVote = (delta: number) => {
    if (delta <= 0) {
      setUpvotes(prev => prev + delta);
      return;
    }
    
    // Optimistic local update
    setUpvotes(prev => prev + delta);
    setJustLiked(true);
    setTimeout(() => setJustLiked(false), 1000);

    communityBus.publish({ 
      type: 'REACTION_ADDED', 
      data: { postId: post.id, emoji: 'up', userId: 'current' } 
    });
  };

  const handleReply = (parentId: string, username: string) => {
    setReplyTo({ id: parentId, username });
    setCommentInput(`@${username} `);
    setShowComments(true);
    setTimeout(() => commentInputRef.current?.focus(), 100);
  };

  const submitComment = () => {
    if (!commentInput.trim()) return;

    const profile = profileService.getProfile();
    const newComment: CommunityComment = {
      id: `c-${Date.now()}`,
      author: {
        name: profile.name,
        username: profile.username,
        avatar: profile.avatar,
        karma: profile.communityKarma
      },
      text: commentInput,
      timestamp: 'Just now',
      upvotes: 0,
      replies: []
    };

    // Add locally immediately for smoothness
    addCommentToState(newComment, replyTo?.id);

    communityBus.publish({
      type: 'COMMUNITY_COMMENT_ADDED',
      data: {
        postId: post.id,
        comment: newComment,
        parentCommentId: replyTo?.id
      }
    });

    setCommentInput('');
    setReplyTo(null);
  };

  return (
    <div className={`bg-[#161b22] border border-[#30363d] rounded-2xl p-6 hover:border-[#8b949e] transition-all group shadow-sm relative ${post.moderation === 'FLAGGED' ? 'opacity-50 grayscale' : ''}`}>
      
      {post.moderation === 'WARNING' && (
        <div className="mb-4 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-2 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
           <span className="material-symbols-outlined !text-[14px]">warning</span>
           ForgeAI Warning: {post.moderationReason || 'Potential quality issues detected.'}
        </div>
      )}

      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="relative cursor-pointer" 
            onMouseEnter={() => setShowHoverCard(true)}
            onMouseLeave={() => setShowHoverCard(false)}
          >
            <img 
              onClick={handleProfileClick}
              src={post.author.avatar} 
              alt={post.author.name} 
              className="size-11 rounded-full border border-border-dark object-cover" 
            />
            {post.author.isLive && (
              <span className="absolute -bottom-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-[#161b22] animate-pulse"></span>
            )}
            {showHoverCard && (
              <div className="absolute top-12 left-0 pt-2 z-50">
                <UserHoverCard user={post.author} />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-bold text-white hover:text-primary transition-colors cursor-pointer" onClick={handleProfileClick}>{post.author.name}</h3>
              <KarmaBadge karma={post.author.karma || 0} />
              {post.type && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest text-emerald-500">
                  {post.type}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">{post.time} • <span className="material-symbols-outlined !text-[12px] align-middle">public</span> {post.visibility}</p>
          </div>
        </div>
        <button className="text-slate-500 hover:text-white transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-6">
        <h2 className="text-[18px] font-bold text-white mb-3 tracking-tight">{post.title}</h2>
        <p className="text-[14px] text-slate-300 leading-relaxed mb-4">{post.content}</p>

        {post.codeSnippet && (
          <div className="rounded-xl border border-[#30363d] overflow-hidden bg-[#0d1117] mb-4">
            <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">{post.codeSnippet.filename}</span>
              <span className="text-[10px] font-black text-slate-700 uppercase">{post.codeSnippet.language}</span>
            </div>
            <pre className="p-4 font-mono text-[12px] text-slate-400 overflow-x-auto">
              <code>{post.codeSnippet.content}</code>
            </pre>
          </div>
        )}

        {post.image && (
          <div className="rounded-xl overflow-hidden mb-4 border border-[#30363d] relative group/img">
            <img src={post.image} className="w-full h-auto max-h-[400px] object-cover" />
            <div className="absolute inset-0 bg-black/20 group-hover/img:bg-transparent transition-all"></div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag: string) => (
            <span key={tag} className="px-2.5 py-1 bg-primary/5 border border-primary/20 rounded-lg text-[11px] font-bold text-primary hover:bg-primary hover:text-white transition-all cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Linked Entity Card (If any) */}
      {post.linkedEntity && (
        <div 
          onClick={handleEntityClick}
          className="mb-6 p-4 bg-[#0d1117] border border-[#30363d] rounded-xl flex items-center justify-between group/entity cursor-pointer hover:border-primary/50 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover/entity:bg-primary group-hover/entity:text-white transition-all">
              <span className="material-symbols-outlined !text-2xl">
                {post.linkedEntity.type === 'repo' ? 'account_tree' : 'view_quilt'}
              </span>
            </div>
            <div>
               <p className="text-[13px] font-bold text-white group-hover/entity:text-primary transition-colors">
                 Open in Workspace <span className="text-slate-500 font-normal">(Read Mode)</span>
               </p>
               <p className="text-[10px] text-slate-500 font-mono">Context: {post.linkedEntity.label}</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-500 group-hover/entity:text-white transition-all group-hover/entity:translate-x-1">arrow_forward</span>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[#30363d]">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-lg p-1">
            <button 
              onClick={() => handleVote(1)} 
              className={`px-3 py-1 flex items-center gap-1.5 transition-all ${justLiked ? 'text-primary scale-110' : 'text-slate-400 hover:text-white'}`}
            >
              <span className={`material-symbols-outlined !text-[18px] ${justLiked ? 'filled' : ''}`}>arrow_upward</span>
              <span className="text-[13px] font-bold">{upvotes}</span>
            </button>
            <div className="w-px h-4 bg-[#30363d] mx-1"></div>
            <button onClick={() => handleVote(-1)} className="px-3 py-1 flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined !text-[18px]">arrow_downward</span>
            </button>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-2 transition-colors ${showComments ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
            >
              <span className="material-symbols-outlined !text-[20px]">forum</span>
              <span className="text-[13px] font-bold">{commentsList.length} <span className="hidden sm:inline">Comments</span></span>
            </button>
            {isTyping && (
              <div className="absolute -top-6 left-0 animate-bounce flex items-center gap-1">
                 <div className="size-1 bg-primary rounded-full"></div>
                 <div className="size-1 bg-primary rounded-full delay-100"></div>
                 <div className="size-1 bg-primary rounded-full delay-200"></div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined !text-[20px]">bookmark</span>
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined !text-[20px]">share</span>
          </button>
        </div>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="mt-6 pt-6 border-t border-[#30363d] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3 mb-6">
            <img
              src={profileService.getProfile().avatar}
              className="size-8 rounded-full border border-[#30363d] object-cover shrink-0"
            />
            <div className="flex-1 space-y-3">
              {replyTo && (
                <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg px-3 py-1 text-[11px]">
                  <span className="text-primary font-bold">Replying to @{replyTo.username}</span>
                  <button onClick={() => { setReplyTo(null); setCommentInput(''); }} className="text-slate-500 hover:text-white transition-colors">
                    <span className="material-symbols-outlined !text-[14px]">close</span>
                  </button>
                </div>
              )}
              <textarea
                ref={commentInputRef}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:ring-1 focus:ring-primary outline-none resize-none min-h-[60px]"
              />
              <div className="flex justify-end">
                <button
                  onClick={submitComment}
                  disabled={!commentInput.trim()}
                  className="bg-primary hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {commentsList.map(comment => (
              <CommentItem key={comment.id} comment={comment} onReply={handleReply} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
