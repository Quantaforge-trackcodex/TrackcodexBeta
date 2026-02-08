
import React, { useState } from 'react';

interface QuickEditorProps {
  filename: string;
  initialContent: string;
  onSave: (newContent: string) => void;
  onCancel: () => void;
}

const QuickEditor: React.FC<QuickEditorProps> = ({ filename, initialContent, onSave, onCancel }) => {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API delay
    setTimeout(() => {
      onSave(content);
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] rounded-2xl border border-[#30363d] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
      {/* Editor Toolbar */}
      <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-blue-400 !text-[20px]">javascript</span>
          <span className="text-[13px] font-bold text-slate-200">{filename}</span>
          <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Editing</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-[11px] font-black uppercase text-slate-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20 hover:bg-blue-600 disabled:opacity-50 transition-all active:scale-95"
          >
            {isSaving ? (
              <span className="material-symbols-outlined animate-spin !text-[16px]">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined !text-[16px]">save</span>
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 flex overflow-hidden font-mono relative group">
        <div className="w-12 bg-[#0d1117] border-r border-[#30363d] pt-4 flex flex-col items-center text-slate-700 text-[12px] select-none shrink-0">
          {content.split('\n').map((_, i) => (
            <span key={i} className="h-6 leading-6">{i + 1}</span>
          ))}
        </div>
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 bg-transparent p-4 text-[13px] text-slate-300 leading-6 resize-none outline-none custom-scrollbar whitespace-pre overflow-x-auto"
          spellCheck={false}
        />

        {/* Selection / Caret Decorations Overlay (Visual Polish) */}
        <div className="absolute bottom-4 right-4 bg-primary/10 border border-primary/20 rounded-lg px-2 py-1 flex items-center gap-2 text-primary pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
          <span className="material-symbols-outlined !text-[14px]">info</span>
          <span className="text-[10px] font-black uppercase">Standard IDE Keybindings Enabled</span>
        </div>
      </div>

      {/* Editor Status Bar */}
      <div className="h-6 bg-primary text-primary-foreground px-3 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.1em]">
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>Ln {content.split('\n').length}, Col {content.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined !text-[12px] filled">auto_awesome</span>
          ForgeAI Refactoring Ready
        </div>
      </div>
    </div>
  );
};

export default QuickEditor;
