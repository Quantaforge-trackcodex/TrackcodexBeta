import React, { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { useRealtime } from "../../contexts/RealtimeContext";

interface TerminalProps {
  workspaceId: string;
}

const Terminal: React.FC<TerminalProps> = ({ workspaceId }) => {
  const { send, subscribe } = useRealtime();
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      theme: {
        background: "#1e1e1e",
        foreground: "#cccccc",
        cursor: "#ffffff",
        selectionBackground: "#264f78",
      },
      fontSize: 14,
      fontFamily: "'JetBrains Mono', Consolas, monospace",
      cursorBlink: true,
      rows: 12,
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);

    setTimeout(() => fitAddon.fit(), 100);

    // Join Terminal Session via Socket.io
    send({ type: "TERMINAL_JOIN", workspaceId });

    // Subscribe to Terminal Output
    const unsubscribe = subscribe((event) => {
      if (event.type === "TERMINAL_OUTPUT") {
        term.write(event.data);
      }
    });

    term.onData((data) => {
      send({ type: "TERMINAL_INPUT", data });
    });

    xtermRef.current = term;

    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.fit();
      } catch {
        // Ignore resize errors
      }
    });

    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
      unsubscribe();
      term.dispose();
    };
  }, [workspaceId, send, subscribe]);

  return <div ref={terminalRef} className="w-full h-full bg-[#1e1e1e] p-2" />;
};

export default Terminal;
