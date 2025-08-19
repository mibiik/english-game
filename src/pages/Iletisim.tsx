import React, { useState } from 'react';
import { ArrowLeft, Send, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { feedbackService } from '../services/feedbackService';

const Iletisim: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await feedbackService.createFeedback({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        category: 'general'
      });

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // 3 saniye sonra success mesajını kaldır
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Feedback gönderilirken hata:', error);
      setSubmitStatus('error');
      
      // 5 saniye sonra error mesajını kaldır
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Header */}
      <div className="bg-black/20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">İletişim</h1>
              <p className="text-neutral-400 text-sm">Bizimle iletişime geçin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Bizimle İletişime Geçin
          </h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Her türlü soru, öneri veya destek talebiniz için bize ulaşabilirsiniz. 
            En kısa sürede size dönüş yapacağız.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-neutral-800/50 rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Mesaj Gönder</h3>
            
            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-600/20 border border-green-500/30 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300">Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.</span>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-600/20 border border-red-500/30 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300">Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-neutral-300 mb-2 font-medium">İsim</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-neutral-800/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Adınız ve soyadınız"
                  required
                />
              </div>
              
              <div>
                <label className="block text-neutral-300 mb-2 font-medium">E-posta</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-neutral-800/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="E-posta adresiniz"
                  required
                />
              </div>
              
              <div>
                <label className="block text-neutral-300 mb-2 font-medium">Konu</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-neutral-800/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Mesaj konusu"
                  required
                />
              </div>
              
              <div>
                <label className="block text-neutral-300 mb-2 font-medium">Mesaj</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-neutral-800/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Mesajınızı buraya yazın..."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Mesaj Gönder
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div className="space-y-8">
            {/* General Info */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Bilgi</h3>
              <div className="space-y-4">
                <div className="p-4 bg-neutral-800/30 rounded-xl border border-white/10">
                  <h4 className="text-white font-medium mb-2">Yanıt Süresi</h4>
                  <p className="text-neutral-300 text-sm">
                    Mesajlarınıza 24 saat içinde yanıt veriyoruz. 
                    Acil durumlar için destek sayfamızı ziyaret edin.
                  </p>
                </div>
                
                <div className="p-4 bg-neutral-800/30 rounded-xl border border-white/10">
                  <h4 className="text-white font-medium mb-2">Destek Kategorileri</h4>
                  <p className="text-neutral-300 text-sm">
                    Teknik destek, öneriler, hata bildirimi ve genel sorularınız için 
                    bu formu kullanabilirsiniz.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-neutral-800/50 rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-3">Sık Sorulan Sorular</h4>
              <p className="text-neutral-300 mb-4 text-sm">
                Genel sorularınız için SSS sayfamızı ziyaret edin.
              </p>
              <button
                onClick={() => navigate('/sss')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                SSS'yi Görüntüle
              </button>
            </div>

            {/* Support Link */}
            <div className="bg-neutral-800/50 rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-3">Teknik Destek</h4>
              <p className="text-neutral-300 mb-4 text-sm">
                Teknik sorunlar için detaylı destek sayfamızı ziyaret edin.
              </p>
              <button
                onClick={() => navigate('/destek')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Destek Al
              </button>
            </div>
          </div>
        </div>

        {/* Response Time Info */}
        <div className="mt-16 text-center">
          <div className="bg-neutral-800/50 rounded-2xl p-8 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">Hızlı Yanıt Garantisi</h3>
            <p className="text-neutral-300 mb-6">
              Mesajlarınıza 24 saat içinde yanıt veriyoruz. 
              Acil durumlar için destek sayfamızı ziyaret edin.
            </p>
            <button
              onClick={() => navigate('/destek')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Destek Talebi Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Iletisim; 