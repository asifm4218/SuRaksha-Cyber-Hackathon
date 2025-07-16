// A client-side service to track user behavior for security analysis.
// This is not a server action. It runs entirely in the browser.

interface TypingData {
    startTime: number | null;
    endTime: number | null;
    keyPresses: { key: string; timestamp: number }[];
    keyReleases: { key: string; timestamp: number; holdDuration: number }[];
    backspaceCount: number;
    wordCount: number;
    text: string;
}

interface MouseData {
    movements: { x: number; y: number; timestamp: number }[];
    clicks: { x: number; y: number; timestamp: number }[];
}

export class BehaviorTracker {
    private typingData: TypingData;
    private mouseData: MouseData;
    private keyPressTimestamps: Map<string, number> = new Map();
    private onReport: (data: any) => void;
    private isTracking: boolean = false;

    constructor(onReport: (data: any) => void) {
        this.onReport = onReport;
        this.reset();
    }

    private reset() {
        this.typingData = {
            startTime: null,
            endTime: null,
            keyPresses: [],
            keyReleases: [],
            backspaceCount: 0,
            wordCount: 0,
            text: "",
        };
        this.mouseData = {
            movements: [],
            clicks: [],
        };
        this.keyPressTimestamps.clear();
    }

    public start() {
        if (this.isTracking) return;
        this.isTracking = true;
        this.reset();
        
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('click', this.handleMouseClick);
        
        this.typingData.startTime = Date.now();
    }

    public stop() {
        if (!this.isTracking) return;
        this.isTracking = false;
        
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('click', this.handleMouseClick);

        this.typingData.endTime = Date.now();
        this.generateReport();
    }

    private handleKeyDown = (e: KeyboardEvent) => {
        if (this.typingData.startTime === null) {
            this.typingData.startTime = Date.now();
        }

        if (e.key === 'Escape') {
            e.preventDefault();
            this.stop();
            return;
        }

        if (!this.keyPressTimestamps.has(e.key)) {
            const timestamp = Date.now();
            this.keyPressTimestamps.set(e.key, timestamp);
            this.typingData.keyPresses.push({ key: e.key, timestamp });
        }

        if (e.key === 'Backspace') {
            this.typingData.backspaceCount++;
            if (this.typingData.text.length > 0) {
               this.typingData.text = this.typingData.text.slice(0, -1);
            }
        }
    };

    private handleKeyUp = (e: KeyboardEvent) => {
        const pressTime = this.keyPressTimestamps.get(e.key);
        if (pressTime) {
            const releaseTime = Date.now();
            const holdDuration = releaseTime - pressTime;
            this.typingData.keyReleases.push({ key: e.key, timestamp: releaseTime, holdDuration });
            this.keyPressTimestamps.delete(e.key);

            if (e.key.length === 1) { // Regular character
                this.typingData.text += e.key;
            } else if (e.key === ' ') {
                this.typingData.text += ' ';
            }

            if (/\s/.test(e.key)) { // Space, Enter, Tab
                this.typingData.wordCount = this.typingData.text.trim().split(/\s+/).filter(Boolean).length;
            }
        }
    };

    // Throttle mouse move to avoid performance issues
    private handleMouseMove = throttle((e: MouseEvent) => {
        this.mouseData.movements.push({ x: e.clientX, y: e.clientY, timestamp: Date.now() });
    }, 50); 

    private handleMouseClick = (e: MouseEvent) => {
        this.mouseData.clicks.push({ x: e.clientX, y: e.clientY, timestamp: Date.now() });
    };

    private generateReport() {
        const durationSeconds = this.typingData.endTime && this.typingData.startTime 
            ? (this.typingData.endTime - this.typingData.startTime) / 1000 
            : 0;
            
        const durationMinutes = durationSeconds / 60;
        
        const wpm = durationMinutes > 0 ? this.typingData.wordCount / durationMinutes : 0;

        const report = {
            sessionDuration: `${durationSeconds.toFixed(2)} seconds`,
            typingSpeedWPM: wpm.toFixed(2),
            mistakes: this.typingData.backspaceCount,
            keyHoldDurations: this.typingData.keyReleases.map(r => ({ key: r.key, duration: `${r.holdDuration}ms` })),
            mouseMovements: this.mouseData.movements.map(m => `(${m.x}, ${m.y})`),
            clicks: this.mouseData.clicks.map(c => `(${c.x}, ${c.y})`),
            finalText: this.typingData.text,
        };
        
        this.onReport(report);
    }
}


function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}
