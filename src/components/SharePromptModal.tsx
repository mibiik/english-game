import React, { useCallback, useState } from 'react';

interface SharePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SharePromptModal: React.FC<SharePromptModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareText = 'Wordliste çalışabileceğin müthiş bir uygulama, hemen dene:';
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
        <div className="relative p-8 text-white">
          {/* Kapat butonu kaldırıldı: sadece kopyalama veya WhatsApp paylaşımı ile kapanır */}
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
              className="flex-1 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-semibold transition text-center shadow-[0_10px_30px_-12px_rgba(16,185,129,0.6)]"
            >
              WhatsApp ile Paylaş
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePromptModal;


