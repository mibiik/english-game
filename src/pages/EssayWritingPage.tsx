import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EssayWritingPage: React.FC = () => {
  const [essay, setEssay] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleEssayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setEssay(text);
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Essay analizi burada yapılacak
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

    return (
    <div className="min-h-screen bg-gradient-to-br from-[#070a1a] via-[#0a0d1a] to-[#01020a] text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-wider font-bebas uppercase mb-4 drop-shadow-[0_0_18px_rgba(0,190,255,0.25)]">
            Essay Writing
          </h1>
          <p className="text-lg text-gray-300 font-inter leading-relaxed max-w-2xl mx-auto">
            Write essays and improve your English writing skills with our AI-powered feedback system.
          </p>
        </motion.div>

          <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Essay
                </label>
              <textarea
                value={essay}
              onChange={handleEssayChange}
              placeholder="Write your essay here..."
              className="w-full h-96 p-4 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none"
              />
            </div>

          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-400">
              Word Count: <span className="text-blue-400 font-semibold">{wordCount}</span>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={essay.trim().length === 0 || isAnalyzing}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Essay'}
            </button>
      </div>

          {isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-300">Analyzing your essay...</p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">Grammar Check</h3>
            <p className="text-gray-300 text-sm">Check your grammar and sentence structure</p>
              </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">Vocabulary Enhancement</h3>
            <p className="text-gray-300 text-sm">Improve your word choice and variety</p>
            </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-lg border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">Writing Tips</h3>
            <p className="text-gray-300 text-sm">Get personalized writing suggestions</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
};

export default EssayWritingPage; 








