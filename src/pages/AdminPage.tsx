import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { HiArrowLeft, HiRefresh } from 'react-icons/hi';
import { Link } from 'react-router-dom';

interface Feedback {
  id: string;
  user_id: string;
  name: string;
  feedback: string;
  created_at: string;
}

const AdminPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Filter out feedbacks with missing name
      const validFeedbacks = (data || []).filter(feedback => 
        feedback.name && 
        feedback.name.trim() !== '' && 
        feedback.feedback && 
        feedback.feedback.trim() !== ''
      );
      
      setFeedbacks(validFeedbacks);
    } catch (err: any) {
      console.error('Error fetching feedbacks:', err);
      setError('Geri bildirimler yüklenirken hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070a1a] via-[#0a0d1a] to-[#01020a] text-gray-100">
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700/80 to-gray-600/80 hover:from-gray-600/80 hover:to-gray-500/80 text-white rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-600/50 hover:border-gray-500/50 backdrop-blur-sm"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>Ana Sayfa</span>
          </Link>
          
          <button
            onClick={fetchFeedbacks}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Yenile</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-wider font-bebas uppercase mb-4 drop-shadow-[0_0_18px_rgba(0,190,255,0.25)]">
            Admin Paneli
          </h1>
          <p className="text-lg text-gray-300 font-inter leading-relaxed max-w-2xl mx-auto">
            Kullanıcı geri bildirimlerini görüntüleyin ve yönetin
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6 text-center">
            <p className="text-red-300">{error}</p>
            <button
              onClick={fetchFeedbacks}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="bg-gray-800/20 border border-gray-600/50 rounded-xl p-8 text-center">
            <p className="text-gray-400 text-lg">Henüz geri bildirim bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/60 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {(feedback.name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{feedback.name || 'Anonim Kullanıcı'}</h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(feedback.created_at).toLocaleString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {feedback.feedback}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
