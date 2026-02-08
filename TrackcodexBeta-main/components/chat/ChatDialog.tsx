import React, { useState, useEffect, useRef } from "react";
import { api } from "../../context/AuthContext";
import "./ChatDialog.css";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    avatar?: string;
  };
}

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  targetUserName: string;
  currentUserId: string;
}

export const ChatDialog: React.FC<ChatDialogProps> = ({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
  currentUserId,
}) => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && targetUserId) {
      initializeChat();
    }
  }, [isOpen, targetUserId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const initializeChat = async () => {
    setLoading(true);
    try {
      // Create or get existing conversation
      const res = await api.post("/messages/conversations", {
        targetUserId,
      });
      setConversationId(res.data.id);

      // Load messages
      const msgRes = await api.get(
        `/messages/conversations/${res.data.id}/messages`,
      );
      setMessages(msgRes.data);
    } catch (err) {
      console.error("Failed to init chat", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !conversationId) return;

    setSending(true);
    try {
      const res = await api.post(
        `/messages/conversations/${conversationId}/messages`,
        {
          content: newMessage,
        },
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-dialog-overlay">
      <div className="chat-dialog">
        <div className="chat-header">
          <h3>Chat with {targetUserName}</h3>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="chat-body">
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <div className="messages-list">
              {messages.length === 0 && (
                <p className="no-messages">No messages yet. Say hi!</p>
              )}
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`message-item ${isMe ? "message-me" : "message-them"}`}
                  >
                    <div className="message-content">{msg.content}</div>
                    <div className="message-time">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="chat-footer">
          <form onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
            />
            <button type="submit" disabled={sending || !newMessage.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
