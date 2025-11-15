import React, { useCallback, useState } from 'react';

interface SharePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SharePromptModal: React.FC<SharePromptModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareText = 'Wordliste çalışabileceğin müthiş bir uygulama bulduum:';
  const shareUrl = 'https://kuwordplay.com';

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (_e) {
      // Fallback: text alanı seçimi için görünmez input (gerekirse ileride eklenir)
      setCopied(true);
      setTimeout(() => {
        onClose();
      }, 900);
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]"></div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition hover:scale-110"
          aria-label="Kapat"
          title="Kapat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="relative p-8 text-white">
          <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">Paylaşmaya yardımcı olur musun?</h2>
          <p className="text-white/75 leading-relaxed mb-5">
            Sitemizi sınıf gruplarında ve arkadaşlarınla paylaşarak daha çok kişiye ulaşmamıza destek olabilirsin.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 mb-5 flex items-center justify-between gap-3">
            <div className="text-sm text-white/90 break-all tracking-wide">{shareUrl}</div>
            <button
              onClick={handleCopy}
              className="shrink-0 w-10 h-10 inline-flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition"
              aria-label="Kopyala"
              title="Kopyala"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
          {copied && (
            <div className="mb-4 text-sm text-emerald-300/90">Bağlantı kopyalandı.</div>
          )}
          <div className="flex">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
              onClick={onClose}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-semibold transition shadow-[0_10px_30px_-12px_rgba(16,185,129,0.6)] inline-flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path d="M20.52 3.48A11.94 11.94 0 0012.01 0C5.4 0 .05 5.34.05 11.92c0 2.1.56 4.15 1.63 5.96L0 24l6.29-1.64a11.9 11.9 0 005.72 1.46h.01c6.6 0 11.96-5.35 11.96-11.93 0-3.19-1.24-6.19-3.46-8.41zM12.02 21.5h-.01a9.6 9.6 0 01-4.9-1.34l-.35-.2-3.73.97.99-3.64-.23-.37a9.58 9.58 0 01-1.47-5.02c0-5.29 4.31-9.59 9.61-9.59a9.57 9.57 0 016.78 2.8 9.55 9.55 0 012.82 6.79c0 5.29-4.31 9.6-9.61 9.6zm5.47-7.15c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.29-.78.98-.95 1.18-.17.2-.35.22-.65.08-.3-.15-1.25-.46-2.39-1.45-.88-.75-1.47-1.67-1.64-1.96-.17-.29-.02-.45.13-.6.13-.13.3-.35.46-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.24-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.27.29-1.05 1.03-1.05 2.51s1.08 2.91 1.23 3.11c.15.2 2.13 3.25 5.16 4.56.72.31 1.28.49 1.72.63.72.23 1.36.2 1.87.12.57-.08 1.78-.73 2.03-1.44.25-.71.25-1.31.17-1.44-.08-.13-.27-.2-.57-.35z"/>
              </svg>
              WhatsApp ile Paylaş
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePromptModal;


