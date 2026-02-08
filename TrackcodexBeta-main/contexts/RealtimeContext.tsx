import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  realtimeService,
  RealtimeEvent,
  Listener,
} from "../services/realtime-service";

interface RealtimeContextType {
  isConnected: boolean;
  presence: string[]; // List of userIds online in current workspace
  cursors: Record<
    string,
    { fileId: string; lineNumber: number; column: number }
  >;
  send: (event: RealtimeEvent) => void;
  subscribe: (listener: Listener) => () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(
  undefined,
);

export const RealtimeProvider: React.FC<{
  children: React.ReactNode;
  userId: string;
  workspaceId?: string;
}> = ({ children, userId, workspaceId }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [presence, setPresence] = useState<string[]>([]);
  const [cursors, setCursors] = useState<
    Record<string, { fileId: string; lineNumber: number; column: number }>
  >({});

  useEffect(() => {
    if (!userId) return;

    realtimeService.connect(userId, workspaceId);

    const unsubscribe = realtimeService.subscribe((event) => {
      switch (event.type) {
        case "CONNECTION_OPEN":
          setIsConnected(true);
          break;
        case "CONNECTION_CLOSED":
          setIsConnected(false);
          break;
        case "PRESENCE_UPDATE":
          if (event.users) {
            setPresence(event.users);
            // Clean up cursors for users who left
            setCursors((prev) => {
              const next = { ...prev };
              Object.keys(next).forEach((uid) => {
                if (!event.users.includes(uid)) delete next[uid];
              });
              return next;
            });
          }
          break;
        case "CURSOR_MOVE":
          if (event.userId && event.userId !== userId) {
            setCursors((prev) => ({
              ...prev,
              [event.userId]: {
                fileId: event.fileId,
                lineNumber: event.lineNumber,
                column: event.column,
              },
            }));
          }
          break;
        default:
          break;
      }
    });

    return () => {
      unsubscribe();
      realtimeService.disconnect();
    };
  }, [userId, workspaceId]);

  const send = useCallback((event: RealtimeEvent) => {
    realtimeService.send(event);
  }, []);

  const subscribe = useCallback((listener: Listener) => {
    return realtimeService.subscribe(listener);
  }, []);

  return (
    <RealtimeContext.Provider
      value={{ isConnected, presence, cursors, send, subscribe }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }
  return context;
};
