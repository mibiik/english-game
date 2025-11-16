export const API_KEYS = {
  openai: {
    key: import.meta.env.VITE_OPENAI_API_KEY || '',
    model: 'gpt-3.5-turbo',
    description: 'OpenAI GPT-3.5 Turbo'
  }
};

export const EMAILJS_PUBLIC_KEY = 'G47uElGCYuK5iEKvU'; 

// Google AdSense client ID (publisher ID). Set this in your environment for production:
// VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxx
export const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-8933238568700652';