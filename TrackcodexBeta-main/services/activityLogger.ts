// services/activityLogger.ts
export const logActivity = async (action: string, metadata: any = {}) => {
    try {
        // In a real app, we'd get the user ID from context/auth
        // For prototype, we'll fetch the first user or use a fixed one
        // But since we are on the frontend, let's assume we have a way or just send a dummy 'current-user' 
        // and let backend handle the "current session" logic if we had auth.
        // For Parity, we need to pass the username or ID.
        // Let's hardcode 'testuser' if no auth context is available yet.

        await fetch('http://localhost:4000/api/v1/profile/activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'johndoe', // Default for demo
                action, // 'save', 'commit', 'run'
                metadata
            })
        });
        console.log(`[Analytics] Logged action: ${action}`);
    } catch (err) {
        console.error("Failed to log activity", err);
    }
};
