
// A client-side service to simulate session management in Firestore.
// This runs entirely in the browser and keeps state in memory.

interface UserSession {
    session_status: 'active' | 'expired';
    baseline: {
        avg_hold: number;
        wpm: number;
        backspaces: number;
    };
}

type SessionListener = (status: 'active' | 'expired') => void;

class SessionManager {
    private sessions: Map<string, UserSession> = new Map();
    private listeners: Map<string, SessionListener[]> = new Map();

    // Default baseline for new users or users with no history.
    private readonly defaultBaseline = {
        avg_hold: 85, // milliseconds
        wpm: 65,      // words per minute
        backspaces: 5 // a nominal starting value
    };

    public createSession(userId: string): void {
        console.log(`Creating new session for ${userId}`);
        this.sessions.set(userId, {
            session_status: 'active',
            // In a real app, you'd fetch this baseline from the user's history in Firestore.
            // For this simulation, we use a default baseline.
            baseline: { ...this.defaultBaseline }
        });
        this.notifyListeners(userId, 'active');
    }

    public getSession(userId: string): UserSession | undefined {
        return this.sessions.get(userId);
    }

    public expireSession(userId: string): void {
        const session = this.sessions.get(userId);
        if (session && session.session_status === 'active') {
            console.log(`Session for ${userId} expired due to anomaly.`);
            session.session_status = 'expired';
            this.sessions.set(userId, session);
            this.notifyListeners(userId, 'expired');
        }
    }

    public subscribe(userId: string, listener: SessionListener): void {
        const userListeners = this.listeners.get(userId) || [];
        userListeners.push(listener);
        this.listeners.set(userId, userListeners);
    }
    
    public unsubscribe(userId: string, listener: SessionListener): void {
        const userListeners = this.listeners.get(userId) || [];
        this.listeners.set(userId, userListeners.filter(l => l !== listener));
    }

    private notifyListeners(userId: string, status: 'active' | 'expired'): void {
        const userListeners = this.listeners.get(userId) || [];
        userListeners.forEach(l => l(status));
    }
}

// Export a singleton instance of the session manager
export const sessionManager = new SessionManager();
