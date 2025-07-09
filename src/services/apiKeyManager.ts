const API_KEYS = (import.meta.env.VITE_GEMINI_API_KEYS || '').split(',').filter(Boolean);

const STORAGE_KEY = 'gemini_api_key_index';
const FAILED_KEYS_STORAGE = 'gemini_failed_keys';
const RESET_TIME_STORAGE = 'gemini_keys_reset_time';

class ApiKeyManager {
    private static instance: ApiKeyManager;
    private currentIndex: number;
    private failedKeys: Set<number>;
    private lastResetCheck: number;

    private constructor() {
        const savedIndex = localStorage.getItem(STORAGE_KEY);
        this.currentIndex = savedIndex ? parseInt(savedIndex, 10) : 0;
        
        // Failed keys listesini yükle
        const failedKeysData = localStorage.getItem(FAILED_KEYS_STORAGE);
        this.failedKeys = failedKeysData ? new Set(JSON.parse(failedKeysData)) : new Set();
        
        // Reset time kontrolü
        const lastReset = localStorage.getItem(RESET_TIME_STORAGE);
        this.lastResetCheck = lastReset ? parseInt(lastReset, 10) : Date.now();
        
        this.checkAndResetFailedKeys();
    }

    public static getInstance(): ApiKeyManager {
        if (!ApiKeyManager.instance) {
            ApiKeyManager.instance = new ApiKeyManager();
        }
        return ApiKeyManager.instance;
    }

    private checkAndResetFailedKeys(): void {
        const now = Date.now();
        const utcToday = new Date();
        utcToday.setUTCHours(0, 0, 0, 0);
        const todayStart = utcToday.getTime();
        
        // Eğer son resetin üzerinden 24 saat geçtiyse failed key'leri temizle
        if (now - this.lastResetCheck > 24 * 60 * 60 * 1000) {
            console.log('Günlük limit reset zamanı! Tüm API key\'leri tekrar kullanılabilir.');
            this.failedKeys.clear();
            this.lastResetCheck = now;
            localStorage.setItem(RESET_TIME_STORAGE, this.lastResetCheck.toString());
            localStorage.removeItem(FAILED_KEYS_STORAGE);
        }
    }

    public getKey(): string {
        if (API_KEYS.length === 0) {
            console.error('No API keys found. Please set VITE_GEMINI_API_KEYS environment variable.');
            return '';
        }
        return API_KEYS[this.currentIndex];
    }

    public markKeyAsFailed(keyIndex?: number): void {
        const indexToMark = keyIndex !== undefined ? keyIndex : this.currentIndex;
        this.failedKeys.add(indexToMark);
        localStorage.setItem(FAILED_KEYS_STORAGE, JSON.stringify([...this.failedKeys]));
        console.warn(`API key ${indexToMark} marked as failed/rate-limited.`);

        if (this.failedKeys.size >= API_KEYS.length) {
            console.error("All available API keys have been marked as failed.");
        }
    }

    public rotateKey(): string {
        this.checkAndResetFailedKeys();

        if (API_KEYS.length === 0) {
            return '';
        }

        const initialIndex = this.currentIndex;
        let attempts = 0;
        
        do {
            this.currentIndex = (this.currentIndex + 1) % API_KEYS.length;
            attempts++;
            if (!this.failedKeys.has(this.currentIndex)) {
                localStorage.setItem(STORAGE_KEY, this.currentIndex.toString());
                console.warn(`Rotated to API key index: ${this.currentIndex}`);
                return this.getKey();
            }
        } while (this.currentIndex !== initialIndex && attempts < API_KEYS.length);
        
        console.error('All API keys are rate-limited. Retrying from the first key.');
        // Fallback to the first key if all are marked as failed
        this.currentIndex = 0;
        localStorage.setItem(STORAGE_KEY, this.currentIndex.toString());
        return this.getKey();
    }

    public hasMoreKeys(): boolean {
        this.checkAndResetFailedKeys();
        if (API_KEYS.length === 0) return false;
        return this.failedKeys.size < API_KEYS.length;
    }

    public getAvailableKeysCount(): number {
        this.checkAndResetFailedKeys();
        if (API_KEYS.length === 0) return 0;
        return API_KEYS.length - this.failedKeys.size;
    }
}

export const apiKeyManager = ApiKeyManager.getInstance(); 