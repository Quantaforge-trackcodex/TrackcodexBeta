
import { useState, useEffect, useCallback } from 'react';
import { directMessageBus, DMEvent } from '../services/directMessageBus';
import { profileService } from '../services/profile';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'seen';
}

export interface Conversation {
  id: string;
  participants: { id: string; name: string; avatar: string }[];
  lastMessage?: string;
  lastTimestamp?: string;
  unreadCount: number;
  messages: Message[];
}

export const useDirectMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      participants: [{ id: 'sarah_backend', name: 'Sarah Chen', avatar: 'https://picsum.photos/seed/sarah/64' }],
      lastMessage: 'Let me know when the PR is ready.',
      lastTimestamp: '10:45 AM',
      unreadCount: 0,
      messages: [
        { id: 'm1', senderId: 'sarah_backend', text: 'Hey Alex, how is the auth refactor going?', timestamp: '10:30 AM', status: 'seen' },
        { id: 'm2', senderId: 'current', text: 'Almost done. Just fixing the test cases.', timestamp: '10:42 AM', status: 'seen' },
        { id: 'm3', senderId: 'sarah_backend', text: 'Great! Let me know when the PR is ready.', timestamp: '10:45 AM', status: 'seen' },
      ]
    }
  ]);

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const currentUser = profileService.getProfile();

  const sendMessage = useCallback((text: string) => {
    if (!activeConvId || !text.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'current',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: text,
          lastTimestamp: newMessage.timestamp
        };
      }
      return c;
    }));

    // Simulate real-time reply from Sarah for demo purposes
    if (activeConvId === 'conv-1') {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const reply: Message = {
            id: `msg-${Date.now() + 1}`,
            senderId: 'sarah_backend',
            text: "Understood. I'll review it ASAP.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'delivered'
          };
          setConversations(convs => convs.map(c => c.id === 'conv-1' ? { ...c, messages: [...c.messages, reply], lastMessage: reply.text } : c));
        }, 2000);
      }, 1000);
    }
  }, [activeConvId]);

  useEffect(() => {
    return directMessageBus.subscribe((event: DMEvent) => {
      if (event.type === 'DM_OPEN') {
        setIsPanelOpen(true);
        // Find if conversation exists
        const existing = conversations.find(c => c.participants.some(p => p.id === event.data.userId));
        if (existing) {
          setActiveConvId(existing.id);
        } else {
          const newId = `conv-${Date.now()}`;
          const newConv: Conversation = {
            id: newId,
            participants: [{ id: event.data.userId, name: event.data.name, avatar: event.data.avatar }],
            unreadCount: 0,
            messages: event.data.context ? [{ id: 'ctx', senderId: 'system', text: `Discussing: ${event.data.context}`, timestamp: 'Now', status: 'seen' }] : []
          };
          setConversations(prev => [newConv, ...prev]);
          setActiveConvId(newId);
        }
      }
    });
  }, [conversations]);

  return {
    conversations,
    activeConversation: conversations.find(c => c.id === activeConvId),
    isPanelOpen,
    setIsPanelOpen,
    setActiveConvId,
    sendMessage,
    isTyping
  };
};
