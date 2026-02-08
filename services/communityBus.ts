
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

  // Persistent simulation of remote activity for the "Real-Time" feel
  simulateActivity() {
    const users = ['sarah_backend', 'david_kim', 'm_thorne', 'alex_dev', 'marcus_j'];
    const postIds = ['p1', 'p2'];

    const triggerNext = () => {
      const delay = Math.random() * 8000 + 4000; // Every 4-12 seconds
      
      setTimeout(() => {
        const type = Math.random();
        const user = users[Math.floor(Math.random() * users.length)];
        const postId = postIds[Math.floor(Math.random() * postIds.length)];

        if (type < 0.6) {
          // 60% chance for typing
          this.publish({ type: 'TYPING', data: { userId: user, postId } });
        } else if (type < 0.9) {
          // 30% chance for an upvote
          this.publish({ 
            type: 'REACTION_ADDED', 
            data: { postId, emoji: 'up', userId: user } 
          });
        } else {
          // 10% chance for a comment
          const comments = [
            "Great point, I've seen similar patterns in our infra.",
            "Have you considered using a Redis cache for this?",
            "The performance trade-offs here are interesting.",
            "Checking the docs on this right now, looks correct.",
            "Wait, I thought the v3 update fixed this bottleneck?"
          ];
          this.publish({
            type: 'COMMUNITY_COMMENT_ADDED',
            data: {
              postId,
              comment: {
                id: `sim-${Date.now()}`,
                author: { name: user.split('_').join(' '), username: user, avatar: `https://picsum.photos/seed/${user}/64`, karma: 85 },
                text: comments[Math.floor(Math.random() * comments.length)],
                timestamp: 'Just now',
                upvotes: 0,
                replies: [],
                isNew: true // Flag for visual highlighting
              }
            }
          });
        }
        triggerNext();
      }, delay);
    };

    triggerNext();
  }
};
