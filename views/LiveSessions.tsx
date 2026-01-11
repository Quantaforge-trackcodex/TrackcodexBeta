
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
  avatar: string;
  isMuted: boolean;
  isSharingScreen: boolean;
  role: 'host' | 'participant' | 'ai';
  isTalking?: boolean; 
}

const COMMON_EMOJIS = ['👍', '❤️', '🔥', '🚀', '😄', '💡'];
const LANGUAGES = ['typescript', 'javascript', 'rust', 'go', 'python', 'json', 'markdown'];

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
    <div className="group/code relative my-4 rounded-xl overflow-hidden border border-[#30363d] bg-[#090d13]">
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary/50"></span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{lang || 'code'}</span>
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
  { id: 'p1', name: 'Sarah Chen', avatar: 'https://picsum.photos/seed/sarah/64', isMuted: false, isSharingScreen: true, role: 'host', isTalking: true },
  { id: 'p2', name: 'Marcus Thorne', avatar: 'https://picsum.photos/seed/marcus/64', isMuted: true, isSharingScreen: false, role: 'participant' },
  { id: 'p3', name: 'Alex Rivers', avatar: 'https://picsum.photos/seed/alex/64', isMuted: false, isSharingScreen: false, role: 'participant', isTalking: false },
  { id: 'ai-1', name: 'ForgeAI', avatar: 'https://picsum.photos/seed/ai/64', isMuted: false, isSharingScreen: false, role: 'ai' },
];

