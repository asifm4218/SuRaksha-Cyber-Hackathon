
"use client";

// A client-side service to simulate session management in Firestore.
// This runs entirely in the browser and keeps state in memory.

interface UserSession {
    session_status: 'active' | 'expired';
    reason?: string;
}

type SessionListener = (status: 'active' | 'expired', reason?: string) => void;

class SessionManager {
    private sessions: Map<string, UserSession> = new Map();
    private listeners: Map<string, SessionListener[]> = new Map();

    public createSession(userId: string): void {
        console.log(`Creating new session for ${userId}`);
        this.sessions.set(userId, {
            session_status: 'active',
        });
        this.notifyListeners(userId, 'active');
    }

    public getSession(userId: string): UserSession | undefined {
        return this.sessions.get(userId);
    }

    public expireSession(userId: string, reason?: string): void {
        const session = this.sessions.get(userId);
        if (session && session.session_status === 'active') {
            console.log(`Session for ${userId} expired due to anomaly. Reason: ${reason}`);
            session.session_status = 'expired';
            session.reason = reason;
            this.sessions.set(userId, session);
            this.notifyListeners(userId, 'expired', reason);
        }
    }

    public subscribe(userId: string, listener: SessionListener): void {
        const userListeners = this.listeners.get(userId) || [];
        if (!userListeners.includes(listener)) {
            userListeners.push(listener);
            this.listeners.set(userId, userListeners);
        }
    }
    
    public unsubscribe(userId: string, listener: SessionListener): void {
        const userListeners = this.listeners.get(userId) || [];
        this.listeners.set(userId, userListeners.filter(l => l !== listener));
    }

    private notifyListeners(userId: string, status: 'active' | 'expired', reason?: string): void {
        const userListeners = this.listeners.get(userId) || [];
        userListeners.forEach(l => l(status, reason));
    }
}

// Export a singleton instance of the session manager
export const sessionManager = new SessionManager();

    