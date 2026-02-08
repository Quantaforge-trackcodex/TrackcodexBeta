import { Socket } from "socket.io";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Docker = require("dockerode");
import process from "process";
import fs from "fs";
import path from "path";

const docker = new Docker(
  process.platform === "win32"
    ? { socketPath: "//./pipe/docker_engine" }
    : undefined,
);

const LOG_FILE = path.join(process.cwd(), "terminal-error.log");

interface TerminalSession {
  stream: any;
  sockets: Set<string>; // Set of socket IDs
}

export class TerminalService {
  private static sessions = new Map<string, TerminalSession>();

  static async handleConnection(socket: Socket, workspaceId: string) {
    console.log(
      `🔌 Terminal session joining for workspace: ${workspaceId} via Socket.io - Socket: ${socket.id}`,
    );

    // If session doesn't exist, create it
    if (!this.sessions.has(workspaceId)) {
      try {
        const session = await this.createTerminalSession(workspaceId);
        this.sessions.set(workspaceId, session);
      } catch (error: any) {
        socket.emit(
          "TERMINAL_OUTPUT",
          `\r\n\x1b[31m[System Error] ${error.message}\x1b[0m\r\n`,
        );
        return;
      }
    }

    const session = this.sessions.get(workspaceId)!;
    session.sockets.add(socket.id);

    // Handle incoming terminal input from THIS socket
    socket.on("TERMINAL_INPUT", (data: string) => {
      if (session.stream && session.stream.writable) {
        session.stream.write(data);
      }
    });

    socket.on("disconnect", () => {
      this.handleDisconnect(socket.id, workspaceId);
    });

    socket.emit(
      "TERMINAL_OUTPUT",
      "\r\n\x1b[32m[System] Attached to Shared Hardware PTY\x1b[0m\r\n$ ",
    );
  }

  private static async createTerminalSession(
    workspaceId: string,
  ): Promise<TerminalSession> {
    const containerName = `trackcodex-${workspaceId}`;
    const container = docker.getContainer(containerName);

    // Verify container
    await container.inspect();

    const exec = await container.exec({
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      Cmd: ["sh"],
    });

    const stream = await exec.start({
      hijack: true,
      stdin: true,
    });

    if (!stream) {
      throw new Error("Failed to initialize Docker stream");
    }

    const session: TerminalSession = {
      stream,
      sockets: new Set(),
    };

    // Broadcast Docker data to ALL sockets in this session
    stream.on("data", (chunk: Buffer) => {
      const data = chunk.toString("utf-8");
      session.sockets.forEach((socketId) => {
        // We use global io via RealtimeService or emit directly if we had a reference
        // But we don't have io here directly, so we need to emit to specifically joined sockets
        // Actually, Socket.io allows emitting by socket ID via io.to(id)
        // For simplicity, we'll assume the sockets are still valid or check connection
        // Better: provide a broadcast mechanism
      });
      // Emit to a room named after the workspace terminal
      const { RealtimeService } = require("./realtime");
      RealtimeService.broadcastToRoom(`terminal-${workspaceId}`, {
        type: "TERMINAL_OUTPUT",
        data,
      });
    });

    stream.on("end", () => {
      const { RealtimeService } = require("./realtime");
      RealtimeService.broadcastToRoom(`terminal-${workspaceId}`, {
        type: "TERMINAL_OUTPUT",
        data: "\r\n[System] PTY Session Ended.\r\n",
      });
      this.sessions.delete(workspaceId);
    });

    return session;
  }

  private static handleDisconnect(socketId: string, workspaceId: string) {
    const session = this.sessions.get(workspaceId);
    if (!session) return;

    session.sockets.delete(socketId);

    if (session.sockets.size === 0) {
      console.log(
        `🧹 No active sockets for workspace ${workspaceId}. Ending PTY session.`,
      );
      if (session.stream) session.stream.end();
      this.sessions.delete(workspaceId);
    }
  }
}
