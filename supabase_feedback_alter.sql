-- Eğer mevcut feedbacks tablosunu korumak istiyorsanız, bu komutları kullanın
-- Supabase Dashboard > SQL Editor'da çalıştırın

-- Mevcut tabloyu kontrol et
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'feedbacks' AND table_schema = 'public';

-- Eksik kolonları ekle (eğer yoksa)
DO $$ 
BEGIN
    -- user_id kolonu ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'feedbacks' AND column_name = 'user_id') THEN
        ALTER TABLE public.feedbacks ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    -- name kolonu ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'feedbacks' AND column_name = 'name') THEN
        ALTER TABLE public.feedbacks ADD COLUMN name TEXT NOT NULL DEFAULT 'Anonim';
    END IF;
    
    -- feedback kolonu ekle (eğer yoksa)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'feedbacks' AND column_name = 'feedback') THEN
        ALTER TABLE public.feedbacks ADD COLUMN feedback TEXT NOT NULL DEFAULT '';
    END IF;
    
    -- created_at kolonu ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'feedbacks' AND column_name = 'created_at') THEN
        ALTER TABLE public.feedbacks ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- RLS politikalarını etkinleştir
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları sil
DROP POLICY IF EXISTS "Anyone can read feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Authenticated users can insert feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Users can delete own feedbacks" ON public.feedbacks;

-- Yeni politikaları oluştur
CREATE POLICY "Anyone can read feedbacks" ON public.feedbacks
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert feedbacks" ON public.feedbacks
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own feedbacks" ON public.feedbacks
    FOR DELETE USING (auth.uid() = user_id);

-- Index'ler ekle
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON public.feedbacks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_user_id ON public.feedbacks(user_id);
