import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { 
  PanelGroup, 
  Panel, 
  PanelResizeHandle 
} from 'react-resizable-panels';
import { forgeAIService } from '../services/gemini';
import Spinner from '../components/ui/Spinner';

// --- MOCK DATA ---

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path: string;
}

const FILE_STRUCTURE: FileNode[] = [
  {
    name: 'src', type: 'folder', path: 'src', children: [
      {
        name: 'components', type: 'folder', path: 'src/components', children: [
          { name: 'Button.tsx', type: 'file', path: 'src/components/Button.tsx' },
          { name: 'Card.tsx', type: 'file', path: 'src/components/Card.tsx' },
        ],
      },
      { name: 'styles', type: 'folder', path: 'src/styles', children: [
          { name: 'globals.css', type: 'file', path: 'src/styles/globals.css' },
        ],
      },
      { name: 'App.tsx', type: 'file', path: 'src/App.tsx' },
    ],
  },
  { name: 'package.json', type: 'file', path: 'package.json' },
];

const FILE_CONTENTS: Record<string, string> = {
  'Button.tsx': `import React from 'react';\n\nconst Button = () => <button>Click me</button>;\n\nexport default Button;`,
  'Card.tsx': `import React from 'react';\n\nconst Card = ({ children }) => <div>{children}</div>;\n\nexport default Card;`,
  'globals.css': `body {\n  margin: 0;\n  font-family: sans-serif;\n}`,
  'App.tsx': `import React from 'react';\nimport Button from './components/Button';\n\nconst App = () => (\n  <div>\n    <h1>Welcome to TrackCodex</h1>\n    <Button />\n  </div>\n);\n\nexport default App;`,
  'package.json': JSON.stringify({ name: 'trackcodex-app', version: '1.0.0' }, null, 2),
};

// --- AI ASSISTANT PANEL ---
interface ForgeAIAssistantPanelProps {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  activeFile: string;
}

interface Message {
  type: 'user' | 'ai' | 'system';
  text: string;
}

