
// A client-side service to track user behavior for security analysis.
// This runs entirely in the browser.

export interface BehaviorMetrics {
    typingSpeedWPM: number;
    backspaceCount: number;
    avgKeyHoldDuration: number;
    keyHoldDurations: { key: string; duration: number }[];
    mouseMovements: { x: number; y: number; timestamp: number }[];
}

export class BehaviorTracker {
    private userId: string;
    private isTracking: boolean = false;
    private keyPressTimestamps: Map<string, number> = new Map();
    
    // Internal state for metrics
    private metrics: BehaviorMetrics = {
        typingSpeedWPM: 0,
        backspaceCount: 0,
        avgKeyHoldDuration: 0,
        keyHoldDurations: [],
        mouseMovements: [],
    };
    
    // Internal data for calculations
    private startTime: number | null = null;
    private totalWords: number = 0;
    private currentText: string = "";

    constructor(userId: string) {
        this.userId = userId;
        console.log(`BehaviorTracker initialized for user: ${this.userId}`);
    }

    private reset() {
        this.metrics = {
            typingSpeedWPM: 0,
            backspaceCount: 0,
            avgKeyHoldDuration: 0,
            keyHoldDurations: [],
            mouseMovements: [],
        };
        this.keyPressTimestamps.clear();
        this.startTime = Date.now();
        this.totalWords = 0;
        this.currentText = "";
    }

    public start() {
        if (this.isTracking) return;
        this.isTracking = true;
        this.reset();
        
        window.addEventListener('keydown', this.handleKeyDown, true);
        window.addEventListener('keyup', this.handleKeyUp, true);
        window.addEventListener('mousemove', this.handleMouseMove, true);
        
        console.log("Behavior tracking started.");
    }

    public stop() {
        if (!this.isTracking) return;
        this.isTracking = false;
        
        window.removeEventListener('keydown', this.handleKeyDown, true);
        window.removeEventListener('keyup', this.handleKeyUp, true);
        window.removeEventListener('mousemove', this.handleMouseMove, true);
        
        console.log("Behavior tracking stopped.");
        this.calculateFinalMetrics();
    }

    private handleKeyDown = (e: KeyboardEvent) => {
        if (!this.isTracking) return;

        if (this.startTime === null) {
            this.startTime = Date.now();
        }

        if (!this.keyPressTimestamps.has(e.key)) {
            this.keyPressTimestamps.set(e.key, Date.now());
        }

        if (e.key === 'Backspace') {
            this.metrics.backspaceCount++;
            if (this.currentText.length > 0) {
               this.currentText = this.currentText.slice(0, -1);
            }
        }
    };

    private handleKeyUp = (e: KeyboardEvent) => {
        if (!this.isTracking) return;

        const pressTime = this.keyPressTimestamps.get(e.key);
        if (pressTime) {
            const releaseTime = Date.now();
            const holdDuration = releaseTime - pressTime;
            this.metrics.keyHoldDurations.push({ key: e.key, duration: holdDuration });
            this.keyPressTimestamps.delete(e.key);
        }

        // Add character to our tracked text
        if (e.key.length === 1 && e.key.match(/[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
            this.currentText += e.key;
        } else if (e.key === ' ') {
            this.currentText += ' ';
        }
        
        this.calculateLiveMetrics();
    };

    private handleMouseMove = throttle((e: MouseEvent) => {
        if (!this.isTracking) return;
        this.metrics.mouseMovements.push({ x: e.clientX, y: e.clientY, timestamp: Date.now() });
        // Keep only the last 200 movements for performance
        if (this.metrics.mouseMovements.length > 200) {
            this.metrics.mouseMovements.shift();
        }
    }, 100); 

    private calculateLiveMetrics() {
        if (!this.startTime) return;

        // Calculate WPM
        const durationMinutes = (Date.now() - this.startTime) / (1000 * 60);
        this.totalWords = this.currentText.trim().split(/\s+/).filter(Boolean).length;
        this.metrics.typingSpeedWPM = durationMinutes > 0 ? this.totalWords / durationMinutes : 0;
        
        // Calculate average key hold duration
        if (this.metrics.keyHoldDurations.length > 0) {
            const totalHoldTime = this.metrics.keyHoldDurations.reduce((acc, curr) => acc + curr.duration, 0);
            this.metrics.avgKeyHoldDuration = totalHoldTime / this.metrics.keyHoldDurations.length;
        }
    }
    
    private calculateFinalMetrics() {
        this.calculateLiveMetrics(); // Ensure all metrics are up-to-date
    }

    public getMetrics(): BehaviorMetrics {
        // Return a copy of the current metrics
        return { ...this.metrics };
    }
}


function throttle(func: (...args: any[]) => void, limit: number) {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}
