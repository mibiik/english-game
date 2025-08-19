import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageCircle, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Iletisim: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    alert('Mesajınız gönderildi! En kısa sürede size dönüş yapacağız.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "E-posta",
      value: "destek@wordplay.com",
      link: "mailto:destek@wordplay.com"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Telefon",
      value: "+90 (212) 338 10 00",
      link: "tel:+902123381000"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Adres",
      value: "Koç Üniversitesi, İstanbul",
      link: "#"
    }
  ];

  const socialLinks = [
    { icon: <Instagram className="w-4 h-4" />, href: "https://instagram.com/wordplay", label: "Instagram" },
    { icon: <Twitter className="w-4 h-4" />, href: "https://twitter.com/wordplay", label: "Twitter" },
    { icon: <Linkedin className="w-4 h-4" />, href: "https://linkedin.com/company/wordplay", label: "LinkedIn" }
  ];

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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Mesaj Gönder
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">İletişim Bilgileri</h3>
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-neutral-800/30 rounded-xl border border-white/10"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{info.title}</h4>
                    <a 
                      href={info.link} 
                      className="text-neutral-300 hover:text-blue-400 transition-colors"
                    >
                      {info.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Sosyal Medya</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-neutral-800 rounded-xl border border-white/20 flex items-center justify-center text-neutral-300 hover:text-white hover:border-white/40 transition-colors"
                    title={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
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
          </div>
        </div>

        {/* Response Time Info */}
        <div className="mt-16 text-center">
          <div className="bg-neutral-800/50 rounded-2xl p-8 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">Hızlı Yanıt Garantisi</h3>
            <p className="text-neutral-300 mb-6">
              Mesajlarınıza 24 saat içinde yanıt veriyoruz. Acil durumlar için telefon ile arayabilirsiniz.
            </p>
            <button
              onClick={() => navigate('/iletisim')}
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