
type EventCallback = (data: any) => void;

class CollaborationService {
  private socket: WebSocket | null = null;
  private listeners: Map<string, EventCallback[]> = new Map();

  connect(workspaceId: string) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.socket = new WebSocket(`${protocol}//${window.location.host}/ws/workspace/${workspaceId}`);

    this.socket.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      this.listeners.get(type)?.forEach(cb => cb(data));
    };

    this.socket.onclose = () => {
      console.warn('Workspace socket disconnected. Reconnecting...');
      setTimeout(() => this.connect(workspaceId), 3000);
    };
  }

  send(type: string, data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, data }));
    }
  }

  subscribe(type: string, callback: EventCallback) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type)?.push(callback);
    return () => {
      const filtered = this.listeners.get(type)?.filter(cb => cb !== callback) || [];
      this.listeners.set(type, filtered);
    };
  }

  updateCursor(line: number, column: number) {
    this.send('CURSOR_MOVE', { line, column });
  }

  broadcastChange(delta: any) {
    this.send('FILE_CHANGE', delta);
  }
}

export const colab = new CollaborationService();
