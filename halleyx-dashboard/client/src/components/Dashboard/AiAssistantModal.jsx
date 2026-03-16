import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, LayoutDashboard, MessageSquare } from 'lucide-react';
import { analyticsApi } from '../../api';
import toast from 'react-hot-toast';

const AiAssistantModal = ({ isOpen, onClose, initialPrompt, onGenerated }) => {
  const [prompt, setPrompt] = useState(initialPrompt || "");
  const [history, setHistory] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen && initialPrompt && !analysis) {
        handleAnalyze(initialPrompt);
    }
  }, [isOpen]);

  const handleAnalyze = async (text) => {
    setIsAnalyzing(true);
    try {
      const data = await analyticsApi.aiAnalyze(text, history);
      setAnalysis(data);
      setHistory(prev => [...prev, { role: 'user', content: text }, { role: 'assistant', content: data.summary }]);
    } catch (err) {
      toast.error("AI Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const dashboard = await analyticsApi.aiGenerate(prompt);
      toast.success("AI Synthesis Complete");
      onGenerated(dashboard);
      onClose();
    } catch (err) {
      toast.error("Generation failed. Try refining your request.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-surface border border-borderLight w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-borderLight flex items-center justify-between bg-surfaceActive/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Bot className="text-emerald-500" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-textPrimary">Halleyx AI Assistant</h2>
              <p className="text-xs text-textSecondary uppercase tracking-widest font-bold">Requirement Analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surfaceActive rounded-xl transition-colors text-textTertiary">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[60vh] overflow-y-auto space-y-8">
          {!analysis && !isAnalyzing && (
            <div className="text-center py-12 space-y-4">
               <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                 <Sparkles className="text-primary" size={32} />
               </div>
               <h3 className="text-xl font-bold text-textPrimary">What would you like to analyze?</h3>
               <p className="text-textSecondary text-sm max-w-xs mx-auto">Tell me about your business goals, and I'll architect a dashboard for you.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <p className="text-emerald-600 font-bold text-xs tracking-widest uppercase animate-pulse">Analyzing Requirements...</p>
            </div>
          )}

          {analysis && !isAnalyzing && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl">
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <MessageSquare size={14} /> AI Interpretation
                    </h4>
                    <p className="text-emerald-900 font-medium leading-relaxed">{analysis.summary}</p>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-textSecondary uppercase tracking-widest">Clarifying Questions</h4>
                    <div className="grid gap-3">
                        {analysis.questions.map((q, i) => (
                           <div key={i} className="flex gap-3 items-start p-4 bg-surfaceActive/50 rounded-xl border border-borderLight group hover:border-primary/30 transition-all">
                              <span className="w-6 h-6 bg-primary/10 text-primary flex items-center justify-center rounded-lg text-xs font-bold">{i+1}</span>
                              <p className="text-sm text-textPrimary leading-relaxed">{q}</p>
                           </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-textSecondary uppercase tracking-widest">Proposed Structure</h4>
                    <div className="flex flex-wrap gap-2">
                        {analysis.suggestedWidgets.map((w, i) => (
                           <span key={i} className="px-3 py-1.5 bg-white border border-borderLight rounded-full text-[11px] font-bold text-textPrimary flex items-center gap-2 shadow-sm">
                              <LayoutDashboard size={12} className="text-primary" />
                              {w.title} ({w.type.toUpperCase()})
                           </span>
                        ))}
                    </div>
                </div>
             </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-borderLight bg-surfaceActive/30">
          <div className="flex gap-3">
             <div className="relative flex-1">
                <input 
                  type="text"
                  placeholder="Provide more details or refine..."
                  className="w-full bg-white border border-borderLight p-4 pr-12 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-medium"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(prompt)}
                />
                <button 
                  onClick={() => handleAnalyze(prompt)}
                  disabled={isAnalyzing || !prompt.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all disabled:opacity-30"
                >
                  <Send size={18} />
                </button>
             </div>
             <button 
               onClick={handleGenerate}
               disabled={isGenerating || !analysis}
               className="px-8 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none min-w-[180px] justify-center"
             >
                {isGenerating ? (
                   <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                   <><Sparkles size={18} /> Generate</>
                )}
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AiAssistantModal;
