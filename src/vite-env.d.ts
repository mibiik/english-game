/// <reference types="vite/client" />

interface Window {
    puter: any; 
}

interface PuterAIResponse {
  text?: string;
  message?: {
    content: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface PuterAI {
  chat(prompt: string, options?: { model?: string; stream?: boolean }): Promise<PuterAIResponse | string>;
  txt2img(prompt:string, options?: any): Promise<HTMLImageElement>;
}

interface Puter {
  ai: PuterAI;
  print(message: any): void;
}

declare const puter: Puter;
