import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const TerminalPanel = ({ workspaceId = 'default', onClose, onMaximize, logs = [] }: { workspaceId?: string; onClose?: () => void; onMaximize?: () => void; logs?: string[] }) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    // Initialize Terminal
    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new Terminal({
            cursorBlink: true,
            fontSize: 13,
            fontFamily: 'Consolas, monospace',
            theme: {
                background: '#1e1e1e',
                foreground: '#cccccc',
                black: '#000000',
                red: '#cd3131',
                green: '#0dbc79',
                yellow: '#e5e510',
                blue: '#2472c8',
                magenta: '#bc3fbc',
                cyan: '#11a8cd',
                white: '#e5e5e5',
            }
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Connect to WebSocket
        const ws = new WebSocket(`ws://localhost:4000/api/v1/forge/terminal/${workspaceId}`);
        socketRef.current = ws;

        ws.onopen = () => {
            term.write('\r\n\x1b[34m[Client] Connecting to The Forge...\x1b[0m\r\n');
        };

        ws.onmessage = (event) => {
            term.write(event.data);
        };

        ws.onclose = () => {
            term.write('\r\n\x1b[31m[Client] Disconnected from server.\x1b[0m\r\n');
        };

        // Terminal -> WebSocket
        term.onData((data) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(data);
            }
        });

        // Handle Resize
        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            term.dispose();
            ws.close();
        };
    }, [workspaceId]);

    // Write logs to terminal when prop changes
    useEffect(() => {
        if (!xtermRef.current || !logs.length) return;
        // Just write the latest log entry for simulation
        const lastLog = logs[logs.length - 1];
        if (lastLog) {
            xtermRef.current.write('\r\n' + lastLog.replace(/\n/g, '\r\n') + '\r\n');
        }
    }, [logs]);

    // Fit on mount/active
    useEffect(() => {
        setTimeout(() => fitAddonRef.current?.fit(), 100);
    }, []);

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e] border-t border-[#30363d] font-mono text-sm group">
            <div className="flex items-center justify-between px-4 border-b border-[#30363d] h-[30px] shrink-0 bg-[#1e1e1e]">
                <span className="text-[11px] font-bold text-white">TERMINAL (THE FORGE)</span>
                <div className="flex items-center gap-2">
                    <button onClick={onMaximize} className="text-[#cccccc] hover:text-white p-0.5" title="Toggle Maximize">
                        <span className="material-symbols-outlined !text-[16px]">keyboard_arrow_up</span>
                    </button>
                    <button onClick={onClose} className="text-[#cccccc] hover:text-white p-0.5" title="Close Panel">
                        <span className="material-symbols-outlined !text-[16px]">close</span>
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-hidden p-2" ref={terminalRef} />
        </div>
    );
};

export default TerminalPanel;
