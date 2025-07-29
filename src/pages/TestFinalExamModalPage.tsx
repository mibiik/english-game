import React, { useState } from 'react';
import FinalExamSupportModal from '../components/FinalExamSupportModal';

const TestFinalExamModalPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Final Sınavı Modal Test
        </h1>
        <p className="text-gray-600 mb-8">
          Bu sayfa final sınavı modalını test etmek için oluşturulmuştur.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Modalı Göster
        </button>
        
        <FinalExamSupportModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
        />
      </div>
    </div>
  );
};

export default TestFinalExamModalPage; 