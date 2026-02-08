import { io, Socket } from "socket.io-client";

export type RealtimeEvent = {
  type: string;
  payload?: any;
  [key: string]: any;
};

export type Listener = (event: RealtimeEvent) => void;

class RealtimeService {
  private socket: Socket | null = null;
  private listeners: Set<Listener> = new Set();
  private userId: string | null = null;
  private workspaceId: string | null = null;

  connect(userId: string, workspaceId?: string) {
    if (this.socket?.connected && this.userId === userId) return;

    this.userId = userId;
    this.workspaceId = workspaceId || null;

    const host =
      window.location.hostname === "localhost"
        ? "http://localhost:4000"
        : `https://${window.location.host}`;

    console.log(`🔌 Connecting to Realtime via Socket.io: ${host}`);

    this.socket = io(host, {
      query: { userId, workspaceId },
      transports: ["polling", "websocket"], // Allow polling fallback if websocket fails
      withCredentials: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 3000,
      timeout: 10000,
    });

    this.socket.on("connect", () => {
      console.log("✅ Realtime connection established via Socket.io");
      this.notify({ type: "CONNECTION_OPEN" });
    });

    this.socket.on("disconnect", (reason) => {
      console.warn("⚠️ Realtime connection closed:", reason);
      this.notify({ type: "CONNECTION_CLOSED", reason });
    });

    this.socket.on("connect_error", (err) => {
      // Silently handle connection errors to prevent console spam
      console.warn("⚠️ Realtime connection error (will retry):", err.message);
    });

    // Handle generic events from backend
    // Since our backend emits events by their 'type', we need to capture those.
    // However, Socket.io usually expects specific listeners.
    // For our specific use cases, we'll listen for known types and forward them.

    const forwardEvent = (type: string) => {
      this.socket?.on(type, (data) => {
        this.notify({ ...data, type });
      });
    };

    forwardEvent("PRESENCE_UPDATE");
    forwardEvent("REPOSITORY_UPDATE");
    forwardEvent("WORKSPACE_UPDATE");
    forwardEvent("ACTIVITY_EVENT");
    forwardEvent("CURSOR_MOVE");
    forwardEvent("BUFFER_SYNC");
    forwardEvent("TERMINAL_OUTPUT");
  }

  send(event: RealtimeEvent) {
    if (this.socket?.connected) {
      // Use the event.type as the Socket.io event name
      const { type, ...payload } = event;
      this.socket.emit(type, payload);
    } else {
      console.warn("⚠️ Cannot send: Realtime socket not connected");
    }
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(event: RealtimeEvent) {
    this.listeners.forEach((l) => l(event));
  }

  disconnect() {
    this.userId = null;
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const realtimeService = new RealtimeService();
