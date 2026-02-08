
import React from 'react';
import { Message } from '../../hooks/useDirectMessages';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  showAvatar?: boolean;
  avatar?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe, showAvatar, avatar }) => {
  if (message.senderId === 'system') {
    return (
      <div className="flex justify-center my-4">
        <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase text-primary tracking-widest">
          {message.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-4 group`}>
      <div className={`flex gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
        {showAvatar && !isMe && (
          <img src={avatar} className="size-7 rounded-full border border-[#30363d] self-end mb-1" alt="Avatar" />
        )}
        {!showAvatar && !isMe && <div className="size-7" />}

        <div className={`relative px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed transition-all ${isMe
            ? 'bg-primary text-primary-foreground rounded-br-none shadow-lg shadow-primary/10'
            : 'bg-[#2d333b] text-slate-100 rounded-bl-none border border-[#30363d]'
          }`}>
          {message.text}
        </div>
      </div>

      <div className={`flex items-center gap-2 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
        <span className="text-[9px] text-slate-500 font-bold uppercase">{message.timestamp}</span>
        {isMe && (
          <span className="text-[9px] text-primary font-bold uppercase tracking-tighter">
            {message.status}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
