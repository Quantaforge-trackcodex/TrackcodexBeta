
export type DMEvent = 
  | { type: 'DM_OPEN'; data: { userId: string, name: string, avatar: string, context?: string } }
  | { type: 'DM_MESSAGE_SENT'; data: { conversationId: string, message: any } }
  | { type: 'DM_USER_TYPING'; data: { userId: string, conversationId: string } }
  | { type: 'DM_MESSAGE_READ'; data: { conversationId: string, userId: string } };

const DM_BUS_EVENT = 'trackcodex-dm-bus';

export const directMessageBus = {
  publish(event: DMEvent) {
    window.dispatchEvent(new CustomEvent(DM_BUS_EVENT, { detail: event }));
  },

  subscribe(callback: (event: DMEvent) => void) {
    const handler = (e: any) => callback(e.detail);
    window.addEventListener(DM_BUS_EVENT, handler);
    return () => window.removeEventListener(DM_BUS_EVENT, handler);
  },

  openChat(user: { id: string, name: string, avatar: string, context?: string }) {
    this.publish({ type: 'DM_OPEN', data: user });
  }
};