const ForgeAIAssistantPanel: React.FC<ForgeAIAssistantPanelProps> = ({ editorRef, activeFile }) => {
  const [conversation, setConversation] = useState<Message[]>([
    { type: 'system', text: 'ForgeAI assistant ready. Select code and choose an action, or ask a question.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isLoading]);

  const handleAction = useCallback(async (action: 'review' | 'explain' | 'refactor') => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = editor.getSelection();
    const selectedText = selection && !selection.isEmpty() ? editor.getModel()?.getValueInRange(selection) : editor.getValue();

    if (!selectedText) {
      setConversation(prev => [...prev, { type: 'system', text: 'Please select some code in the editor first.' }]);
      return;
    }

    let prompt = '';
    let serviceCall: Promise<string | undefined>;

    if (action === 'review') {
      prompt = `Reviewing selected code from ${activeFile}:`;
      serviceCall = forgeAIService.getCodeReview(selectedText, activeFile);
    } else if (action === 'explain') {
      prompt = `Explaining selected code from ${activeFile}:`;
      serviceCall = forgeAIService.getTechnicalAnswer(`Explain this code snippet`, selectedText, activeFile);
    } else { // refactor
      prompt = `Refactoring selected code from ${activeFile}:`;
      serviceCall = forgeAIService.getCodeRefactorSuggestion(selectedText, activeFile);
    }
    
    setConversation(prev => [...prev, { type: 'user', text: prompt }]);
    setIsLoading(true);

    try {
      const response = await serviceCall;
      setConversation(prev => [...prev, { type: 'ai', text: response || "I couldn't generate a response." }]);
    } catch (e: any) {
      setConversation(prev => [...prev, { type: 'system', text: `An error occurred: ${e.message}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [editorRef, activeFile]);
  
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const editor = editorRef.current;
    const fullCode = editor ? editor.getValue() : '';

    const question = input;
    setInput('');
    setConversation(prev => [...prev, { type: 'user', text: question }]);
    setIsLoading(true);

    try {
      const response = await forgeAIService.getTechnicalAnswer(question, fullCode, activeFile);
      setConversation(prev => [...prev, { type: 'ai', text: response || "I couldn't generate a response." }]);
    } catch (e: any) {
      setConversation(prev => [...prev, { type: 'system', text: `An error occurred: ${e.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    
    const actions = [
      editor.addAction({ id: 'forgeai-explain', label: 'ForgeAI: Explain Selection', contextMenuGroupId: '9_cutcopypaste', contextMenuOrder: 3.1, run: () => handleAction('explain') }),
      editor.addAction({ id: 'forgeai-review', label: 'ForgeAI: Review Selection', contextMenuGroupId: '9_cutcopypaste', contextMenuOrder: 3.2, run: () => handleAction('review') }),
      editor.addAction({ id: 'forgeai-refactor', label: 'ForgeAI: Refactor Selection', contextMenuGroupId: '9_cutcopypaste', contextMenuOrder: 3.3, run: () => handleAction('refactor') }),
    ];

    return () => {
      actions.forEach(action => action.dispose());
    };
  }, [editorRef, handleAction]);


  return (
    <div className="h-full bg-vscode-sidebar flex flex-col text-sm">
      <div className="h-10 flex items-center px-4 border-b border-vscode-border">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-400 !text-base filled">auto_awesome</span>
          ForgeAI Assistant
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {conversation.map((msg, i) => (
          <div key={i} className={`flex flex-col gap-2 ${msg.type === 'user' ? 'items-end' : ''}`}>
             {msg.type === 'ai' && <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">ForgeAI</div>}
             <div className={`p-3 rounded-lg max-w-[90%] prose prose-invert prose-sm leading-relaxed ${
                msg.type === 'user' ? 'bg-primary text-white' : 
                msg.type === 'ai' ? 'bg-[#2a2d2e] border border-vscode-border' : 
                'text-center text-xs text-slate-500 w-full'
             }`}>
                {msg.text.split(/```(\w*)\n([\s\S]*?)```/g).map((part, index) => {
                   if (index % 3 === 2) {
                     return <pre key={index} className="bg-black/50 p-3 rounded-md overflow-x-auto my-2"><code className="font-mono">{part}</code></pre>
                   }
                   if (index % 3 === 0) {
                     return <div key={index}>{part}</div>
                   }
                   return null;
                })}
             </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-center gap-2 text-purple-400 animate-pulse p-3">
                <Spinner size="sm" />
                <span className="text-xs font-bold uppercase">ForgeAI is thinking...</span>
            </div>
        )}
        <div ref={conversationEndRef} />
      </div>

      <div className="p-4 border-t border-vscode-border space-y-3">
        <div className="grid grid-cols-3 gap-2">
            <button onClick={() => handleAction('review')} className="px-2 py-1.5 bg-[#2a2d2e] text-slate-300 text-[10px] font-bold rounded hover:bg-white/10 transition-colors">Review</button>
            <button onClick={() => handleAction('refactor')} className="px-2 py-1.5 bg-[#2a2d2e] text-slate-300 text-[10px] font-bold rounded hover:bg-white/10 transition-colors">Refactor</button>
            <button onClick={() => handleAction('explain')} className="px-2 py-1.5 bg-[#2a2d2e] text-slate-300 text-[10px] font-bold rounded hover:bg-white/10 transition-colors">Explain</button>
        </div>
        <form onSubmit={handleAskQuestion}>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="w-full bg-vscode-editor border border-vscode-border rounded-md px-3 py-2 text-xs text-white focus:ring-1 focus:ring-primary outline-none"
          />
        </form>
      </div>
    </div>
  );
};


// --- SUBCOMPONENTS ---

const ActivityBarItem = ({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) => (
  <button title={label} className="w-full h-12 flex items-center justify-center relative">
    {active && <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-white rounded-r-full"></div>}
    <span className={`material-symbols-outlined !text-2xl ${active ? 'text-white' : 'text-slate-500 hover:text-white'}`}>
      {icon}
    </span>
  </button>
);

const FileEntry = ({ node, depth = 0, onSelect, activeFile, expandedFolders, onToggleFolder }: any) => {
  const isFolder = node.type === 'folder';
  const isActive = activeFile === node.path;
  const isExpanded = expandedFolders.has(node.path);

  const handleSelect = () => {
    if (isFolder) {
      onToggleFolder(node.path);
    } else {
      onSelect(node.path, node.name);
    }
  };

  return (
    <div>
      <div
        onClick={handleSelect}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
        className={`flex items-center gap-1.5 h-6 cursor-pointer text-slate-400 hover:bg-white/5 hover:text-white text-sm ${isActive ? 'bg-white/10 text-white' : ''}`}
      >
        {isFolder ? (
          <span className={`material-symbols-outlined !text-base transition-transform ${isExpanded ? '' : '-rotate-90'}`}>expand_more</span>
        ) : <div className="w-4"></div>}
        <span className="material-symbols-outlined !text-base text-slate-500">{isFolder ? (isExpanded ? 'folder_open' : 'folder') : 'description'}</span>
        <span>{node.name}</span>
      </div>
      {isFolder && isExpanded && node.children?.map((child: FileNode) => (
        <FileEntry 
          key={child.path} 
          node={child} 
          depth={depth + 1} 
          onSelect={onSelect}
          activeFile={activeFile}
          expandedFolders={expandedFolders}
          onToggleFolder={onToggleFolder}
        />
      ))}
    </div>
  );
};

const EditorView = ({ isFocusMode = false }: { isFocusMode?: boolean }) => {
  const [openFiles, setOpenFiles] = useState<string[]>(['src/App.tsx']);
  const [activeFile, setActiveFile] = useState<string>('src/App.tsx');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/components', 'src/styles']));
  const [line, setLine] = useState(1);
  const [col, setCol] = useState(1);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleFileSelect = useCallback((path: string) => {
    if (!openFiles.includes(path)) {
      setOpenFiles(prev => [...prev, path]);
    }
    setActiveFile(path);
  }, [openFiles]);

  const handleCloseTab = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    const newOpenFiles = openFiles.filter(f => f !== path);
    setOpenFiles(newOpenFiles);
    if (activeFile === path) {
      setActiveFile(newOpenFiles[0] || '');
    }
  };

  const toggleFolder = useCallback((path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const language = useMemo(() => {
    const ext = activeFile.split('.').pop();
    switch (ext) {
      case 'tsx': return 'typescript';
      case 'css': return 'css';
      case 'json': return 'json';
      default: return 'plaintext';
    }
  }, [activeFile]);
  
  const renderTree = (nodes: FileNode[]) => {
    return nodes.map(node => (
      <FileEntry 
        key={node.path} 
        node={node} 
        onSelect={handleFileSelect}
        activeFile={activeFile}
        expandedFolders={expandedFolders}
        onToggleFolder={toggleFolder}
      />
    ));
  };

  return (
    <div className="flex h-full font-display bg-[#1e1e1e]">
      {!isFocusMode && (
        <div className="w-12 bg-[#333333] flex flex-col items-center py-2 shrink-0 z-20">
          <ActivityBarItem icon="description" label="Explorer" active />
          <ActivityBarItem icon="search" label="Search" />
          <ActivityBarItem icon="hub" label="Source Control" />
          <ActivityBarItem icon="play_circle" label="Run and Debug" />
          <ActivityBarItem icon="extension" label="Extensions" />
          <div className="mt-auto">
            <ActivityBarItem icon="account_circle" label="Account" />
            <ActivityBarItem icon="settings" label="Settings" />
          </div>
        </div>
      )}

      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={15} collapsible collapsed={isFocusMode}>
          <div className="h-full bg-vscode-sidebar flex flex-col">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-4 py-2">Explorer</h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              {renderTree(FILE_STRUCTURE)}
            </div>
          </div>
        </Panel>
        <PanelResizeHandle className={isFocusMode ? "hidden" : "w-1 bg-vscode-activity-bar hover:bg-primary transition-colors"} />
        <Panel>
          <div className="flex flex-col h-full bg-vscode-editor">
            <div className="flex bg-[#252526] shrink-0 overflow-x-auto no-scrollbar">
              {openFiles.map(path => (
                <div 
                  key={path} 
                  onClick={() => setActiveFile(path)}
                  className={`flex items-center gap-2 px-3 h-9 text-sm cursor-pointer border-r border-[#1e1e1e] ${activeFile === path ? 'bg-vscode-editor text-white' : 'text-slate-400 hover:bg-[#333333]'}`}
                >
                  <span className="material-symbols-outlined !text-base text-blue-400">javascript</span>
                  <span>{path.split('/').pop()}</span>
                  <button onClick={(e) => handleCloseTab(e, path)} className="ml-2 p-0.5 rounded hover:bg-white/10 text-slate-500 hover:text-white">
                    <span className="material-symbols-outlined !text-sm">close</span>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                path={activeFile}
                value={FILE_CONTENTS[activeFile] || ''}
                language={language}
                theme="vs-dark"
                options={{ 
                  minimap: { enabled: isFocusMode ? false : true },
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, monospace',
                  scrollBeyondLastLine: false,
                  contextmenu: true,
                }}
                onMount={(editor) => {
                  editorRef.current = editor;
                  editor.onDidChangeCursorPosition(e => {
                     setLine(e.position.lineNumber);
                     setCol(e.position.column);
                  });
                }}
              />
            </div>
          </div>
        </Panel>
        <PanelResizeHandle className={isFocusMode ? "hidden" : "w-1 bg-vscode-activity-bar hover:bg-primary transition-colors"} />
        <Panel defaultSize={30} minSize={25} collapsible collapsed={isFocusMode}>
            <ForgeAIAssistantPanel editorRef={editorRef} activeFile={activeFile} />
        </Panel>
      </PanelGroup>

      {!isFocusMode && (
        <footer className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[11px] font-medium shrink-0 z-50">
          <div className="flex items-center gap-4 h-full">
            <div className="flex items-center gap-1.5 hover:bg-white/10 px-2 h-full cursor-pointer">
              <span className="material-symbols-outlined !text-[14px]">account_tree</span>
              <span className="font-bold">main</span>
            </div>
          </div>
          <div className="flex items-center gap-4 h-full">
            <div className="hover:bg-white/10 px-2 h-full flex items-center cursor-pointer">
              Ln {line}, Col {col}
            </div>
            <div className="hover:bg-white/10 px-2 h-full flex items-center cursor-pointer">Spaces: 2</div>
            <div className="hover:bg-white/10 px-2 h-full flex items-center cursor-pointer">UTF-8</div>
            <div className="hover:bg-white/10 px-2 h-full flex items-center cursor-pointer uppercase">{language}</div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default EditorView;