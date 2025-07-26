import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, orderBy, onSnapshot, doc, getDoc, setDoc } from "firebase/firestore";
import app from '../config/firebase';
import { sendMail } from '../services/emailService';
import { userService } from '../services/userService';
import { puter } from '../services/puterService';

const ADMIN_PASSWORD = "admin123";
const db = getFirestore(app);

const EMAILJS_SERVICE_ID = 'service_oczfg3h'; // Buraya kendi serviceId'ni gir
const EMAILJS_TEMPLATE_ID = 'your_template_id'; // Buraya kendi templateId'ni gir

const AdminPanel: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mailModal, setMailModal] = useState<{ open: boolean, to: string, name: string, feedbackId: string } | null>(null);
  const [mailSubject, setMailSubject] = useState('');
  const [mailMessage, setMailMessage] = useState('');
  const [mailSending, setMailSending] = useState(false);
  const [mailSuccess, setMailSuccess] = useState<string | null>(null);
  const [mailError, setMailError] = useState<string | null>(null);
  const [userSearchResults, setUserSearchResults] = useState<any[]>([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [aiReply, setAiReply] = useState<string>('');
  const [aiReplyLoading, setAiReplyLoading] = useState(false);
  const [aiReplyError, setAiReplyError] = useState<string | null>(null);
  const [aiReplyTarget, setAiReplyTarget] = useState<{ to: string, name: string, feedback: string } | null>(null);
  // Serbest e-posta alanı
  const [freeMailTo, setFreeMailTo] = useState('');
  const [freeMailSubject, setFreeMailSubject] = useState('');
  const [freeMailMessage, setFreeMailMessage] = useState('');
  const [freeMailSending, setFreeMailSending] = useState(false);
  const [freeMailSuccess, setFreeMailSuccess] = useState<string | null>(null);
  const [freeMailError, setFreeMailError] = useState<string | null>(null);
  
  // Defne Modal Yönetimi
  const [defneModalContent, setDefneModalContent] = useState({
    title: "EŞLEŞTİRME OYUNUN CADISI GELDİ",
    message: "AL SANA SÜRESİZ OYNA BAKALIM",
    imageUrl: "/assets/aaaaaaaadwü/ordekbakimi2.jpg",
    isActive: true
  });
  const [defneModalLoading, setDefneModalLoading] = useState(false);
  const [defneModalSuccess, setDefneModalSuccess] = useState<string | null>(null);
  const [defneModalError, setDefneModalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const q = query(collection(db, "feedbacks"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeedbacks(data);
    }, (err) => setError("Geri bildirimler yüklenemedi: " + err.message));
    return () => unsubscribe();
  }, [isAuthenticated]);

  // Defne Modal içeriğini yükle
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchDefneContent = async () => {
      try {
        const defneDoc = doc(db, 'adminContent', 'defneModal');
        const docSnap = await getDoc(defneDoc);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDefneModalContent({
            title: data.title || "EŞLEŞTİRME OYUNUN CADISI GELDİ",
            message: data.message || "AL SANA SÜRESİZ OYNA BAKALIM",
            imageUrl: data.imageUrl || "/assets/aaaaaaaadwü/ordekbakimi2.jpg",
            isActive: data.isActive !== undefined ? data.isActive : true
          });
        }
      } catch (error) {
        console.error('Defne modal içeriği yüklenirken hata:', error);
      }
    };

    fetchDefneContent();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Şifre yanlış!");
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a1a1a 0%, #7f1d1d 100%)" }}>
        <form onSubmit={handleLogin} style={{ background: "#2d0101", padding: 36, borderRadius: 16, boxShadow: "0 4px 32px #7f1d1d80", minWidth: 340 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fca5a5", marginBottom: 24, textAlign: "center" }}>Admin Girişi</h2>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Şifre"
            style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #7f1d1d", marginBottom: 16, fontSize: 16, background: '#3b0d0c', color: '#fff' }}
          />
          {error && <div style={{ color: "#f87171", marginBottom: 12, textAlign: "center" }}>{error}</div>}
          <button type="submit" style={{ width: "100%", padding: 12, borderRadius: 8, background: "linear-gradient(90deg, #7f1d1d 0%, #b91c1c 100%)", color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", boxShadow: "0 2px 8px #7f1d1d33" }}>
            Giriş Yap
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a1a1a 0%, #7f1d1d 100%)", padding: "40px 0" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: 32, background: "#2d0101", borderRadius: 18, boxShadow: "0 4px 32px #7f1d1d80" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fca5a5", marginBottom: 32, textAlign: "center", letterSpacing: 1 }}>Admin Paneli <span style={{ color: "#fff" }}>- Geri Bildirimler & İçerik Yönetimi</span></h1>
        {/* Serbest e-posta gönderme alanı */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 32, boxShadow: '0 2px 8px #7f1d1d22', color: '#222' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, color: '#7f1d1d' }}>Serbest E-Posta Gönder</h2>
          <input type="email" value={freeMailTo} onChange={e => setFreeMailTo(e.target.value)} placeholder="Alıcı E-posta" style={{ width: '100%', padding: 10, borderRadius: 7, border: '1px solid #fca5a5', marginBottom: 10, fontSize: 15 }} />
          <input type="text" value={freeMailSubject} onChange={e => setFreeMailSubject(e.target.value)} placeholder="Konu" style={{ width: '100%', padding: 10, borderRadius: 7, border: '1px solid #fca5a5', marginBottom: 10, fontSize: 15 }} />
          <textarea value={freeMailMessage} onChange={e => setFreeMailMessage(e.target.value)} placeholder="Mesajınız" rows={4} style={{ width: '100%', padding: 10, borderRadius: 7, border: '1px solid #fca5a5', marginBottom: 10, fontSize: 15 }} />
          <button disabled={freeMailSending || !freeMailTo} onClick={async () => {
            setFreeMailSending(true);
            setFreeMailSuccess(null);
            setFreeMailError(null);
            try {
              await sendMail({
                serviceId: EMAILJS_SERVICE_ID,
                templateId: EMAILJS_TEMPLATE_ID,
                to_email: freeMailTo,
                subject: freeMailSubject,
                message: freeMailMessage
              });
              setFreeMailSuccess('Mail başarıyla gönderildi!');
              setFreeMailTo('');
              setFreeMailSubject('');
              setFreeMailMessage('');
            } catch (err) {
              setFreeMailError('Mail gönderilemedi: ' + (err?.text || err?.message || err));
            }
            setFreeMailSending(false);
          }} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#fca5a5', color: '#2d0101', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px #7f1d1d33', marginBottom: 8 }}>{freeMailSending ? 'Gönderiliyor...' : 'Gönder'}</button>
          {freeMailSuccess && <div style={{ color: 'green', marginTop: 8 }}>{freeMailSuccess}</div>}
          {freeMailError && <div style={{ color: 'red', marginTop: 8 }}>{freeMailError}</div>}
        </div>
        
        {/* Defne Modal Yönetimi */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 32, boxShadow: '0 2px 8px #7f1d1d22', color: '#222' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, color: '#7f1d1d' }}>👑 Defne Special Modal Yönetimi</h2>
          <input 
            type="text" 
            value={defneModalContent.title} 
            onChange={e => setDefneModalContent({...defneModalContent, title: e.target.value})} 
            placeholder="Modal Başlığı" 
            style={{ width: '100%', padding: 10, borderRadius: 7, border: '1px solid #fca5a5', marginBottom: 10, fontSize: 15 }} 
          />
          <input 
            type="text" 
            value={defneModalContent.message} 
            onChange={e => setDefneModalContent({...defneModalContent, message: e.target.value})} 
            placeholder="Modal Mesajı" 
            style={{ width: '100%', padding: 10, borderRadius: 7, border: '1px solid #fca5a5', marginBottom: 10, fontSize: 15 }} 
          />
          <input 
            type="text" 
            value={defneModalContent.imageUrl} 
            onChange={e => setDefneModalContent({...defneModalContent, imageUrl: e.target.value})} 
            placeholder="Resim URL'si" 
            style={{ width: '100%', padding: 10, borderRadius: 7, border: '1px solid #fca5a5', marginBottom: 10, fontSize: 15 }} 
          />
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
              <input 
                type="checkbox" 
                checked={defneModalContent.isActive} 
                onChange={e => setDefneModalContent({...defneModalContent, isActive: e.target.checked})} 
                style={{ width: 16, height: 16 }}
              />
              Modal Aktif
            </label>
          </div>
          <button 
            disabled={defneModalLoading} 
            onClick={async () => {
              setDefneModalLoading(true);
              setDefneModalSuccess(null);
              setDefneModalError(null);
              try {
                const defneDoc = doc(db, 'adminContent', 'defneModal');
                await setDoc(defneDoc, defneModalContent);
                setDefneModalSuccess('Defne modal içeriği başarıyla güncellendi!');
              } catch (err: any) {
                setDefneModalError('Güncelleme başarısız: ' + (err?.message || err));
              }
              setDefneModalLoading(false);
            }} 
            style={{ width: '100%', padding: 12, borderRadius: 8, background: '#fca5a5', color: '#2d0101', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px #7f1d1d33', marginBottom: 8 }}
          >
            {defneModalLoading ? 'Güncelleniyor...' : 'Defne Modal İçeriğini Güncelle'}
          </button>
          {defneModalSuccess && <div style={{ color: 'green', marginTop: 8 }}>{defneModalSuccess}</div>}
          {defneModalError && <div style={{ color: 'red', marginTop: 8 }}>{defneModalError}</div>}
        </div>
        {/* Feedback listesi */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {feedbacks.map((fb, i) => (
            <li key={fb.id} style={{ borderBottom: "1px solid #7f1d1d33", marginBottom: 24, paddingBottom: 18, background: i % 2 === 0 ? "#3b0d0c" : "#4b1c1c", borderRadius: 10, boxShadow: "0 1px 4px #7f1d1d22", padding: 18, color: '#fff' }}>
              <div style={{ fontWeight: 700, color: "#fca5a5", fontSize: 18 }}><span style={{ marginRight: 8 }}>👤</span>{fb.name || <span style={{ color: "#aaa" }}>(Belirtilmemiş)</span>}</div>
              <div style={{ margin: "10px 0", color: "#fff", fontSize: 17 }}><span style={{ marginRight: 8 }}>💬</span>{fb.feedback}</div>
              <div style={{ fontSize: 13, color: "#fca5a5" }}><span style={{ marginRight: 8 }}>📅</span>{fb.date?.toDate ? fb.date.toDate().toLocaleString() : ''}</div>
              <button onClick={async () => {
                if (fb.email) {
                  setMailModal({ open: true, to: fb.email, name: fb.name || '', feedbackId: fb.id });
                } else if (fb.name) {
                  setUserSearchLoading(true);
                  const results = await userService.searchUsers(fb.name);
                  setUserSearchResults(results);
                  setUserSearchLoading(false);
                  if (results.length === 1) {
                    setMailModal({ open: true, to: results[0].email, name: results[0].displayName, feedbackId: fb.id });
                  } else if (results.length > 1) {
                    setMailModal({ open: true, to: '', name: fb.name, feedbackId: fb.id });
                  } else {
                    setMailModal({ open: true, to: '', name: fb.name, feedbackId: fb.id });
                  }
                } else {
                  setMailModal({ open: true, to: '', name: '', feedbackId: fb.id });
                }
              }} style={{ marginTop: 10, padding: '8px 18px', borderRadius: 8, background: '#fca5a5', color: '#2d0101', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 15 }}>Kullanıcıya Mail Gönder</button>
              <button onClick={async () => {
                setAiReplyLoading(true);
                setAiReplyError(null);
                setAiReply('');
                setAiReplyTarget(null);
                try {
                  const aiRes = await puter.generateFeedbackReply(fb.feedback);
                  setAiReply(aiRes);
                  setAiReplyTarget({ to: fb.email || '', name: fb.name || '', feedback: fb.feedback });
                } catch (err) {
                  setAiReplyError('AI cevabı alınamadı: ' + (err?.message || err));
                }
                setAiReplyLoading(false);
              }} style={{ marginTop: 10, marginLeft: 10, padding: '8px 18px', borderRadius: 8, background: '#fff', color: '#7f1d1d', fontWeight: 700, border: '1px solid #fca5a5', cursor: 'pointer', fontSize: 15 }}>AI ile Cevap Oluştur</button>
            </li>
          ))}
        </ul>
        {/* AI cevabı modalı */}
        {aiReplyTarget && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000a', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 340, maxWidth: 500, boxShadow: '0 4px 32px #7f1d1d80', color: '#222', position: 'relative' }}>
              <button onClick={() => { setAiReplyTarget(null); setAiReply(''); }} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#7f1d1d', cursor: 'pointer' }}>×</button>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>AI Cevap Önerisi</h2>
              <div style={{ fontSize: 15, marginBottom: 8 }}><b>Feedback:</b> {aiReplyTarget.feedback}</div>
              {aiReplyLoading ? <div style={{ color: '#fca5a5', marginBottom: 8 }}>AI cevabı oluşturuluyor...</div> :
                aiReplyError ? <div style={{ color: 'red', marginBottom: 8 }}>{aiReplyError}</div> :
                <textarea value={aiReply} onChange={e => setAiReply(e.target.value)} rows={6} style={{ width: '100%', padding: 10, borderRadius: 7, border: '1px solid #fca5a5', marginBottom: 12, fontSize: 15 }} />
              }
              <button disabled={!aiReply || aiReplyLoading || (!aiReplyTarget.to && !aiReplyTarget.name)} onClick={async () => {
                let to = aiReplyTarget.to;
                if (!to && aiReplyTarget.name) {
                  setUserSearchLoading(true);
                  const results = await userService.searchUsers(aiReplyTarget.name);
                  setUserSearchLoading(false);
                  if (results.length === 1) to = results[0].email;
                  else return alert('Kullanıcı e-posta adresi bulunamadı veya birden fazla eşleşme var.');
                }
                if (!to) return alert('Kullanıcı e-posta adresi bulunamadı.');
                setFreeMailSending(true);
                setFreeMailSuccess(null);
                setFreeMailError(null);
                try {
                  await sendMail({
                    serviceId: EMAILJS_SERVICE_ID,
                    templateId: EMAILJS_TEMPLATE_ID,
                    to_email: to,
                    subject: 'Geri Bildiriminize Yanıt',
                    message: aiReply
                  });
                  setFreeMailSuccess('Mail başarıyla gönderildi!');
                  setAiReplyTarget(null);
                  setAiReply('');
                } catch (err) {
                  setFreeMailError('Mail gönderilemedi: ' + (err?.text || err?.message || err));
                }
                setFreeMailSending(false);
              }} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#fca5a5', color: '#2d0101', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px #7f1d1d33', marginBottom: 8 }}>{aiReplyLoading ? 'Gönderiliyor...' : 'AI Cevabını Gönder'}</button>
              {freeMailSuccess && <div style={{ color: 'green', marginTop: 8 }}>{freeMailSuccess}</div>}
              {freeMailError && <div style={{ color: 'red', marginTop: 8 }}>{freeMailError}</div>}
            </div>
          </div>
        )}
        {/* Mail Gönderme Modalı */}
        {mailModal?.open && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000a', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 340, maxWidth: 400, boxShadow: '0 4px 32px #7f1d1d80', color: '#222', position: 'relative' }}>
              <button onClick={() => { setMailModal(null); setUserSearchResults([]); }} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#7f1d1d', cursor: 'pointer' }}>×</button>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Kullanıcıya Mail Gönder</h2>
              {!mailModal.to && userSearchResults.length > 1 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>Birden fazla kullanıcı bulundu, lütfen seçin:</div>
                  {userSearchLoading && <div style={{ color: '#fca5a5', marginBottom: 8 }}>Kullanıcılar yükleniyor...</div>}
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {userSearchResults.map(u => (
                      <li key={u.userId} style={{ marginBottom: 6 }}>
                        <button onClick={() => setMailModal({ ...mailModal, to: u.email, name: u.displayName })} style={{ padding: '6px 12px', borderRadius: 6, background: '#fca5a5', color: '#2d0101', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 14 }}>{u.displayName} ({u.email})</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div style={{ fontSize: 15, marginBottom: 8 }}><b>Alıcı:</b> {mailModal.name} {mailModal.to && <>({mailModal.to})</>}</div>
              <input type="text" value={mailSubject} onChange={e => setMailSubject(e.target.value)} placeholder="Konu" style={{ width: '100%', padding: 10, borderRadius: 7, border: '1px solid #fca5a5', marginBottom: 12, fontSize: 15 }} />
              <textarea value={mailMessage} onChange={e => setMailMessage(e.target.value)} placeholder="Mesajınız" rows={5} style={{ width: '100%', padding: 10, borderRadius: 7, border: '1px solid #fca5a5', marginBottom: 12, fontSize: 15 }} />
              <button disabled={mailSending || !mailModal.to} onClick={async () => {
                setMailSending(true);
                setMailSuccess(null);
                setMailError(null);
                try {
                  await sendMail({
                    serviceId: EMAILJS_SERVICE_ID,
                    templateId: EMAILJS_TEMPLATE_ID,
                    to_email: mailModal.to,
                    subject: mailSubject,
                    message: mailMessage
                  });
                  setMailSuccess('Mail başarıyla gönderildi!');
                  setMailSubject('');
                  setMailMessage('');
                } catch (err) {
                  setMailError('Mail gönderilemedi: ' + (err?.text || err?.message || err));
                }
                setMailSending(false);
              }} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#fca5a5', color: '#2d0101', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px #7f1d1d33', marginBottom: 8 }}>{mailSending ? 'Gönderiliyor...' : 'Gönder'}</button>
              {mailSuccess && <div style={{ color: 'green', marginTop: 8 }}>{mailSuccess}</div>}
              {mailError && <div style={{ color: 'red', marginTop: 8 }}>{mailError}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 