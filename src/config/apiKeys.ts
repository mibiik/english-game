export const API_KEYS = {
  gemini: {
    key: import.meta.env.VITE_GEMINI_API_KEY || '',
    model: 'gemini-2.0-flash',
    description: 'Google Gemini 2.0 Flash'
  },
  openai: {
    key: import.meta.env.VITE_OPENAI_API_KEY || '',
    model: 'gpt-3.5-turbo',
    description: 'OpenAI GPT-3.5 Turbo'
  }
}; 