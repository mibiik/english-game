import React, { useState } from 'react';
import FinalExamSupportModal from './FinalExamSupportModal';

const TestFinalExamModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Final Sınavı Modal Test Sayfası
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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

export default TestFinalExamModal; 