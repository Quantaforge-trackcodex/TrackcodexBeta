
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MOCK_SESSIONS } from '../constants';
import { forgeAIService } from '../services/gemini';

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  isAI?: boolean;
  reactions?: { [emoji: string]: string[] };
}

interface Participant {
  id: string;
  name: string;
  username: string; // Added for mention system
  avatar: string;
  isMuted: boolean;
  isSharingScreen: boolean;
  role: 'host' | 'participant' | 'ai';
  isTalking?: boolean; 
}

const SyntaxHighlighter: React.FC<{ code: string; lang?: string }> = ({ code, lang }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlight = (text: string) => {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') 
      .replace(/\b(const|let|var|function|return|if|else|for|while|import|from|export|default|async|await|try|catch|class|extends|interface|type|enum|struct|pub|fn|use|mod|impl|trait)\b/g, '<span class="text-purple-400 font-bold">$1</span>')
      .replace(/\b(string|number|boolean|any|void|never|unknown|object|i32|u32|f64|str|String|Vec|Option|Result|int|float|bool|dict|list)\b/g, '<span class="text-blue-300">$1</span>')
      .replace(/(\".*?\"|\'.*?\'|\`.*?\`)/g, '<span class="text-emerald-400">$1</span>')
      .replace(/\/\/.*/g, '<span class="text-slate-500">$1</span>')
      .replace(/#.*/g, '<span class="text-slate-500">$1</span>') 
      .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>')
      .replace(/([{}()\[\]])/g, '<span class="text-slate-400">$1</span>');
  };

  return (
    <div className="group/code relative my-4 rounded-lg overflow-hidden border border-[#30363d] bg-[#090d13]">
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary/50"></span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{lang || 'code'}</span>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined !text-[14px]">{copied ? 'done' : 'content_copy'}</span>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 font-mono text-[13px] leading-relaxed overflow-x-auto custom-scrollbar">
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  );
};

const INITIAL_MESSAGES: ChatMessage[] = [
  { 
    id: '1', 
    sender: 'Sarah Chen', 
    avatar: 'https://picsum.photos/seed/sarah/64', 
    text: 'Hey team, I started the auth module refactor session. Check this out:\n```typescript\nconst auth = async (req, res) => {\n  const user = await db.user.findUnique();\n  return user;\n}```', 
    timestamp: '10:30 AM', 
    isMe: false,
    reactions: { '🚀': ['Sarah Chen', 'Alex Rivers'], '👍': ['Marcus Thorne'] }
  },
  { 
    id: '2', 
    sender: 'Marcus Thorne', 
    avatar: 'https://picsum.photos/seed/marcus/64', 
    text: 'On my way. Just finishing a local build.', 
    timestamp: '10:32 AM', 
    isMe: false 
  },
];

const INITIAL_PARTICIPANTS: Participant[] = [
  { id: 'p1', name: 'Sarah Chen', username: 'sarahchen', avatar: 'https://picsum.photos/seed/sarah/64', isMuted: false, isSharingScreen: true, role: 'host', isTalking: true },
  { id: 'p2', name: 'Marcus Thorne', username: 'marcusthorne', avatar: 'https://picsum.photos/seed/marcus/64', isMuted: true, isSharingScreen: false, role: 'participant' },
  { id: 'p3', name: 'Alex Rivers', username: 'alexrivers', avatar: 'https://picsum.photos/seed/alex/64', isMuted: false, isSharingScreen: false, role: 'participant', isTalking: false },
  { id: 'ai-1', name: 'ForgeAI', username: 'forgeai', avatar: 'https://picsum.photos/seed/ai/64', isMuted: false, isSharingScreen: false, role: 'ai' },
];

const LiveSessions = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isHosting, setIsHosting] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [isSharingMyScreen, setIsSharingMyScreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Mention system states
  const [showMentionPicker, setShowMentionPicker] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [pickerIndex, setPickerIndex] = useState(0);

  const [chatFontSize, setChatFontSize] = useState(13);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const toggleMute = (id: string) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, isMuted: !p.isMuted, isTalking: !p.isMuted ? false : p.isTalking };
      }
      return p;
    }));
  };

  const stopSession = () => {
    if (confirm("Are you sure you want to end this live session?")) {
      setIsHosting(false);
    }
  };

  const adjustFontSize = (delta: number) => {
    setChatFontSize(prev => Math.min(Math.max(prev + delta, 11), 20));
  };

  // --- Mention System Logic ---

  const filteredParticipants = useMemo(() => {
    return participants.filter(p => 
      p.username.toLowerCase().includes(mentionSearch.toLowerCase()) ||
      p.name.toLowerCase().includes(mentionSearch.toLowerCase())
    );
  }, [participants, mentionSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const cursorPosition = e.target.selectionStart || 0;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');

    // Trigger if '@' is at start or follows a space, and no spaces follow it
    if (lastAtSymbol !== -1 && (lastAtSymbol === 0 || textBeforeCursor[lastAtSymbol - 1] === ' ')) {
      const query = textBeforeCursor.slice(lastAtSymbol + 1);
      if (!query.includes(' ')) {
        setMentionSearch(query);
        setShowMentionPicker(true);
        setPickerIndex(0);
        return;
      }
    }
    setShowMentionPicker(false);
  };

  const selectMention = (participant: Participant) => {
    const cursorPosition = inputRef.current?.selectionStart || 0;
    const textBeforeCursor = inputValue.slice(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtSymbol === -1) return;

    const textBeforeMention = inputValue.slice(0, lastAtSymbol);
    const textAfterMention = inputValue.slice(cursorPosition);
    
    const mentionText = `@${participant.username} `;
    const newValue = `${textBeforeMention}${mentionText}${textAfterMention}`;
    
    setInputValue(newValue);
    setShowMentionPicker(false);
    
    // Maintain focus and set cursor after the inserted mention
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newPos = lastAtSymbol + mentionText.length;
        inputRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showMentionPicker && filteredParticipants.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setPickerIndex(prev => (prev + 1) % filteredParticipants.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setPickerIndex(prev => (prev - 1 + filteredParticipants.length) % filteredParticipants.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        selectMention(filteredParticipants[pickerIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowMentionPicker(false);
      }
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || inputValue).trim();
    if (!textToSend) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      avatar: 'https://picsum.photos/seed/user1/32',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setShowMentionPicker(false);

    const lowerText = textToSend.toLowerCase();
    const shouldTriggerAI = lowerText.includes('@forgeai') || 
                            lowerText.includes('forgeai') || 
                            textToSend.endsWith('?');

    if (shouldTriggerAI) {
      setIsTyping(true);
      try {
        const activeSession = MOCK_SESSIONS[0];
        const participantNames = participants.map(p => p.name);
        const chatHistory = messages.slice(-5).map(m => ({
          sender: m.sender,
          text: m.text
        }));

        const aiResponse = await forgeAIService.getLiveChatResponse(
          textToSend,
          chatHistory,
          `Collaborating on ${activeSession.project}`, 
          participantNames
        );
        
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ForgeAI',
          avatar: 'https://picsum.photos/seed/ai/64',
          text: aiResponse || "Understood. Analyzing code blocks now.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          isAI: true,
        };

        setMessages(prev => [...prev, botMsg]);
      } catch (err) {
        console.error("ForgeAI Error:", err);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const renderMessageContent = (text: string) => {
    const parts = text.split(/```(\w+)?\n([\s\S]*?)```/g);
    
    if (parts.length > 1) {
      const elements: React.ReactNode[] = [];
      for (let i = 0; i < parts.length; i++) {
        if (i % 3 === 0) {
          if (parts[i].trim()) {
            elements.push(<div key={i} className="mb-2 last:mb-0">{renderTextWithMentions(parts[i])}</div>);
          }
        } else if (i % 3 === 2) {
          elements.push(<SyntaxHighlighter key={i} code={parts[i]} lang={parts[i-1]} />);
        }
      }
      return elements;
    }

    return renderTextWithMentions(text);
  };

  const renderTextWithMentions = (text: string) => {
    // Regex for @username (matches alphanumeric and common separators)
    const parts = text.split(/(@[a-zA-Z0-9_]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span key={i} className="text-primary font-bold hover:underline cursor-pointer transition-all">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex h-full overflow-hidden bg-gh-bg font-display">
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <div className="flex items-start justify-between mb-8 border-b border-gh-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Live Engineering Session</h1>
            <p className="text-gh-text-secondary text-sm mt-1">
              Synchronized cloud environment for {MOCK_SESSIONS[0].project}.
            </p>
          </div>
          <div className="flex items-center gap-3">
             {isHosting && (
                <>
                   <button 
                    onClick={() => setIsRecording(!isRecording)}
                    className={`flex items-center gap-2 px-4 h-9 rounded-md text-xs font-bold transition-all border ${isRecording ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-gh-bg-secondary text-gh-text-secondary border-gh-border hover:text-white'}`}
                   >
                     <span className={`material-symbols-outlined !text-[18px] ${isRecording ? 'animate-pulse filled' : ''}`}>fiber_manual_record</span>
                     {isRecording ? 'RECORDING' : 'Record'}
                   </button>
                   <button 
                    onClick={stopSession}
                    className="flex items-center gap-2 px-4 h-9 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-xs font-bold transition-all shadow-sm"
                   >
                     End Session
                   </button>
                </>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {participants.map(p => (
            <div key={p.id} className="bg-gh-bg-secondary border border-gh-border rounded-xl p-5 flex items-center justify-between group hover:border-gh-text-secondary transition-all">
               <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={p.avatar} alt={p.name} className={`size-12 rounded-full border-2 transition-all ${p.isTalking ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-gh-border'}`} />
                    {p.isTalking && <span className="absolute -bottom-1 -right-1 size-3 bg-emerald-500 rounded-full border-2 border-gh-bg-secondary"></span>}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{p.name}</h3>
                    <p className="text-[10px] text-gh-text-secondary font-bold uppercase tracking-widest">{p.role}</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button onClick={() => toggleMute(p.id)} className={`size-8 rounded-md flex items-center justify-center border transition-all ${p.isMuted ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-gh-bg border-gh-border text-gh-text-secondary hover:text-white'}`}>
                     <span className="material-symbols-outlined !text-[18px]">{p.isMuted ? 'mic_off' : 'mic'}</span>
                  </button>
                  <button className="size-8 rounded-md flex items-center justify-center bg-gh-bg border border-gh-border text-gh-text-secondary hover:text-white transition-all opacity-0 group-hover:opacity-100">
                     <span className="material-symbols-outlined !text-[18px]">more_vert</span>
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Sidebar with Mention System */}
      <aside className="w-[400px] border-l border-gh-border bg-gh-bg flex flex-col shrink-0 relative">
        <div className="h-14 px-6 flex items-center justify-between border-b border-gh-border bg-black/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary !text-[18px] filled">forum</span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-gh-text-secondary">Session Chat</span>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={() => adjustFontSize(-1)} className="text-gh-text-secondary hover:text-white transition-colors"><span className="material-symbols-outlined !text-[16px]">remove</span></button>
             <button onClick={() => adjustFontSize(1)} className="text-gh-text-secondary hover:text-white transition-colors"><span className="material-symbols-outlined !text-[16px]">add</span></button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
              <img src={msg.avatar} alt={msg.sender} className="size-8 rounded-full shrink-0 border border-gh-border object-cover" />
              <div className={`flex flex-col max-w-[85%] ${msg.isMe ? 'items-end' : ''}`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className={`text-[10px] font-bold uppercase ${msg.isAI ? 'text-primary' : 'text-gh-text-secondary'}`}>{msg.sender}</span>
                </div>
                <div 
                  style={{ fontSize: `${chatFontSize}px` }}
                  className={`p-3 rounded-xl border leading-relaxed ${
                    msg.isMe 
                      ? 'bg-primary text-gh-bg font-medium border-primary' 
                      : 'bg-gh-bg-secondary border-gh-border text-gh-text'
                  }`}
                >
                  {renderMessageContent(msg.text)}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 animate-pulse">
               <div className="size-8 rounded-full bg-gh-bg-secondary border border-gh-border" />
               <div className="bg-gh-bg-secondary border border-gh-border p-3 rounded-xl w-16 h-8" />
            </div>
          )}
        </div>

        {/* --- Mention Picker Dropdown --- */}
        {showMentionPicker && filteredParticipants.length > 0 && (
          <div className="absolute bottom-24 left-6 right-6 bg-[#1c2128] border border-gh-border rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 ring-1 ring-black/50">
            <div className="px-3 py-2 border-b border-gh-border bg-black/20">
              <p className="text-[9px] font-bold text-gh-text-secondary uppercase tracking-widest">Suggestions</p>
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {filteredParticipants.map((p, i) => (
                <button
                  key={p.id}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${
                    i === pickerIndex ? 'bg-primary text-gh-bg' : 'hover:bg-white/5'
                  }`}
                  onClick={() => selectMention(p)}
                >
                  <img src={p.avatar} alt={p.name} className={`size-6 rounded-full border ${i === pickerIndex ? 'border-gh-bg' : 'border-gh-border'}`} />
                  <div className="min-w-0">
                    <span className={`text-[13px] font-bold block truncate ${i === pickerIndex ? 'text-gh-bg' : 'text-gh-text'}`}>{p.name}</span>
                    <span className={`text-[10px] font-medium uppercase tracking-tight ${i === pickerIndex ? 'text-gh-bg/70' : 'text-gh-text-secondary'}`}>@{p.username}</span>
                  </div>
                  {p.role === 'ai' && (
                    <span className={`ml-auto material-symbols-outlined !text-[16px] filled ${i === pickerIndex ? 'text-gh-bg' : 'text-primary'}`}>auto_awesome</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 bg-gh-bg border-t border-gh-border">
          <form onSubmit={handleSendMessage} className="relative">
            <input 
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full bg-gh-bg-secondary border border-gh-border rounded-md text-[13px] p-3 pr-12 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-600 text-gh-text transition-all outline-none" 
              placeholder="Message session... (Type @ for mentions)"
              autoComplete="off"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2 top-1.5 size-8 flex items-center justify-center text-gh-text-secondary hover:text-primary transition-all disabled:opacity-30"
            >
              <span className="material-symbols-outlined !text-[20px] filled">send</span>
            </button>
          </form>
          <p className="text-[10px] text-gh-text-secondary mt-3 font-medium text-center">
             ForgeAI summarizes session chat every 15 minutes.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default LiveSessions;
