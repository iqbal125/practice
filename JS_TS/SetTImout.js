// ============================================
// 1. BASIC TIMER CLASS - Understanding 'this' context
// ============================================

class BasicTimer {
    constructor(name) {
        this.name = name;
        this.count = 0;
    }

    // Problem: 'this' context is lost in setTimeout
    startWrong() {
        setTimeout(function () {
            // 'this' is undefined in strict mode or window in non-strict
            console.log(this.name); // Error or undefined
        }, 1000);
    }

    // Solution 1: Arrow function preserves 'this'
    startWithArrow() {
        setTimeout(() => {
            console.log(`${this.name}: Arrow function works!`);
            this.count++;
        }, 1000);
    }

    // Solution 2: Bind the context
    startWithBind() {
        setTimeout(function () {
            console.log(`${this.name}: Bind works!`);
            this.count++;
        }.bind(this), 1000);
    }

    // Solution 3: Store reference to 'this'
    startWithSelf() {
        const self = this;
        setTimeout(function () {
            console.log(`${self.name}: Self reference works!`);
            self.count++;
        }, 1000);
    }
}

// ============================================
// 2. DEBOUNCE CLASS - Delayed execution pattern
// ============================================

class Debouncer {
    constructor(callback, delay = 300) {
        this.callback = callback;
        this.delay = delay;
        this.timeoutId = null;
    }

    execute(...args) {
        // Clear existing timeout
        clearTimeout(this.timeoutId);

        // Set new timeout
        this.timeoutId = setTimeout(() => {
            this.callback.apply(this, args);
        }, this.delay);
    }

    cancel() {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
    }
}

// Usage example:
const searchDebouncer = new Debouncer((query) => {
    console.log(`Searching for: ${query}`);
}, 500);

// ============================================
// 3. THROTTLE CLASS - Rate limiting pattern
// ============================================

class Throttler {
    constructor(callback, limit = 100) {
        this.callback = callback;
        this.limit = limit;
        this.inThrottle = false;
    }

    execute(...args) {
        if (!this.inThrottle) {
            this.callback.apply(this, args);
            this.inThrottle = true;

            setTimeout(() => {
                this.inThrottle = false;
            }, this.limit);
        }
    }
}

// ============================================
// 4. INTERVAL MANAGER CLASS - Clean interval management
// ============================================

class IntervalManager {
    constructor() {
        this.intervals = new Map();
    }

    start(name, callback, delay) {
        // Stop existing interval with same name
        this.stop(name);

        const intervalId = setInterval(() => {
            callback();
        }, delay);

        this.intervals.set(name, {
            id: intervalId,
            callback,
            delay,
            startTime: Date.now()
        });
    }

    stop(name) {
        const interval = this.intervals.get(name);
        if (interval) {
            clearInterval(interval.id);
            this.intervals.delete(name);
        }
    }

    stopAll() {
        this.intervals.forEach((interval, name) => {
            clearInterval(interval.id);
        });
        this.intervals.clear();
    }

    getActive() {
        return Array.from(this.intervals.keys());
    }
}

// ============================================
// 5. COUNTDOWN TIMER CLASS - Complex timer management
// ============================================

class CountdownTimer {
    constructor(duration, onTick, onComplete) {
        this.duration = duration;
        this.remaining = duration;
        this.onTick = onTick || (() => { });
        this.onComplete = onComplete || (() => { });
        this.intervalId = null;
        this.isPaused = false;
        this.startTime = null;
        this.pausedTime = 0;
    }

    start() {
        if (this.intervalId) return;

        this.startTime = Date.now() - this.pausedTime;

        this.intervalId = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            this.remaining = Math.max(0, this.duration - elapsed);

            this.onTick(this.remaining);

            if (this.remaining === 0) {
                this.stop();
                this.onComplete();
            }
        }, 100); // Update every 100ms for smooth countdown
    }

    pause() {
        if (!this.intervalId || this.isPaused) return;

        clearInterval(this.intervalId);
        this.intervalId = null;
        this.isPaused = true;
        this.pausedTime = Date.now() - this.startTime;
    }

    resume() {
        if (!this.isPaused) return;

        this.isPaused = false;
        this.start();
    }

    stop() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.remaining = this.duration;
        this.pausedTime = 0;
        this.isPaused = false;
    }

    reset() {
        this.stop();
        this.remaining = this.duration;
    }
}

// ============================================
// 6. POLLING CLASS - Async polling with backoff
// ============================================

class Poller {
    constructor(asyncFn, options = {}) {
        this.asyncFn = asyncFn;
        this.interval = options.interval || 1000;
        this.maxAttempts = options.maxAttempts || Infinity;
        this.backoff = options.backoff || false;
        this.onError = options.onError || console.error;

        this.attempts = 0;
        this.timeoutId = null;
        this.isPolling = false;
    }

    async start() {
        if (this.isPolling) return;

        this.isPolling = true;
        this.attempts = 0;
        await this.poll();
    }

