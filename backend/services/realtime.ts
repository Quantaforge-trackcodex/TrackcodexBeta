import { Server, Socket } from "socket.io";
import { TerminalService } from "./terminal";

interface Presence {
  userId: string;
  socketId: string;
  lastSeen: number;
}

interface WorkspaceRoom {
  participants: Map<string, Presence>; // userId -> Presence
}

export class RealtimeService {
  private static io: Server;

  // workspaceId -> WorkspaceRoom
  private static rooms = new Map<string, WorkspaceRoom>();

  // Global user connection map (userId -> Set of socket IDs)
  private static userSockets = new Map<string, Set<string>>();

  static init(io: Server) {
    this.io = io;
    console.log("🚀 RealtimeService initialized with Socket.io");

    this.io.on("connection", (socket: Socket) => {
      const { userId, workspaceId } = socket.handshake.query as {
        userId: string;
        workspaceId?: string;
      };

      if (!userId) {
        console.warn("⚠️ Socket connection rejected: No userId provided");
        socket.disconnect();
        return;
      }

      // Register user socket
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(socket.id);

      // Store userId on socket for easy cleanup
      (socket as any).userId = userId;

      console.log(`🔌 User ${userId} connected via Socket.io (${socket.id})`);

      // Automatically join initial workspace room if provided
      if (workspaceId) {
        this.joinWorkspace(socket, workspaceId, userId);
      }

      // Handle custom events
      socket.on("WORKSPACE_JOIN", (payload: { workspaceId: string }) => {
        if (payload.workspaceId) {
          this.joinWorkspace(socket, payload.workspaceId, userId);
        }
      });

      socket.on("WORKSPACE_LEAVE", (payload: { workspaceId: string }) => {
        if (payload.workspaceId) {
          this.leaveWorkspace(socket, payload.workspaceId, userId);
        }
      });

      socket.on("TERMINAL_JOIN", (payload: { workspaceId: string }) => {
        if (payload.workspaceId) {
          const terminalRoom = `terminal-${payload.workspaceId}`;
          socket.join(terminalRoom);
          TerminalService.handleConnection(socket, payload.workspaceId);
        }
      });

      socket.on("BUFFER_SYNC", (payload: any) => {
        if (workspaceId) {
          socket.to(workspaceId).emit("BUFFER_SYNC", { ...payload, userId });
        }
      });

      socket.on("CURSOR_MOVE", (payload: any) => {
        if (workspaceId) {
          socket.to(workspaceId).emit("CURSOR_MOVE", { ...payload, userId });
        }
      });

      socket.on("disconnect", () => {
        this.cleanup(userId, socket);
        console.log(`🔌 User ${userId} disconnected from Socket.io`);
      });
    });
  }

  private static joinWorkspace(
    socket: Socket,
    workspaceId: string,
    userId: string,
  ) {
    socket.join(workspaceId);

    if (!this.rooms.has(workspaceId)) {
      this.rooms.set(workspaceId, { participants: new Map() });
    }

    const room = this.rooms.get(workspaceId)!;
    room.participants.set(userId, {
      userId,
      socketId: socket.id,
      lastSeen: Date.now(),
    });

    // Notify room of updated presence
    this.io.to(workspaceId).emit("PRESENCE_UPDATE", {
      workspaceId,
      users: Array.from(room.participants.keys()),
    });

    console.log(`🏠 User ${userId} joined room: ${workspaceId}`);
  }

  private static leaveWorkspace(
    socket: Socket,
    workspaceId: string,
    userId: string,
  ) {
    socket.leave(workspaceId);

    const room = this.rooms.get(workspaceId);
    if (room) {
      room.participants.delete(userId);
      if (room.participants.size === 0) {
        this.rooms.delete(workspaceId);
      } else {
        this.io.to(workspaceId).emit("PRESENCE_UPDATE", {
          workspaceId,
          users: Array.from(room.participants.keys()),
        });
      }
    }
    console.log(`🚪 User ${userId} left room: ${workspaceId}`);
  }

  private static cleanup(userId: string, socket: Socket) {
    // Remove from global map
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) this.userSockets.delete(userId);
    }

    // Clean up all rooms user was in
    this.rooms.forEach((room, workspaceId) => {
      if (
        room.participants.has(userId) &&
        room.participants.get(userId)!.socketId === socket.id
      ) {
        this.leaveWorkspace(socket, workspaceId, userId);
      }
    });
  }

  // --- Public Broadcasting Methods ---

  /**
   * Broadcasts an event to all participants in a specific room (workspace or repo)
   */
  static broadcastToRoom(room: string, event: any) {
    if (!this.io) return;
    // Note: Socket.io handles event type as the first argument in emit,
    // but we can preserve our existing structure by emitting a generic 'event'
    // or better, use the event.type as the event name.
    // For compatibility with previous frontend, we'll emit 'message' or similar.
    // Actually, it's cleaner to emit the event.type as the name.
    this.io.to(room).emit(event.type, event);
  }

  /**
   * Sends an event to a specific user across all their connections
   */
  static sendToUser(userId: string, event: any) {
    if (!this.io) return;
    const socketIds = this.userSockets.get(userId);
    if (!socketIds) return;

    socketIds.forEach((id) => {
      this.io.to(id).emit(event.type, event);
    });
  }
}
