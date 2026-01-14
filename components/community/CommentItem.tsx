
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityComment } from '../../types';
import KarmaBadge from './KarmaBadge';
import UserHoverCard from './UserHoverCard';

interface CommentItemProps {
  comment: CommunityComment & { isNew?: boolean };
  onReply: (parentId: string, username: string) => void;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, depth = 0 }) => {
  const navigate = useNavigate();
  const [upvotes, setUpvotes] = useState(comment.upvotes);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [showHoverCard, setShowHoverCard] = useState(false);
  const [isHighlightVisible, setIsHighlightVisible] = useState(!!comment.isNew);

  useEffect(() => {
    if (comment.isNew) {
      const timer = setTimeout(() => setIsHighlightVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [comment.isNew]);

  const handleProfileClick = () => navigate('/profile');

  const renderTextWithMentions = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span
            key={i}
            onClick={handleProfileClick}
            className="text-primary font-bold cursor-pointer hover:underline"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const handleUpvote = () => {
    if (isUpvoted) {
      setUpvotes(prev => prev - 1);
    } else {
      setUpvotes(prev => prev + 1);
    }
    setIsUpvoted(!isUpvoted);
  };

  return (
    <div className={`mt-4 transition-all duration-1000 ${depth > 0 ? 'ml-6 pl-4 border-l border-[#30363d]' : ''} ${isHighlightVisible ? 'bg-primary/5 -mx-2 px-2 rounded-lg ring-1 ring-primary/20' : ''}`}>
      <div className="flex gap-3 group">
        <div 
          className="relative shrink-0"
          onMouseEnter={() => setShowHoverCard(true)}
          onMouseLeave={() => setShowHoverCard(false)}
        >
          <img
            src={comment.author.avatar}
            alt={comment.author.name}
            className="size-8 rounded-full border border-[#30363d] cursor-pointer"
            onClick={handleProfileClick}
          />
          {showHoverCard && (
            <div className="absolute top-10 left-0 pt-2 z-50">
              <UserHoverCard user={comment.author} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="text-[13px] font-bold text-white cursor-pointer hover:text-primary transition-colors"
              onClick={handleProfileClick}
            >
              {comment.author.name}
            </span>
            <KarmaBadge karma={comment.author.karma} />
            <span className="text-[11px] text-slate-500 font-medium">{comment.timestamp}</span>
            {isHighlightVisible && (
              <span className="text-[9px] font-black text-primary uppercase tracking-widest animate-pulse">New</span>
            )}
          </div>
          <p className="text-[13px] text-slate-300 leading-relaxed mb-2">
            {renderTextWithMentions(comment.text)}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1.5 text-[11px] font-bold transition-colors ${
                isUpvoted ? 'text-primary' : 'text-slate-500 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined !text-[16px]">{isUpvoted ? 'arrow_upward' : 'arrow_upward'}</span>
              {upvotes}
            </button>
            <button
              onClick={() => onReply(comment.id, comment.author.username)}
              className="text-[11px] font-bold text-slate-500 hover:text-white transition-colors"
            >
              Reply
            </button>
            <button className="text-[11px] font-bold text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
              Report
            </button>
          </div>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
