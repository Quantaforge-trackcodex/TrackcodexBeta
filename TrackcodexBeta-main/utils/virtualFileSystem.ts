export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

export class VirtualFileSystem {
  private static instance: VirtualFileSystem;
  private files: FileNode[] = [];
  private workspaceId: string | null = null;

  private constructor() {}

  static getInstance(): VirtualFileSystem {
    if (!VirtualFileSystem.instance) {
      VirtualFileSystem.instance = new VirtualFileSystem();
    }
    return VirtualFileSystem.instance;
  }

  async loadWorkspace(workspaceId: string): Promise<FileNode[]> {
    this.workspaceId = workspaceId;
    try {
      const response = await fetch(`/api/v1/files?workspaceId=${workspaceId}`);
      if (!response.ok) throw new Error("Failed to load workspace files");
      const data = await response.json();
      this.files = data;
      return this.files;
    } catch (err) {
      console.error(
        "❌ VFS Load Error:",
        err instanceof Error ? err.message : err,
      );
      return [];
    }
  }

  getFiles(): FileNode[] {
    return this.files;
  }

  // Find a node by ID recursively
  findNode(id: string, nodes: FileNode[] = this.files): FileNode | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = this.findNode(id, node.children);
        if (found) return found;
      }
    }
    return null;
  }

  async getFileContent(id: string): Promise<string> {
    const node = this.findNode(id);
    if (node && node.content !== undefined) return node.content;

    try {
      const response = await fetch(
        `/api/v1/files/${encodeURIComponent(id)}?workspaceId=${this.workspaceId}`,
      );
      if (!response.ok) return "";
      const { content } = await response.json();
      if (node) node.content = content;
      return content;
    } catch (err) {
      console.error(
        "❌ VFS Content Error:",
        err instanceof Error ? err.message : err,
      );
      return "";
    }
  }

  async updateFileContent(id: string, content: string) {
    const node = this.findNode(id);
    if (!node || node.type !== "file") return;

    node.content = content;

    try {
      await fetch(
        `/api/v1/files/${encodeURIComponent(id)}?workspaceId=${this.workspaceId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        },
      );
    } catch (err) {
      console.error(
        "❌ VFS Save Error:",
        err instanceof Error ? err.message : err,
      );
    }
  }
}
