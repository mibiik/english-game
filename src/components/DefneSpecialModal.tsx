import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../config/firebase';

interface DefneSpecialModalProps {
  onClose: () => void;
}

interface DefneModalContent {
  title: string;
  message: string;
  imageUrl: string;
  isActive: boolean;
}

const DefneSpecialModal: React.FC<DefneSpecialModalProps> = ({ onClose }) => {
  const [content, setContent] = useState<DefneModalContent>({
    title: "EŞLEŞTİRME OYUNUN CADISI GELDİ",
    message: "AL SANA SÜRESİZ OYNA BAKALIM",
    imageUrl: "/assets/aaaaaaaadwü/@20250723_135406.jpg",
    isActive: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDefneContent = async () => {
      try {
        const db = getFirestore(app);
        const defneDoc = doc(db, 'adminContent', 'defneModal');
        const docSnap = await getDoc(defneDoc);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as DefneModalContent;
          if (data.isActive) {
            setContent(data);
          }
        }
      } catch (error) {
        console.error('Defne modal içeriği yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefneContent();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 shadow-2xl min-w-[320px] max-w-[90vw] relative border-2 border-pink-400">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-400"></div>
            <p className="text-pink-600">Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!content.isActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl min-w-[320px] max-w-[90vw] relative border-2 border-pink-400">
        <button onClick={onClose} className="absolute top-3 right-3 text-pink-400 text-2xl font-bold hover:text-pink-600">×</button>
        <div className="flex flex-col items-center gap-3">
          <img src={content.imageUrl} alt="Ördek" className="w-32 h-32 object-cover rounded-full border-4 border-pink-200 shadow mb-2" />
          <div className="text-4xl">👑</div>
          <h2 className="text-2xl font-bold text-pink-600 text-center">{content.title}</h2>
          <p className="text-pink-700 text-center font-bold">{content.message}</p>
        </div>
      </div>
    </div>
  );
};

export default DefneSpecialModal; 