const API_KEYS = [
    'AIzaSyDiVeORIE-f1NIasO4FZFb2OqOMQaAr7MY',  // 1. API Key
    'AIzaSyDjMxAzVQ3slraF0cmvHA-v_Rw80r3mZ70',  // 2. API Key
    'AIzaSyCXpPzPMMfUj60yMZyPvL3_rsoOftP7e58',  // 3. API Key
    'AIzaSyACHekasMC_i6B3iWqSsR_0r3dUKGtrf_4',  // 4. API Key
    'AIzaSyCd0iVc-UaD5tq8CUE-EPzJqUxzpscyWj0', // 5. API Key
    'AIzaSyD90i-sOZcmqPRr0Yz1sr4HjAwHDixq_SQ', // 6. API Key
    'AIzaSyBehNtVq1zERg1Rs9yLaDAAiHEFOHBmBrc',  // 7. API Key
    'AIzaSyAqnYBsqN0FbVwWBpSml_Wf6mCsaPT5nY0',  // 8. API Key
    'AIzaSyBp7cX2tNq4lbJUTw51J7gsJ_iwhEjEih4',   // 9. API Key
    'AIzaSyAU5UMyrKcoj5iPU2MYfblFBRcVWi_DI_E',   // 10. API Key
    'AIzaSyDi7o3ymQ_dQCLs73JMSsYXbL26V2KznnI',   // 11. API Key
    'AIzaSyCJewvuw_ejR5UUTCEA9IwnlnBTydMviFE'    // 12. API Key
];

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
        if (this.lastResetCheck < todayStart) {
            console.log('Günlük limit reset zamanı! Tüm API key\'leri tekrar kullanılabilir.');
            this.failedKeys.clear();
            this.lastResetCheck = now;
            localStorage.setItem(RESET_TIME_STORAGE, this.lastResetCheck.toString());
            localStorage.removeItem(FAILED_KEYS_STORAGE);
        }
    }

    public getKey(): string {
        return API_KEYS[this.currentIndex];
    }

    public markKeyAsFailed(keyIndex?: number): void {
        const indexToMark = keyIndex !== undefined ? keyIndex : this.currentIndex;
        this.failedKeys.add(indexToMark);
        localStorage.setItem(FAILED_KEYS_STORAGE, JSON.stringify([...this.failedKeys]));
        console.warn(`API key ${indexToMark} marked as failed/rate-limited`);
    }

    public rotateKey(): string {
        this.checkAndResetFailedKeys();
        
        let attempts = 0;
        const maxAttempts = API_KEYS.length;
        
        // Failed olmayan bir key bul
        while (attempts < maxAttempts) {
            this.currentIndex = (this.currentIndex + 1) % API_KEYS.length;
            
            if (!this.failedKeys.has(this.currentIndex)) {
                localStorage.setItem(STORAGE_KEY, this.currentIndex.toString());
                console.warn(`Rotated to API key index: ${this.currentIndex}`);
                return this.getKey();
            }
            attempts++;
        }
        
        // Tüm key'ler failed ise en eski key'e dön
        console.error('All API keys are rate-limited. Using first key as fallback.');
        this.currentIndex = 0;
        localStorage.setItem(STORAGE_KEY, this.currentIndex.toString());
        return this.getKey();
    }

    public hasMoreKeys(): boolean {
        this.checkAndResetFailedKeys();
        return this.failedKeys.size < API_KEYS.length;
    }

    public getAvailableKeysCount(): number {
        this.checkAndResetFailedKeys();
        return API_KEYS.length - this.failedKeys.size;
    }
}

export const apiKeyManager = ApiKeyManager.getInstance(); 