
export type CommunityEvent = 
  | { type: 'POST_CREATED'; data: any }
  | { type: 'REACTION_ADDED'; data: { postId: string, emoji: string, userId: string } }
  | { type: 'TYPING'; data: { userId: string, postId: string } }
  | { type: 'COMMUNITY_COMMENT_ADDED'; data: { postId: string, comment: any, parentCommentId?: string } };

const BUS_EVENT = 'trackcodex-community-bus';

export const communityBus = {
  publish(event: CommunityEvent) {
    window.dispatchEvent(new CustomEvent(BUS_EVENT, { detail: event }));
  },

  subscribe(callback: (event: CommunityEvent) => void) {
    const handler = (e: any) => callback(e.detail);
    window.addEventListener(BUS_EVENT, handler);
    return () => window.removeEventListener(BUS_EVENT, handler);
  },

  // Simulate remote activity for the "Real-Time" feel
  simulateActivity() {
    const randomUser = ['sarah_backend', 'david_kim', 'm_thorne'][Math.floor(Math.random() * 3)];
    setTimeout(() => {
      this.publish({ 
        type: 'TYPING', 
        data: { userId: randomUser, postId: 'p1' } 
      });
    }, 2000);
  }
};
