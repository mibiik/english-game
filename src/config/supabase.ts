// Supabase yapılandırma dosyası
import { createClient } from '@supabase/supabase-js';

// Supabase yapılandırma bilgileri
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://djkxksiaaonnjoidrfnj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqa3hrc2lhYW9ubmpvaWRyZm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTE0MzYsImV4cCI6MjA3Mzg4NzQzNn0.Q-TUF_zBVi248t-xA-Fgx8ysN5DpzOA5zexA2dou4iY';

// Geliştirme ortamında Supabase yapılandırmasını kontrol et
if (import.meta.env.MODE === 'development' && supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.warn('Supabase yapılandırması eksik! Lütfen .env dosyasına Supabase bilgilerinizi ekleyin.');
}

// Supabase client oluştur
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helper'ları
export const auth = supabase.auth;

// Database helper'ları
export const db = supabase;

export default supabase;

