import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import app from '../config/firebase';

const db = getFirestore(app);

const FeedbackButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSuccess(false);
    const user = authService.getCurrentUser();
    if (!user || !user.displayName) {
      setError('Geri bildirim göndermek için giriş yapmalısınız.');
      setSending(false);
      return;
    }
    try {
      await addDoc(collection(db, 'feedbacks'), {
        name: user.displayName,
        feedback,
        date: serverTimestamp(),
      });
      setSuccess(true);
      setFeedback('');
      setOpen(false);
    } catch (err: any) {
      setError('Gönderim sırasında bir hata oluştu.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed z-50 bottom-6 sm:bottom-8 right-4 sm:right-8 bg-gradient-to-br from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white p-2 sm:p-4 rounded-full shadow-lg flex items-center justify-center gap-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-400"
        style={{ boxShadow: '0 4px 24px #7f1d1d80' }}
        title="Geri Bildirim Gönder"
      >
        <span className="mr-1 font-normal text-sm sm:font-semibold sm:text-base tracking-tight">Feedback</span>
        <MessageCircle size={20} className="sm:w-7 sm:h-7 w-5 h-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-2xl shadow-2xl p-7 w-full max-w-sm relative animate-fadeInUp border border-red-900">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl font-bold focus:outline-none"
              aria-label="Kapat"
            >
              ×
            </button>
            <h2 className="text-2xl font-extrabold mb-4 text-red-200 text-center tracking-tight">Geri Bildirim</h2>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 border border-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-base text-white bg-red-950 placeholder-red-300"
                  placeholder="Görüşünüz, öneriniz veya hata bildirimi..."
                  rows={4}
                  required
                  disabled={sending}
                />
              </div>
              {error && <div className="text-red-300 text-sm text-center">{error}</div>}
              {success && <div className="text-green-300 text-sm text-center">Teşekkürler! Geri bildiriminiz alındı.</div>}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 font-semibold"
                  disabled={sending}
                >
                  Kapat
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-700 to-red-900 text-white font-bold hover:from-red-800 hover:to-red-950 transition"
                  disabled={sending || !feedback.trim()}
                >
                  {sending ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton; 