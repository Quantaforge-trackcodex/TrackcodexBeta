
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface Command {
  id: string;
  label: string;
  icon: string;
  shortcut?: string;
  action: () => void;
}

const CommandPalette = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    { id: 'home', label: 'Go to Home', icon: 'home', action: () => navigate('/dashboard/home') },
    { id: 'workspaces', label: 'Open Workspaces', icon: 'terminal', action: () => navigate('/workspaces') },
    { id: 'repos', label: 'Browse Repositories', icon: 'account_tree', action: () => navigate('/repositories') },
    { id: 'forge', label: 'Ask ForgeAI', icon: 'psychology', action: () => navigate('/forge-ai') },
    { id: 'comm', label: 'Community Forum', icon: 'diversity_3', action: () => navigate('/community') },
    { id: 'settings', label: 'Settings: UI', icon: 'settings', action: () => navigate('/settings') },
    { id: 'sidebar', label: 'View: Toggle Sidebar', icon: 'side_navigation', shortcut: 'Ctrl+B', action: () => window.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, key: 'b' })) },
  ];

  const filteredCommands = commands.filter(c => 
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      filteredCommands[selectedIndex]?.action();
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-vscode-sidebar border border-vscode-border rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-3 border-b border-vscode-border">
          <input 
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search for files..."
            className="w-full bg-vscode-editor text-[13px] border-none focus:ring-1 focus:ring-primary/50 rounded p-2 text-white outline-none"
          />
        </div>
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar py-2">
          {filteredCommands.map((cmd, i) => (
            <div 
              key={cmd.id}
              onClick={() => { cmd.action(); onClose(); }}
              onMouseEnter={() => setSelectedIndex(i)}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${i === selectedIndex ? 'bg-primary text-white' : 'text-slate-300 hover:bg-white/5'}`}
            >
              <span className={`material-symbols-outlined !text-[18px] ${i === selectedIndex ? 'text-white' : 'text-slate-500'}`}>{cmd.icon}</span>
              <span className="text-[13px] flex-1">{cmd.label}</span>
              {cmd.shortcut && <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${i === selectedIndex ? 'bg-white/20' : 'bg-vscode-editor text-slate-500'}`}>{cmd.shortcut}</span>}
            </div>
          ))}
          {filteredCommands.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm italic">No matching commands found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