    async poll() {
        if (!this.isPolling) return;

        try {
            await this.asyncFn();
            this.attempts = 0; // Reset on success

            if (this.isPolling) {
                this.timeoutId = setTimeout(() => {
                    this.poll();
                }, this.interval);
            }
        } catch (error) {
            this.attempts++;
            this.onError(error, this.attempts);

            if (this.attempts >= this.maxAttempts) {
                this.stop();
                return;
            }

            // Calculate next interval with exponential backoff
            const nextInterval = this.backoff
                ? Math.min(this.interval * Math.pow(2, this.attempts - 1), 30000)
                : this.interval;

            if (this.isPolling) {
                this.timeoutId = setTimeout(() => {
                    this.poll();
                }, nextInterval);
            }
        }
    }

    stop() {
        this.isPolling = false;
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
    }
}

// ============================================
// 7. ANIMATION LOOP CLASS - requestAnimationFrame alternative
// ============================================

class AnimationLoop {
    constructor(callback, fps = 60) {
        this.callback = callback;
        this.fps = fps;
        this.frameInterval = 1000 / fps;
        this.intervalId = null;
        this.lastTime = 0;
        this.frameCount = 0;
    }

    start() {
        if (this.intervalId) return;

        this.lastTime = Date.now();
        this.frameCount = 0;

        this.intervalId = setInterval(() => {
            const currentTime = Date.now();
            const deltaTime = currentTime - this.lastTime;

            this.callback(deltaTime, this.frameCount);

            this.lastTime = currentTime;
            this.frameCount++;
        }, this.frameInterval);
    }

    stop() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    setFPS(fps) {
        this.fps = fps;
        this.frameInterval = 1000 / fps;

        if (this.intervalId) {
            this.stop();
            this.start();
        }
    }
}

// ============================================
// 8. RETRY MECHANISM CLASS - Retry with delays
// ============================================

class RetryManager {
    constructor(options = {}) {
        this.maxRetries = options.maxRetries || 3;
        this.retryDelay = options.retryDelay || 1000;
        this.backoffMultiplier = options.backoffMultiplier || 2;
        this.maxDelay = options.maxDelay || 30000;
    }

    async execute(asyncFn, context = null) {
        let lastError;

        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            try {
                return await asyncFn.call(context);
            } catch (error) {
                lastError = error;

                if (attempt < this.maxRetries) {
                    const delay = Math.min(
                        this.retryDelay * Math.pow(this.backoffMultiplier, attempt),
                        this.maxDelay
                    );

                    console.log(`Retry ${attempt + 1}/${this.maxRetries} after ${delay}ms`);

                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw lastError;
    }
}

// ============================================
// 9. SCHEDULED TASK CLASS - Cron-like scheduling
// ============================================

class ScheduledTask {
    constructor(task, schedule) {
        this.task = task;
        this.schedule = schedule; // { hour: 14, minute: 30 } for 2:30 PM
        this.timeoutId = null;
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.scheduleNext();
    }

    scheduleNext() {
        if (!this.isRunning) return;

        const now = new Date();
        const next = new Date();

        next.setHours(this.schedule.hour || 0);
        next.setMinutes(this.schedule.minute || 0);
        next.setSeconds(this.schedule.second || 0);
        next.setMilliseconds(0);

        // If time has passed today, schedule for tomorrow
        if (next <= now) {
            next.setDate(next.getDate() + 1);
        }

        const delay = next - now;

        console.log(`Next execution scheduled for ${next.toLocaleString()}`);

        this.timeoutId = setTimeout(() => {
            this.task();
            this.scheduleNext(); // Schedule next execution
        }, delay);
    }

    stop() {
        this.isRunning = false;
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
    }
}

// ============================================
// 10. QUEUE PROCESSOR CLASS - Process items with delays
// ============================================

class QueueProcessor {
    constructor(processItem, delay = 100) {
        this.processItem = processItem;
        this.delay = delay;
        this.queue = [];
        this.isProcessing = false;
        this.timeoutId = null;
    }

    add(item) {
        this.queue.push(item);
        if (!this.isProcessing) {
            this.startProcessing();
        }
    }

    addBatch(items) {
        this.queue.push(...items);
        if (!this.isProcessing) {
            this.startProcessing();
        }
    }

    startProcessing() {
        if (this.isProcessing || this.queue.length === 0) return;

        this.isProcessing = true;
        this.processNext();
    }

    processNext() {
        if (this.queue.length === 0) {
            this.isProcessing = false;
            return;
        }

        const item = this.queue.shift();

        try {
            this.processItem(item);
        } catch (error) {
            console.error('Error processing item:', error);
        }

        this.timeoutId = setTimeout(() => {
            this.processNext();
        }, this.delay);
    }

    stop() {
        this.isProcessing = false;
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
    }

    clear() {
        this.queue = [];
        this.stop();
    }
}

// ============================================
// 11. MEMORY LEAK PREVENTION - Auto cleanup
// ============================================

class AutoCleanupTimer {
    constructor() {
        this.timers = new Set();
        this.intervals = new Set();

        // Auto cleanup on certain events
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => this.cleanup());
        }
    }

