import React, { useRef, useEffect } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { useRealtime } from "../../contexts/RealtimeContext";

interface MonacoEditorProps {
  content: string;
  language: string;
  fileId: string; // Required for sync
  onChange: (value: string | undefined) => void;
  theme?: "vs-dark" | "light";
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  content,
  language,
  fileId,
  onChange,
  theme = "vs-dark",
}) => {
  const { cursors, send, subscribe } = useRealtime();
  const editorRef = useRef<any>(null);
  const decorationIdsRef = useRef<string[]>([]);
  const lastBroadcastRef = useRef<number>(0);
  const isRemoteUpdateRef = useRef<boolean>(false);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;

    // Configure editor settings for "Antigravity" parity
    editor.updateOptions({
      minimap: { enabled: true },
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
      fontLigatures: true,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      renderWhitespace: "selection",
      tabSize: 2,
    });

    // Handle cursor position changes (Throttled)
    editor.onDidChangeCursorPosition((e: any) => {
      const now = Date.now();
      if (now - lastBroadcastRef.current > 100) {
        // 100ms throttle
        send({
          type: "CURSOR_MOVE",
          fileId,
          lineNumber: e.position.lineNumber,
          column: e.position.column,
        });
        lastBroadcastRef.current = now;
      }
    });
  };

  // 1. Subscribe to remote buffer updates
  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (event.type === "BUFFER_SYNC" && event.fileId === fileId) {
        if (!editorRef.current) return;

        const editor = editorRef.current;
        const currentContent = editor.getValue();

        if (event.content !== currentContent) {
          isRemoteUpdateRef.current = true;

          const model = editor.getModel();
          if (model) {
            // Use pushEditOperations to preserve undo stack and minimize cursor jump
            model.pushEditOperations(
              [],
              [
                {
                  range: model.getFullModelRange(),
                  text: event.content,
                },
              ],
              () => null,
            );
          }

          isRemoteUpdateRef.current = false;
        }
      }
    });

    return () => unsubscribe();
  }, [fileId, subscribe]);

  // 2. Broadcast local changes
  const handleLocalChange = (value: string | undefined) => {
    if (value !== undefined && value !== null && !isRemoteUpdateRef.current) {
      send({
        type: "BUFFER_SYNC",
        fileId,
        content: value,
      });
    }
    onChange(value);
  };

  // 3. Listen for File Saved events
  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (event.type === "FILE_SAVED" && event.filePath === fileId) {
        console.log(`💾 File ${fileId} saved on server`);
        // We could show a toast or a small saved indicator here
      }
    });
    return () => unsubscribe();
  }, [fileId, subscribe]);

  // 3. Update remote cursors visualization
  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;

    // Filter cursors for the current file
    const remoteCursors = Object.entries(cursors).filter(
      ([, pos]: [string, any]) => pos.fileId === fileId,
    );

    const newDecorations = remoteCursors
      .map(([uid, pos]: [string, any]) => {
        const monaco = (window as any).monaco;
        if (!monaco) return null;
        return {
          range: new monaco.Range(
            pos.lineNumber,
            pos.column,
            pos.lineNumber,
            pos.column + 1,
          ),
          options: {
            className: `remote-cursor-${uid.substring(0, 6)}`,
            beforeContentClassName: `remote-cursor-label-${uid.substring(0, 6)}`,
            stickiness: 1, // NEVER_STALER_ON_RIGHT
          },
        };
      })
      .filter(Boolean) as any[];

    // Apply decorations
    decorationIdsRef.current = editor.deltaDecorations(
      decorationIdsRef.current,
      newDecorations,
    );

    // Dynamic CSS for user-specific colors
    remoteCursors.forEach(([uid]) => {
      const shortId = uid.substring(0, 6);
      if (!document.getElementById(`cursor-style-${shortId}`)) {
        const style = document.createElement("style");
        style.id = `cursor-style-${shortId}`;
        const color = `hsl(${parseInt(shortId, 16) % 360}, 70%, 50%)`;
        style.innerHTML = `
          .remote-cursor-${shortId} {
            border-left: 2px solid ${color};
            margin-left: -1px;
            z-index: 10;
          }
          .remote-cursor-label-${shortId}::after {
            content: "User ${shortId}";
            position: absolute;
            top: -15px;
            left: 0;
            background: ${color};
            color: white;
            font-size: 8px;
            padding: 1px 3px;
            border-radius: 2px;
            white-space: nowrap;
            z-index: 20;
            pointer-events: none;
          }
        `;
        document.head.appendChild(style);
      }
    });
  }, [cursors, fileId]);

  return (
    <div className="w-full h-full relative">
      <Editor
        height="100%"
        defaultLanguage="typescript"
        language={language}
        value={content}
        theme={theme}
        onChange={handleLocalChange}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full text-[#969696] text-sm">
            Loading Editor Engine...
          </div>
        }
        options={{
          padding: { top: 16 },
        }}
      />
    </div>
  );
};

export default MonacoEditor;
