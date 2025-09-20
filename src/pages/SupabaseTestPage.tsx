import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

const SupabaseTestPage: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      // Supabase bağlantısını test et
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);

      if (error) {
        setError(`Supabase Error: ${error.message}`);
        setConnectionStatus('❌ Bağlantı Başarısız');
      } else {
        setConnectionStatus('✅ Supabase Bağlantısı Başarılı');
      }
    } catch (err: any) {
      setError(`Connection Error: ${err.message}`);
      setConnectionStatus('❌ Bağlantı Başarısız');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-white mb-6">Supabase Bağlantı Testi</h1>
        
        <div className="mb-4">
          <div className="text-lg font-semibold text-cyan-400 mb-2">
            {connectionStatus}
          </div>
          
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="text-gray-300 text-sm space-y-2">
          <p>• Supabase projesi oluşturuldu mu?</p>
          <p>• Environment variables ayarlandı mı?</p>
          <p>• Veritabanı şeması kuruldu mu?</p>
        </div>

        <button
          onClick={testSupabaseConnection}
          className="mt-6 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
        >
          Tekrar Test Et
        </button>
      </div>
    </div>
  );
};

export default SupabaseTestPage;
