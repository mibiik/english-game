import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import app from '../config/firebase';

const ADMIN_PASSWORD = "admin123";
const db = getFirestore(app);

const AdminPanel: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const q = query(collection(db, "feedbacks"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeedbacks(data);
    }, (err) => setError("Geri bildirimler yüklenemedi: " + err.message));
    return () => unsubscribe();
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
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fca5a5", marginBottom: 32, textAlign: "center", letterSpacing: 1 }}>Admin Paneli <span style={{ color: "#fff" }}>- Geri Bildirimler</span></h1>
        {error && <div style={{ color: "#f87171", marginBottom: 16 }}>{error}</div>}
        {feedbacks.length === 0 && !error && <div style={{ textAlign: "center", color: "#fff", fontSize: 18 }}>Hiç geri bildirim yok.</div>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {feedbacks.map((fb, i) => (
            <li key={fb.id} style={{ borderBottom: "1px solid #7f1d1d33", marginBottom: 24, paddingBottom: 18, background: i % 2 === 0 ? "#3b0d0c" : "#4b1c1c", borderRadius: 10, boxShadow: "0 1px 4px #7f1d1d22", padding: 18, color: '#fff' }}>
              <div style={{ fontWeight: 700, color: "#fca5a5", fontSize: 18 }}><span style={{ marginRight: 8 }}>👤</span>{fb.name || <span style={{ color: "#aaa" }}>(Belirtilmemiş)</span>}</div>
              <div style={{ margin: "10px 0", color: "#fff", fontSize: 17 }}><span style={{ marginRight: 8 }}>💬</span>{fb.feedback}</div>
              <div style={{ fontSize: 13, color: "#fca5a5" }}><span style={{ marginRight: 8 }}>📅</span>{fb.date?.toDate ? fb.date.toDate().toLocaleString() : ''}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel; 