import React, { useState } from 'react';
import { MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'; // Sağ ok için de ekle

// EmailJS entegrasyonu için aşağıdaki paketi yüklemeniz gerekir:
// npm install emailjs-com
// import emailjs from 'emailjs-com';

const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_USER_ID = 'YOUR_USER_ID';

const FeedbackButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showFeedbackLabel, setShowFeedbackLabel] = useState(true); // Sayfa ilk açıldığında feedback yazısı açık
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSuccess(false);
    try {
      // EmailJS ile gönderim örneği:
      // await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      //   from_name: name,
      //   message: feedback,
      //   to_email: 'miracbirlik259@gmail.com',
      // }, EMAILJS_USER_ID);
      // setSuccess(true);
      // setName('');
      // setFeedback('');
      // setOpen(false);
      // Not: Gerçek anahtarları ve template'i EmailJS panelinden almalısınız.
      setTimeout(() => {
        setSuccess(true);
        setSending(false);
        setName('');
        setFeedback('');
        setOpen(false);
      }, 1200);
    } catch (err) {
      setError('Gönderim sırasında bir hata oluştu.');
      setSending(false);
    }
  };

  return (
    <>
      {/* Sağ kenara yapışık, dikey, mavi, küçük ve ok ikonlu buton */}
      {/* Feedback açıkken: ikon+feedback yazısı+sağa bakan ok (içeri) */}
      {!open && showFeedbackLabel && (
        <button
          onClick={() => setShowFeedbackLabel(false)}
          className="fixed z-50 bg-blue-600 hover:bg-blue-700 text-white px-2 py-3 rounded-l-2xl rounded-r-none shadow-lg flex flex-col items-center justify-center font-bold transition-all duration-200"
          style={{
            top: '130px',
            right: 0,
            borderRadius: '1.5rem 0 0 1.5rem',
            minHeight: '90px',
            minWidth: '36px',
            boxShadow: '0 2px 12px 0 #0002',
            fontSize: '0.95rem',
            letterSpacing: '0.05em',
            position: 'fixed',
          }}
        >
          <div className="flex flex-col items-center cursor-pointer" onClick={() => setOpen(true)}>
            <MessageCircle size={18} className="mb-1" />
            <span style={{writingMode: 'vertical-rl', textOrientation: 'mixed', fontWeight: 700, letterSpacing: '0.1em'}}>Feedback</span>
          </div>
          <ChevronRight size={18} className="mt-1 cursor-pointer" onClick={e => { e.stopPropagation(); setShowFeedbackLabel(false); }} />
        </button>
      )}
      {/* Kapalıyken: sadece sola bakan ok (dışarı) */}
      {!open && !showFeedbackLabel && (
        <button
          onClick={() => setShowFeedbackLabel(true)}
          className="fixed z-50 bg-blue-600 hover:bg-blue-700 text-white px-2 py-3 rounded-l-2xl rounded-r-none shadow-lg flex flex-col items-center justify-center font-bold transition-all duration-200"
          style={{
            top: '130px',
            right: 0,
            borderRadius: '1.5rem 0 0 1.5rem',
            minHeight: '60px',
            minWidth: '36px',
            boxShadow: '0 2px 12px 0 #0002',
            fontSize: '0.95rem',
            letterSpacing: '0.05em',
            position: 'fixed',
          }}
        >
          <ChevronLeft size={18} />
        </button>
      )}
      {open && (
        <>
          <button
            onClick={() => setOpen(false)}
            className="fixed z-50 bg-blue-600 hover:bg-blue-700 text-white px-2 py-3 rounded-l-2xl rounded-r-none shadow-lg flex flex-col items-center justify-center font-bold transition-all duration-200"
            style={{
              top: '130px',
              right: 0,
              borderRadius: '1.5rem 0 0 1.5rem',
              minHeight: '60px',
              minWidth: '36px',
              boxShadow: '0 2px 12px 0 #0002',
              fontSize: '0.95rem',
              letterSpacing: '0.05em',
              position: 'fixed',
            }}
          >
            <ChevronLeft size={18} />
          </button>
          {/* Modal */}
          {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
                  aria-label="Kapat"
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold mb-4 text-pink-600 text-center">Geri Bildirim</h2>
                <form onSubmit={handleSend} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">İsim (isteğe bağlı)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                      placeholder="Adınız (isteğe bağlı)"
                      disabled={sending}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Geri Bildiriminiz *</label>
                    <textarea
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                      placeholder="Görüşünüz, öneriniz veya hata bildirimi..."
                      rows={4}
                      required
                      disabled={sending}
                    />
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  {success && <div className="text-green-600 text-sm">Teşekkürler! Geri bildiriminiz alındı.</div>}
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                      disabled={sending}
                    >
                      Kapat
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-pink-600 text-white font-bold hover:bg-pink-700 transition"
                      disabled={sending || !feedback.trim()}
                    >
                      {sending ? 'Gönderiliyor...' : 'Gönder'}
                    </button>
                  </div>
                </form>
                <div className="text-xs text-gray-400 mt-3 text-center">Geri bildiriminiz miracbirlik259@gmail.com adresine iletilecek.</div>
                <div className="text-xs text-gray-400 mt-1 text-center">Gerçek gönderim için EmailJS anahtarlarını eklemelisiniz.</div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default FeedbackButton; 