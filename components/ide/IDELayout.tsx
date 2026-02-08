import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import ActivityBar from './ActivityBar';
import FileExplorer from './FileExplorer';
import ExtensionsPanel from './ExtensionsPanel';
import TerminalPanel from './TerminalPanel';
import SourceControlPanel from './SourceControlPanel';
import SearchPanel from './SearchPanel';
import RunAndDebugPanel from './RunAndDebugPanel';
import { MOCK_FILE_SYSTEM } from '../../constants';

interface FileSystemItem {
    id: string;
    name: string;
    type: 'file' | 'folder';
    content?: string;
    language?: string;
    children?: FileSystemItem[];
}

const IDELayout = () => {
    const [activeView, setActiveView] = useState('explorer');
    const [openFiles, setOpenFiles] = useState<FileSystemItem[]>([MOCK_FILE_SYSTEM[0]?.children?.[0]?.children?.[0]]); // Open main.cpp default
    const [activeFileId, setActiveFileId] = useState<string>(MOCK_FILE_SYSTEM[0]?.children?.[0]?.children?.[0]?.id || '');
    const [fileContent, setFileContent] = useState<string>(MOCK_FILE_SYSTEM[0]?.children?.[0]?.children?.[0]?.content || '');
    const [language, setLanguage] = useState<string>('cpp');
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [terminalLogs, setTerminalLogs] = useState<string[]>([
        "Welcome to TrackCodex Cloud Shell",
        "Type 'help' for a list of commands."
    ]);

    const toggleView = (view: string) => {
        if (activeView === view) {
            setSidebarVisible(!sidebarVisible);
        } else {
            setActiveView(view);
            setSidebarVisible(true);
        }
    };

    const handleFileClick = (file: FileSystemItem) => {
        const isOpen = openFiles.find(f => f.id === file.id);
        if (!isOpen) {
            setOpenFiles([...openFiles, file]);
        }
        setActiveFileId(file.id);
        setFileContent(file.content || '');
        setLanguage(file.language || 'plaintext');
    };

    const handleCloseFile = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newFiles = openFiles.filter(f => f.id !== id);
        setOpenFiles(newFiles);
        if (activeFileId === id && newFiles.length > 0) {
            handleFileClick(newFiles[newFiles.length - 1]);
        } else if (newFiles.length === 0) {
            setActiveFileId('');
            setFileContent('');
        }
    };

    const handleRunCode = () => {
        const activeFile = openFiles.find(f => f.id === activeFileId);
        if (!activeFile) return;

        const timestamp = new Date().toLocaleTimeString();
        let output = '';
        let executionOutput = '';

        // Simple Regex to extract print statements for "Simulation"
        if (activeFile.name.endsWith('.cpp')) {
            const match = fileContent.match(/std::cout\s*<<\s*"([^"]*)"/);
            executionOutput = match ? match[1] : 'Hello TrackCodex!'; // Fallback
            output = `[${timestamp}] Compiling ${activeFile.name}...\n> g++ ${activeFile.name} -o main && ./main\n${executionOutput}`;
        } else if (activeFile.name.endsWith('.go')) {
            const match = fileContent.match(/fmt\.Println\("([^"]*)"\)/);
            executionOutput = match ? match[1] : 'Server started';
            output = `[${timestamp}] Executing ${activeFile.name}...\n> go run ${activeFile.name}\n${executionOutput}`;
        } else if (activeFile.name.endsWith('.ts') || activeFile.name.endsWith('.js')) {
            // eslint-disable-next-line no-console
            const match = fileContent.match(/console\.log\(['"]([^'"]*)['"]\)/);
            executionOutput = match ? match[1] : 'Process started...';
            output = `[${timestamp}] Executing ${activeFile.name}...\n> ts-node ${activeFile.name}\n${executionOutput}`;
        } else {
            output = `[${timestamp}] Running ${activeFile.name}...\nDone.`;
        }

        setTerminalLogs(prev => [...prev, output]);
    };

    const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(MOCK_FILE_SYSTEM);

    const handleAddFile = (name: string, type: 'file' | 'folder') => {
        const newFile: FileSystemItem = {
            id: Date.now().toString(),
            name,
            type,
            language: name.split('.').pop() || 'plaintext',
            content: type === 'file' ? '// New file created' : undefined,
            children: type === 'folder' ? [] : undefined
        };

        // Create a deep copy to avoid mutation issues
        const newFS = JSON.parse(JSON.stringify(fileSystem));

        // Add to the first root folder (Project Root)
        if (newFS[0]) {
            if (!newFS[0].children) newFS[0].children = [];
            newFS[0].children.push(newFile);

            // Sort: Folders first, then files
            newFS[0].children.sort((a: FileSystemItem, b: FileSystemItem) => {
                if (a.type === b.type) return a.name.localeCompare(b.name);
                return a.type === 'folder' ? -1 : 1;
            });
        }

        setFileSystem(newFS);
        if (type === 'file') handleFileClick(newFile);
    };

    const renderSidePanel = () => {
        switch (activeView) {
            case 'explorer': return (
                <FileExplorer
                    fileSystem={fileSystem}
                    onFileClick={handleFileClick}
                    openFiles={openFiles}
                    activeFileId={activeFileId}
                    onCloseFile={handleCloseFile}
                    onAddFile={handleAddFile}
                />
            );
            case 'search': return <SearchPanel />;
            case 'git': return <SourceControlPanel />;
            case 'debug': return <RunAndDebugPanel />;
            case 'extensions': return <ExtensionsPanel />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col w-full h-full bg-[#1e1e1e] font-sans overflow-hidden">
            {/* Main Content Area (Activity Bar + Sidebar + Editors) */}
            <div className="flex-1 flex min-h-0 w-full">
                {/* Activity Bar */}
                <ActivityBar activeView={sidebarVisible ? activeView : ''} setActiveView={toggleView} />

                {/* Main Panel Group */}
                <PanelGroup direction="horizontal" className="flex-1">
                    {sidebarVisible && (
                        <>
                            <Panel defaultSize={20} minSize={15} maxSize={30} className="bg-[#252526] border-r border-[#1e1e1e]">
                                {renderSidePanel()}
                            </Panel>
                            <PanelResizeHandle className="w-[2px] bg-[#333] hover:bg-[#007fd4] transition-colors" />
                        </>
                    )}

                    <Panel>
                        <PanelGroup direction="vertical">
                            <Panel defaultSize={70} minSize={30}>
                                <div className="flex flex-col h-full bg-[#1e1e1e]">
                                    {/* Tabs Header Area */}
                                    <div className="h-[35px] bg-[#252526] flex items-center justify-between border-b border-[#252526] pr-2">
                                        {/* Actual Tabs */}
                                        <div className="flex items-center overflow-x-auto no-scrollbar h-full flex-1">
                                            {openFiles.length > 0 ? (
                                                openFiles.map(file => (
                                                    <div
                                                        key={file.id}
                                                        onClick={() => handleFileClick(file)}
                                                        className={`h-full flex items-center gap-2 px-3 min-w-[120px] max-w-[200px] border-r border-[#252526] cursor-pointer text-[13px] group relative ${activeFileId === file.id ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007fd4]' : 'bg-[#2d2d2d] text-[#969696] hover:bg-[#2a2d2e]'}`}
                                                    >
                                                        <span className={`material-symbols-outlined !text-[14px] ${file.language === 'cpp' ? 'text-blue-400' : 'text-amber-400'}`}>description</span>
                                                        <span className="truncate flex-1">{file.name}</span>
                                                        <span onClick={(e) => handleCloseFile(e, file.id)} className={`material-symbols-outlined !text-[14px] hover:bg-[#454545] rounded p-0.5 ml-1 ${activeFileId === file.id ? 'visible' : 'invisible group-hover:visible'}`}>close</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 text-xs text-[#969696]">No Open Files</div>
                                            )}
                                        </div>

                                        {/* Editor Actions (Run Button) */}
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={handleRunCode}
                                                className="p-1 hover:bg-[#3e3e42] rounded text-[#cccccc] hover:text-white transition-colors flex items-center justify-center tooltip"
                                                title="Run Code (Ctrl+Enter)"
                                            >
                                                <span className="material-symbols-outlined !text-[18px] text-green-500">play_arrow</span>
                                            </button>
                                            <button className="p-1 hover:bg-[#3e3e42] rounded text-[#cccccc] hover:text-white transition-colors flex items-center justify-center">
                                                <span className="material-symbols-outlined !text-[16px]">splitscreen</span>
                                            </button>
                                            <button className="p-1 hover:bg-[#3e3e42] rounded text-[#cccccc] hover:text-white transition-colors flex items-center justify-center">
                                                <span className="material-symbols-outlined !text-[16px]">more_horiz</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Editor or Empty State */}
                                    {openFiles.length > 0 ? (
                                        <>
                                            {/* Breadcrumbs */}
                                            <div className="h-[22px] bg-[#1e1e1e] flex items-center px-4 text-[11px] text-[#969696] gap-1 shrink-0">
                                                <span>track-api-prod</span>
                                                <span className="material-symbols-outlined !text-[12px]">chevron_right</span>
                                                <span>src</span>
                                                <span className="material-symbols-outlined !text-[12px]">chevron_right</span>
                                                <span className="text-white">{openFiles.find(f => f.id === activeFileId)?.name}</span>
                                            </div>

                                            <div className="flex-1 relative min-h-0">
                                                <Editor
                                                    height="100%"
                                                    theme="vs-dark"
                                                    path={activeFileId}
                                                    defaultLanguage={language}
                                                    language={language}
                                                    value={fileContent}
                                                    onChange={(val) => setFileContent(val || '')}
                                                    options={{
                                                        minimap: { enabled: true },
                                                        fontSize: 14,
                                                        fontFamily: 'JetBrains Mono, monospace',
                                                        scrollBeyondLastLine: false,
                                                        automaticLayout: true,
                                                        tabSize: 4,
                                                        wordWrap: 'on',
                                                        padding: { top: 10 }
                                                    }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-[#555]">
                                            <div className="text-[100px] opacity-10 mb-4">You have no open files</div>
                                            <p>Select a file from the explorer to start editing</p>
                                        </div>
                                    )}
                                </div>
                            </Panel>

                            <PanelResizeHandle className="h-[2px] bg-[#333] hover:bg-[#007fd4] transition-colors" />

                            <Panel defaultSize={30} minSize={10} collapsible>
                                <TerminalPanel logs={terminalLogs} />
                            </Panel>
                        </PanelGroup>
                    </Panel>
                </PanelGroup>
            </div>

            {/* Status Bar */}
            <div className="h-[22px] bg-[#007fd4] flex items-center justify-between px-3 text-[11px] text-white select-none shrink-0 z-50 border-t border-[#007fd4]">
                <div className="flex items-center gap-3">
                    <div className="bg-[#16825d] h-[22px] px-3 flex items-center justify-center cursor-pointer hover:bg-[#126b4d] transition-colors" title="Open Remote Window">
                        <span className="material-symbols-outlined !text-[14px]">code</span>
                    </div>
                    <div className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer transition-colors"><span className="material-symbols-outlined !text-[12px]">source_control</span> main*</div>
                    <div className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer transition-colors"><span className="material-symbols-outlined !text-[12px]">sync</span> 0</div>
                    <div className="hover:bg-white/20 px-1 rounded cursor-pointer transition-colors">0 errors, 0 warnings</div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hover:bg-white/20 px-1 rounded cursor-pointer transition-colors">Ln 12, Col 4</div>
                    <div className="hover:bg-white/20 px-1 rounded cursor-pointer transition-colors">UTF-8</div>
                    <div className="hover:bg-white/20 px-1 rounded cursor-pointer transition-colors">{language.toUpperCase()}</div>
                    <div className="hover:bg-white/20 px-1 rounded cursor-pointer transition-colors">Prettier</div>
                    <div className="hover:bg-white/20 px-1 rounded cursor-pointer transition-colors"><span className="material-symbols-outlined !text-[12px]">notifications</span></div>
                </div>
            </div>
        </div>
    );
};

export default IDELayout;
