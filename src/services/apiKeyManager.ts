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
    'AIzaSyAU5UMyrKcoj5iPU2MYfblFBRcVWi_DI_E'   // 10. API Key
];

const STORAGE_KEY = 'gemini_api_key_index';

class ApiKeyManager {
    private static instance: ApiKeyManager;
    private currentIndex: number;

    private constructor() {
        const savedIndex = localStorage.getItem(STORAGE_KEY);
        this.currentIndex = savedIndex ? parseInt(savedIndex, 10) : 0;
    }

    public static getInstance(): ApiKeyManager {
        if (!ApiKeyManager.instance) {
            ApiKeyManager.instance = new ApiKeyManager();
        }
        return ApiKeyManager.instance;
    }

    public getKey(): string {
        return API_KEYS[this.currentIndex];
    }

    public rotateKey(): string {
        this.currentIndex = (this.currentIndex + 1) % API_KEYS.length;
        localStorage.setItem(STORAGE_KEY, this.currentIndex.toString());
        console.warn(`API key limit reached. Rotating to next key index: ${this.currentIndex}`);
        return this.getKey();
    }

    public hasMoreKeys(): boolean {
        // Bu basit rotasyon sisteminde her zaman bir sonraki anahtara döneriz.
        // Daha gelişmiş bir sistem, tüm anahtarların denendiğini takip edebilir.
        return true; 
    }
}

export const apiKeyManager = ApiKeyManager.getInstance(); 