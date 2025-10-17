import React, { useState, useEffect } from 'react';
import { HiX, HiSparkles } from 'react-icons/hi';

interface AIServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
}

const AIServiceModal: React.FC<AIServiceModalProps> = ({ isOpen, onClose, serviceName }) => {
  useEffect(() => {
    if (isOpen) {
      // 3 saniye sonra otomatik olarak kapat
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4 border border-gray-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiSparkles className="w-6 h-6 text-blue-600" />
          </div>
          
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Yapay Zeka Servisi
          </h2>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Birazdan açılacak olan sekme yapay zeka servisi başlatacaktır. 
            <strong className="text-gray-800"> Sekmeyi kapatmayınız.</strong>
          </p>
          
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full animate-pulse" style={{width: '70%'}}></div>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Otomatik olarak açılacak...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIServiceModal;
