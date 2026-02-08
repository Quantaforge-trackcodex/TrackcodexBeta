
import React, { useState, useRef, useEffect } from 'react';
import { useDirectMessages, Conversation } from '../../hooks/useDirectMessages';
import MessageBubble from './MessageBubble';

const MessagingPanel = () => {
  const {
    conversations,
    activeConversation,
    isPanelOpen,
    setIsPanelOpen,
    setActiveConvId,
    sendMessage,
    isTyping
  } = useDirectMessages();

  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConversation?.messages, isTyping]);

  if (!isPanelOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-end animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsPanelOpen(false)}
      />

      {/* Panel */}
      <div className="relative w-full max-w-[900px] h-full bg-[#0d1117] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex border-l border-[#30363d] animate-in slide-in-from-right duration-300">

        {/* Left Sidebar: Conversations */}
        <aside className="w-[320px] border-r border-[#30363d] flex flex-col shrink-0">
          <div className="p-6 border-b border-[#30363d] flex items-center justify-between">
            <h2 className="text-xl font-black text-white">Direct</h2>
            <button className="size-8 rounded-lg hover:bg-white/5 text-slate-400">
              <span className="material-symbols-outlined">edit_square</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {conversations.map((conv) => {
              const other = conv.participants[0];
              const isActive = activeConversation?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-1 ${isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5 border border-transparent'
                    }`}
                >
                  <img src={other.avatar} className="size-12 rounded-full border border-[#30363d] object-cover" alt={other.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-bold text-white truncate">{other.name}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{conv.lastTimestamp || 'New'}</span>
                    </div>
                    <p className={`text-[12px] truncate ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                      {conv.lastMessage || 'Start a conversation'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Content: Chat Window */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
          {activeConversation ? (
            <>
              {/* Header */}
              <div className="h-[73px] border-b border-[#30363d] flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-3">
                  <img src={activeConversation.participants[0].avatar} className="size-9 rounded-full border border-[#30363d]" alt="Avatar" />
                  <div>
                    <h3 className="text-sm font-bold text-white">{activeConversation.participants[0].name}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Active Now</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="size-9 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400">
                    <span className="material-symbols-outlined">call</span>
                  </button>
                  <button className="size-9 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400">
                    <span className="material-symbols-outlined">videocam</span>
                  </button>
                  <button className="size-9 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400">
                    <span className="material-symbols-outlined">info</span>
                  </button>
                  <button
                    onClick={() => setIsPanelOpen(false)}
                    className="size-9 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400 lg:hidden"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-2"
              >
                {activeConversation.messages.map((msg, i) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isMe={msg.senderId === 'current'}
                    showAvatar={i === activeConversation.messages.length - 1 || activeConversation.messages[i + 1]?.senderId !== msg.senderId}
                    avatar={activeConversation.participants[0].avatar}
                  />
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 mb-4 animate-pulse">
                    <img src={activeConversation.participants[0].avatar} className="size-7 rounded-full border border-[#30363d]" />
                    <div className="bg-[#2d333b] px-3 py-2 rounded-2xl flex gap-1 items-center">
                      <div className="size-1 bg-slate-500 rounded-full animate-bounce"></div>
                      <div className="size-1 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                      <div className="size-1 bg-slate-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6">
                <form
                  onSubmit={handleSend}
                  className="relative flex items-center gap-3 bg-[#161b22] border border-[#30363d] rounded-full px-5 py-3 focus-within:border-primary/50 transition-all"
                >
                  <button type="button" className="text-slate-400 hover:text-white">
                    <span className="material-symbols-outlined">sentiment_satisfied</span>
                  </button>
                  <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] text-white placeholder:text-slate-600"
                  />
                  {inputText.trim() ? (
                    <button type="submit" className="text-primary font-black text-[14px] uppercase tracking-widest hover:brightness-125">
                      Send
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button type="button" className="text-slate-400 hover:text-white"><span className="material-symbols-outlined">image</span></button>
                      <button type="button" className="text-slate-400 hover:text-white"><span className="material-symbols-outlined">favorite</span></button>
                    </div>
                  )}
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="size-24 rounded-full border-2 border-white/10 flex items-center justify-center text-white mb-6">
                <span className="material-symbols-outlined !text-[48px]">send</span>
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Your Messages</h2>
              <p className="text-slate-500 max-w-xs mx-auto text-sm">Send private messages to a colleague or client to collaborate on repositories and jobs.</p>
              <button className="mt-8 bg-primary text-primary-foreground px-6 py-2 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20">Send Message</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MessagingPanel;