const LiveSessions = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isHosting, setIsHosting] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [isSharingMyScreen, setIsSharingMyScreen] = useState(false);
  const [allMuted, setAllMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [auditLog, setAuditLog] = useState<string[]>([
    'Sarah Chen started screen sharing via IDE instance',
    'Audio channels synchronized with ForgeAI noise reduction'
  ]);
  
  const [isSnippetModalOpen, setIsSnippetModalOpen] = useState(false);
  const [snippetCode, setSnippetCode] = useState('');
  const [snippetLang, setSnippetLang] = useState('typescript');

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

  const toggleMuteAll = () => {
    const nextState = !allMuted;
    setAllMuted(nextState);
    setParticipants(prev => prev.map(p => 
      p.role === 'participant' ? { ...p, isMuted: nextState, isTalking: nextState ? false : p.isTalking } : p
    ));
  };

  const kickParticipant = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from this session?`)) {
      setParticipants(prev => prev.filter(p => p.id !== id));
    }
  };

  const stopSession = () => {
    if (confirm("Are you sure you want to end this live session for everyone?")) {
      setIsHosting(false);
    }
  };

  const adjustFontSize = (delta: number) => {
    setChatFontSize(prev => Math.min(Math.max(prev + delta, 11), 22));
  };

  // Mentions logic
  const filteredParticipants = useMemo(() => {
    return participants.filter(p => p.name.toLowerCase().includes(mentionSearch.toLowerCase()));
  }, [participants, mentionSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const cursorPosition = e.target.selectionStart || 0;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');

    // Show picker if '@' is at the end of word or start of string
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
    
    const mentionText = `@${participant.name} `;
    const newValue = `${textBeforeMention}${mentionText}${textAfterMention}`;
    
    setInputValue(newValue);
    setShowMentionPicker(false);
    
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

  const addToAuditLog = (msg: string) => {
    setAuditLog(prev => [msg, ...prev].slice(0, 5));
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
      addToAuditLog(`ForgeAI analyzing request...`);

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
          text: aiResponse || "Analysis complete.",
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

  const handleShareSnippet = () => {
    if (!snippetCode.trim()) return;
    const formatted = `\`\`\`${snippetLang}\n${snippetCode}\n\`\`\``;
    handleSendMessage(undefined, formatted);
    setIsSnippetModalOpen(false);
    setSnippetCode('');
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...(msg.reactions || {}) };
        const users = (reactions[emoji] ? [...reactions[emoji]] : []) as string[];
        if (users.includes('You')) {
          reactions[emoji] = users.filter(u => u !== 'You');
          if (reactions[emoji].length === 0) delete reactions[emoji];
        } else {
          reactions[emoji] = [...users, 'You'];
        }
        return { ...msg, reactions };
      }
      return msg;
    }));
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
    const parts = text.split(/(@\w+(?:\s\w+)?)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return <span key={i} className="text-primary font-bold">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="flex h-full overflow-hidden relative">
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2 font-display">Live Sessions</h1>
            <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
              Real-time high-fidelity collaboration for distributed engineering teams.
            </p>
          </div>
          {!isHosting && (
             <button 
              onClick={() => setIsHosting(true)}
              className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
             >
               <span className="material-symbols-outlined text-lg">add_circle</span>
               New Live Session
             </button>
          )}
        </div>

        {isHosting && (
          <section className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-surface-dark border-2 border-primary/20 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 bg-gradient-to-r from-primary/10 to-transparent border-b border-border-dark flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                    <span className="material-symbols-outlined text-2xl">settings_input_component</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      Host Command Console 
                      <span className="px-2 py-0.5 rounded-full bg-primary text-[10px] font-black uppercase tracking-widest text-white">Master</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-500"></span>
                      Streaming 1080p • Low Latency
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsRecording(!isRecording)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isRecording ? 'bg-red-500 text-white border-red-400 animate-pulse' : 'bg-surface-dark text-slate-400 border-border-dark hover:text-white hover:border-slate-500'}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{isRecording ? 'radio_button_checked' : 'fiber_manual_record'}</span>
                    {isRecording ? 'REC 00:45:12' : 'Record Session'}
                  </button>
                  <button 
                    onClick={() => setIsSharingMyScreen(!isSharingMyScreen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isSharingMyScreen ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-surface-dark text-slate-400 border-border-dark hover:text-white hover:border-slate-500'}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{isSharingMyScreen ? 'screen_share' : 'stop_screen_share'}</span>
                    {isSharingMyScreen ? 'Sharing' : 'Share Screen'}
                  </button>
                  <button 
                    onClick={stopSession}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-500/20"
                  >
                    <span className="material-symbols-outlined text-[18px]">power_settings_new</span>
                    End Session
                  </button>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">engineering</span>
                      Manage Engineers ({participants.length})
                    </h3>
                  </div>
                  <div className="space-y-2 max-h-[320px] overflow-y-auto custom-scrollbar pr-3">
                    {participants.map(p => (
                      <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl bg-background-dark/40 border transition-all group ${p.isMuted ? 'border-red-500/10 opacity-70' : 'border-border-dark hover:border-primary/30'}`}>
                        <div className="flex items-center gap-3">
                          <img src={p.avatar} alt={p.name} className="size-10 rounded-full border border-border-dark object-cover" />
                          <div>
                            <p className="text-sm font-bold text-slate-200">{p.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{p.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleMute(p.id)} className="size-8 rounded-lg flex items-center justify-center bg-slate-800 text-slate-400 hover:text-white">
                             <span className="material-symbols-outlined text-[18px]">{p.isMuted ? 'mic_off' : 'mic'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">analytics</span>
                      Session Health
                   </h3>
                   <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-primary uppercase">Spectators</p>
                        <p className="text-3xl font-black">124</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-emerald-500 uppercase">Commits</p>
                        <p className="text-3xl font-black">12</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-lg font-bold">Recommended Sessions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_SESSIONS.map(session => (
              <div key={session.id} className="bg-surface-dark rounded-2xl border border-border-dark p-6 hover:border-primary/50 transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">hub</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-100">{session.title}</h4>
                </div>
                <button className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white py-2 rounded-xl text-xs font-black transition-all">
                  Join Session
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="w-85 border-l border-border-dark bg-surface-dark/10 flex flex-col shrink-0 relative backdrop-blur-sm">
        <div className="p-5 border-b border-border-dark bg-background-dark/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary filled">diversity_3</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Chat</span>
            </div>
            <div className="flex items-center bg-surface-dark border border-border-dark rounded-lg p-0.5 overflow-hidden">
                <button onClick={() => adjustFontSize(-1)} className="size-6 flex items-center justify-center text-slate-400 hover:text-white text-xs"><span className="material-symbols-outlined !text-[14px]">remove</span></button>
                <button onClick={() => adjustFontSize(1)} className="size-6 flex items-center justify-center text-slate-400 hover:text-white text-xs"><span className="material-symbols-outlined !text-[14px]">add</span></button>
            </div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 p-5 overflow-y-auto custom-scrollbar flex flex-col gap-6"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
              <img src={msg.avatar} alt={msg.sender} className="size-9 rounded-full shrink-0 border border-border-dark object-cover" />
              <div className={`flex flex-col max-w-[85%] ${msg.isMe ? 'items-end' : ''}`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className={`text-[11px] font-black uppercase tracking-tight ${msg.isAI ? 'text-primary' : 'text-slate-400'}`}>{msg.sender}</span>
                </div>
                <div 
                  style={{ fontSize: `${chatFontSize}px` }}
                  className={`p-3 rounded-2xl ${
                    msg.isMe 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-surface-dark border border-border-dark text-slate-200 rounded-tl-none'
                  }`}
                >
                  {renderMessageContent(msg.text)}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 animate-pulse">
               <div className="size-9 rounded-full bg-slate-800" />
               <div className="bg-surface-dark p-3 rounded-2xl rounded-tl-none w-16 h-8" />
            </div>
          )}
        </div>

        {/* Mention Picker Dropdown */}
        {showMentionPicker && filteredParticipants.length > 0 && (
          <div className="absolute bottom-24 left-5 right-5 bg-[#161b22] border-2 border-primary/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <div className="p-2 border-b border-[#30363d] bg-black/20">
              <p className="text-[9px] font-black text-primary uppercase tracking-widest pl-2">Mention Participant</p>
            </div>
            <div className="max-h-56 overflow-y-auto custom-scrollbar">
              {filteredParticipants.map((p, i) => (
                <button
                  key={p.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                    i === pickerIndex ? 'bg-primary/20 border-l-4 border-primary' : 'hover:bg-white/5 border-l-4 border-transparent'
                  }`}
                  onClick={() => selectMention(p)}
                >
                  <img src={p.avatar} alt={p.name} className="size-7 rounded-full border border-[#30363d]" />
                  <div>
                    <span className="text-xs font-bold text-slate-100 block">{p.name}</span>
                    <span className="text-[9px] text-slate-500 uppercase">{p.role}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-5 bg-background-dark/80 border-t border-border-dark">
          <form onSubmit={handleSendMessage} className="relative">
            <input 
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full bg-surface-dark border-2 border-border-dark rounded-2xl text-[13px] p-4 pr-12 focus:ring-0 focus:border-primary placeholder:text-slate-600 text-white transition-all shadow-inner" 
              placeholder="Type @ to mention..."
              autoComplete="off"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-3 top-2.5 size-9 flex items-center justify-center bg-primary disabled:bg-slate-800 text-white disabled:text-slate-600 rounded-xl transition-all"
            >
              <span className="material-symbols-outlined !text-[20px] filled">arrow_forward</span>
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
};

export default LiveSessions;