    setTimeout(callback, delay) {
        const timerId = setTimeout(() => {
            this.timers.delete(timerId);
            callback();
        }, delay);

        this.timers.add(timerId);
        return timerId;
    }

    setInterval(callback, delay) {
        const intervalId = setInterval(callback, delay);
        this.intervals.add(intervalId);
        return intervalId;
    }

    clearTimeout(timerId) {
        clearTimeout(timerId);
        this.timers.delete(timerId);
    }

    clearInterval(intervalId) {
        clearInterval(intervalId);
        this.intervals.delete(intervalId);
    }

    cleanup() {
        this.timers.forEach(id => clearTimeout(id));
        this.intervals.forEach(id => clearInterval(id));
        this.timers.clear();
        this.intervals.clear();
    }
}

// ============================================
// 12. ADVANCED EXAMPLE - Game Loop with State Management
// ============================================

class GameEngine {
    constructor() {
        this.state = 'stopped';
        this.entities = [];
        this.updateInterval = null;
        this.renderInterval = null;
        this.physicsTimeout = null;
        this.targetFPS = 60;
        this.targetUPS = 30; // Updates per second
        this.stats = {
            frames: 0,
            updates: 0,
            startTime: 0
        };
    }

    start() {
        if (this.state === 'running') return;

        this.state = 'running';
        this.stats.startTime = Date.now();

        // Separate update and render loops
        this.updateInterval = setInterval(() => {
            this.update();
            this.stats.updates++;
        }, 1000 / this.targetUPS);

        this.renderInterval = setInterval(() => {
            this.render();
            this.stats.frames++;
        }, 1000 / this.targetFPS);

        // Physics calculation with delay
        this.schedulePhysics();
    }

    schedulePhysics() {
        if (this.state !== 'running') return;

        this.physicsTimeout = setTimeout(() => {
            this.calculatePhysics();
            this.schedulePhysics();
        }, 50); // Physics every 50ms
    }

    update() {
        this.entities.forEach(entity => {
            if (entity.update) entity.update();
        });
    }

    render() {
        // Render logic here
        console.log(`FPS: ${this.getCurrentFPS()}`);
    }

    calculatePhysics() {
        // Physics calculations
    }

    getCurrentFPS() {
        const elapsed = (Date.now() - this.stats.startTime) / 1000;
        return Math.round(this.stats.frames / elapsed);
    }

    pause() {
        this.state = 'paused';
        clearInterval(this.updateInterval);
        clearInterval(this.renderInterval);
        clearTimeout(this.physicsTimeout);
    }

    resume() {
        if (this.state === 'paused') {
            this.start();
        }
    }

    stop() {
        this.state = 'stopped';
        clearInterval(this.updateInterval);
        clearInterval(this.renderInterval);
        clearTimeout(this.physicsTimeout);
        this.stats = { frames: 0, updates: 0, startTime: 0 };
    }
}

// ============================================
// USAGE EXAMPLES
// ============================================

// Example 1: Debouncing search input
const handleSearch = new Debouncer((query) => {
    console.log(`Searching: ${query}`);
}, 300);

// Simulate rapid typing
['h', 'he', 'hel', 'hell', 'hello'].forEach((text, i) => {
    setTimeout(() => handleSearch.execute(text), i * 100);
});

// Example 2: Countdown timer
const countdown = new CountdownTimer(
    5000, // 5 seconds
    (remaining) => console.log(`Remaining: ${Math.ceil(remaining / 1000)}s`),
    () => console.log('Countdown complete!')
);

// Example 3: Polling with exponential backoff
const apiPoller = new Poller(
    async () => {
        const response = await fetch('/api/status');
        if (!response.ok) throw new Error('API error');
        return response.json();
    },
    {
        interval: 2000,
        maxAttempts: 5,
        backoff: true,
        onError: (err, attempt) => console.log(`Poll failed (attempt ${attempt}):`, err.message)
    }
);

// Example 4: Retry mechanism
const retryManager = new RetryManager({
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2
});

async function unreliableOperation() {
    if (Math.random() > 0.7) {
        return 'Success!';
    }
    throw new Error('Random failure');
}

// retryManager.execute(unreliableOperation)
//     .then(result => console.log(result))
//     .catch(err => console.error('All retries failed:', err));

// Example 5: Queue processing
const taskQueue = new QueueProcessor(
    (task) => console.log(`Processing: ${task}`),
    500 // 500ms delay between tasks
);

taskQueue.addBatch(['Task 1', 'Task 2', 'Task 3', 'Task 4']);

// ============================================
// EXPORT FOR MODULE USE
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BasicTimer,
        Debouncer,
        Throttler,
        IntervalManager,
        CountdownTimer,
        Poller,
        AnimationLoop,
        RetryManager,
        ScheduledTask,
        QueueProcessor,
        AutoCleanupTimer,
        GameEngine
    };
}