-- Supabase'de feedbacks tablosunu oluşturmak için SQL komutları
-- Bu komutları Supabase Dashboard > SQL Editor'da çalıştırın

-- Önce mevcut tabloyu kontrol et ve sil (eğer varsa)
DROP TABLE IF EXISTS public.feedbacks CASCADE;

-- Feedbacks tablosunu oluştur
CREATE TABLE public.feedbacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    feedback TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) politikalarını etkinleştir
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Herkes feedback okuyabilir (admin sayfası için)
CREATE POLICY "Anyone can read feedbacks" ON public.feedbacks
    FOR SELECT USING (true);

-- Sadece giriş yapmış kullanıcılar feedback ekleyebilir
CREATE POLICY "Authenticated users can insert feedbacks" ON public.feedbacks
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Sadece kendi feedback'ini silebilir
CREATE POLICY "Users can delete own feedbacks" ON public.feedbacks
    FOR DELETE USING (auth.uid() = user_id);

-- Index'ler ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON public.feedbacks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_user_id ON public.feedbacks(user_id);
