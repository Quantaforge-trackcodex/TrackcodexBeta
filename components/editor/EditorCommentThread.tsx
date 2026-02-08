
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../../services/profile';

interface EditorComment {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  replies?: EditorComment[];
}

interface EditorCommentThreadProps {
  lineNumber: number;
  comments: EditorComment[];
  onAddComment: (text: string, parentId?: string) => void;
  onClose: () => void;
}

interface EditorCommentItemProps {
  comment: EditorComment;
  onReply: (parentId: string, username: string) => void;
  isReply?: boolean;
}

// Typed as React.FC to allow 'key' prop when mapped in lists
const EditorCommentItem: React.FC<EditorCommentItemProps> = ({ 
  comment, 
  onReply, 
  isReply = false 
}) => {
  const navigate = useNavigate();
  return (
    <div className={`py-4 group ${!isReply ? 'border-b border-white/5 last:border-0' : 'mt-4'}`}>
      <div className="flex gap-3">
        <img 
          src={comment.author.avatar} 
          className="size-7 rounded-full border border-white/10 cursor-pointer object-cover shrink-0 hover:brightness-110 transition-all" 
          onClick={() => navigate('/profile')}
          alt={comment.author.name}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span 
              className="text-[12px] font-bold text-slate-100 hover:text-primary transition-colors cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              {comment.author.name}
            </span>
            <span className="text-[10px] font-bold text-slate-500 lowercase tracking-tight">@{comment.author.username}</span>
            <span className="text-[10px] text-slate-600 font-medium">• {comment.timestamp}</span>
          </div>
          <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
            {comment.text.split(/(@\w+)/g).map((part, i) => 
              part.startsWith('@') ? <span key={i} className="text-primary font-bold">{part}</span> : part
            )}
          </p>
          <div className="mt-3 flex items-center gap-4">
            <button 
              onClick={() => onReply(comment.id, comment.author.username)}
              className="text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined !text-[14px]">reply</span>
              Reply
            </button>
            <button className="text-[10px] font-black uppercase text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1.5">
               <span className="material-symbols-outlined !text-[14px]">flag</span>
               Report
            </button>
          </div>

          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-2 mt-4 border-l-2 border-white/5 pl-4">
              {comment.replies.map(reply => (
                <EditorCommentItem key={reply.id} comment={reply} onReply={onReply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EditorCommentThread: React.FC<EditorCommentThreadProps> = ({ lineNumber, comments, onAddComment, onClose }) => {
  const [inputText, setInputText] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (replyTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyTo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddComment(inputText, replyTo?.id);
    setInputText('');
    setReplyTo(null);
  };

  const handleReply = (parentId: string, username: string) => {
    setReplyTo({ id: parentId, username });
    setInputText(`@${username} `);
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl my-4 mx-8 overflow-hidden shadow-2xl relative group/thread">
      <div className="bg-[#0d1117] px-5 py-3 border-b border-[#30363d] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined !text-[16px] filled">forum</span>
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Thread: Line {lineNumber}</span>
          {comments.length > 0 && (
             <span className="text-[10px] font-bold text-slate-600 lowercase bg-slate-900 px-2 py-0.5 rounded-full border border-white/5">{comments.length} comments</span>
          )}
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5">
          <span className="material-symbols-outlined !text-[20px]">close</span>
        </button>
      </div>
      
      <div className="p-5 max-h-[500px] overflow-y-auto custom-scrollbar flex flex-col bg-[#161b22]">
        {comments.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center gap-3">
            <div className="size-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-600">
               <span className="material-symbols-outlined">mode_comment</span>
            </div>
            <p className="text-[12px] text-slate-500 font-medium max-w-[200px]">No discussions yet. Be the first to leave a comment on this line.</p>
          </div>
        ) : (
          comments.map(comment => (
            <EditorCommentItem key={comment.id} comment={comment} onReply={handleReply} />
          ))
        )}
      </div>

      <div className="p-5 bg-black/20 border-t border-[#30363d]">
        <form onSubmit={handleSubmit} className="space-y-3">
          {replyTo && (
            <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-4 py-2 animate-in slide-in-from-left-2 duration-200">
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary !text-[16px]">reply</span>
                 <span className="text-[11px] font-black uppercase text-primary">Replying to @{replyTo.username}</span>
              </div>
              <button type="button" onClick={() => setReplyTo(null)} className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined !text-[16px]">close</span>
              </button>
            </div>
          )}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={replyTo ? "Write your reply..." : "Leave a comment..."}
              className="w-full bg-[#0d1117] border-2 border-transparent focus:border-primary/50 bg-clip-padding rounded-xl p-4 text-[13px] text-slate-200 focus:ring-0 outline-none resize-none h-24 transition-all shadow-inner placeholder:text-slate-600"
            />
          </div>
          <div className="flex justify-between items-center gap-2">
             <div className="flex items-center gap-3">
                <button type="button" className="text-slate-600 hover:text-slate-400 transition-colors">
                   <span className="material-symbols-outlined !text-[20px]">alternate_email</span>
                </button>
                <button type="button" className="text-slate-600 hover:text-slate-400 transition-colors">
                   <span className="material-symbols-outlined !text-[20px]">add_reaction</span>
                </button>
                <button type="button" className="text-slate-600 hover:text-slate-400 transition-colors">
                   <span className="material-symbols-outlined !text-[20px]">image</span>
                </button>
             </div>
             <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-primary hover:bg-blue-600 disabled:opacity-30 disabled:scale-100 text-white px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-[0.1em] transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95"
                >
                  {replyTo ? 'Post Reply' : 'Add Comment'}
                </button>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditorCommentThread;
