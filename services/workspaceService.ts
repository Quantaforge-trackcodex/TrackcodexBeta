import { api } from "../services/api";

/**
 * Workspace Service
 * Handles backend integration for TrackCodex IDE workspaces
 */

export interface WorkspaceFile {
  id: string;
  name: string;
  path: string;
  type: "file" | "directory";
  content?: string;
  language?: string;
  children?: WorkspaceFile[];
}

export interface WorkspaceSettings {
  theme: "light" | "dark";
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  autoSave: boolean;
}

class WorkspaceService {
  private currentWorkspaceId: string | null = null;
  private settings: Map<string, WorkspaceSettings> = new Map();

  /**
   * Get workspace files from backend
   */
  async getWorkspaceFiles(workspaceId: string): Promise<WorkspaceFile[]> {
    try {
      console.log("📁 Fetching workspace files for:", workspaceId);

      // Call backend API
      const response = await fetch(
        `http://localhost:4000/api/workspace/${workspaceId}/files`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch workspace files");
      }

      const files = await response.json();
      console.log("✅ Loaded workspace files:", files);
      return files;
    } catch (error) {
      console.error("❌ Error fetching workspace files:", error);

      // Fallback to demo files
      return this.getDemoWorkspace();
    }
  }

  /**
   * Get file content from backend
   */
  async getFileContent(workspaceId: string, filePath: string): Promise<string> {
    try {
      const response = await fetch(
        `http://localhost:4000/api/workspace/${workspaceId}/file?path=${encodeURIComponent(filePath)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch file content");
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error("❌ Error fetching file content:", error);
      return "// File content could not be loaded";
    }
  }

  /**
   * Save file content to backend
   */
  async saveFileContent(
    workspaceId: string,
    filePath: string,
    content: string,
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `http://localhost:4000/api/workspace/${workspaceId}/file`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: filePath, content }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save file");
      }

      console.log("✅ File saved:", filePath);
      return true;
    } catch (error) {
      console.error("❌ Error saving file:", error);
      return false;
    }
  }

  /**
   * Switch to a different workspace
   */
  switchWorkspace(workspaceId: string) {
    console.log("🔄 Switching workspace to:", workspaceId);
    this.currentWorkspaceId = workspaceId;

    // Emit workspace change event
    window.dispatchEvent(
      new CustomEvent("workspace-changed", {
        detail: { workspaceId },
      }),
    );
  }

  /**
   * Get workspace settings
   */
  getWorkspaceSettings(workspaceId: string): WorkspaceSettings {
    if (!this.settings.has(workspaceId)) {
      // Load from localStorage
      const saved = localStorage.getItem(`workspace-settings-${workspaceId}`);
      if (saved) {
        this.settings.set(workspaceId, JSON.parse(saved));
      } else {
        // Default settings
        this.settings.set(workspaceId, {
          theme: "dark",
          fontSize: 14,
          tabSize: 2,
          wordWrap: true,
          minimap: true,
          autoSave: true,
        });
      }
    }

    return this.settings.get(workspaceId)!;
  }

  /**
   * Save workspace settings
   */
  saveWorkspaceSettings(
    workspaceId: string,
    settings: Partial<WorkspaceSettings>,
  ) {
    const current = this.getWorkspaceSettings(workspaceId);
    const updated = { ...current, ...settings };

    this.settings.set(workspaceId, updated);
    localStorage.setItem(
      `workspace-settings-${workspaceId}`,
      JSON.stringify(updated),
    );

    console.log("💾 Workspace settings saved:", workspaceId);

    // Emit settings change event
    window.dispatchEvent(
      new CustomEvent("workspace-settings-changed", {
        detail: { workspaceId, settings: updated },
      }),
    );
  }

  /**
   * Demo workspace structure (fallback)
   */
  private getDemoWorkspace(): WorkspaceFile[] {
    return [
      {
        id: "1",
        name: "src",
        path: "/src",
        type: "directory",
        children: [
          {
            id: "2",
            name: "App.tsx",
            path: "/src/App.tsx",
            type: "file",
            language: "typescript",
            content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Welcome to TrackCodex IDE!</h1>
        <p>Start coding in your workspace</p>
      </header>
    </div>
  );
}

export default App;`,
          },
          {
            id: "3",
            name: "index.tsx",
            path: "/src/index.tsx",
            type: "file",
            language: "typescript",
            content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
          },
          {
            id: "4",
            name: "components",
            path: "/src/components",
            type: "directory",
            children: [
              {
                id: "5",
                name: "Header.tsx",
                path: "/src/components/Header.tsx",
                type: "file",
                language: "typescript",
                content: `import React from 'react';

export const Header: React.FC = () => {
  return (
    <header>
      <h1>TrackCodex</h1>
    </header>
  );
};`,
              },
            ],
          },
        ],
      },
      {
        id: "6",
        name: "package.json",
        path: "/package.json",
        type: "file",
        language: "json",
        content: `{
  "name": "trackcodex-workspace",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`,
      },
      {
        id: "7",
        name: "README.md",
        path: "/README.md",
        type: "file",
        language: "markdown",
        content: `# TrackCodex Workspace

Welcome to your TrackCodex development workspace!

## Features
- Full Monaco editor
- File explorer
- Integrated terminal
- Git support
- Extensions

## Get Started
Start editing files in the explorer to begin coding.`,
      },
    ];
  }

  /**
   * Create new file in workspace
   */
  async createFile(
    workspaceId: string,
    dirPath: string,
    fileName: string,
  ): Promise<WorkspaceFile | null> {
    try {
      const response = await fetch(
        `http://localhost:4000/api/workspace/${workspaceId}/file/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dirPath, fileName }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create file");
      }

      const newFile = await response.json();
      console.log("✅ File created:", fileName);
      return newFile;
    } catch (error) {
      console.error("❌ Error creating file:", error);
      return null;
    }
  }

  /**
   * Delete file from workspace
   */
  async deleteFile(workspaceId: string, filePath: string): Promise<boolean> {
    try {
      const response = await fetch(
        `http://localhost:4000/api/workspace/${workspaceId}/file`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: filePath }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      console.log("🗑️  File deleted:", filePath);
      return true;
    } catch (error) {
      console.error("❌ Error deleting file:", error);
      return false;
    }
  }
}

// Singleton instance
export const workspaceService = new WorkspaceService();
