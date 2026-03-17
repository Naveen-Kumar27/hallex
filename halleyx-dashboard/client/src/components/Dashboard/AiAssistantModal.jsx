import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Loader2, Sparkles, MessageSquare, Zap, Target, TrendingUp } from 'lucide-react';
import { analyticsApi } from '../../api';

const AiAssistantModal = ({ isOpen, onClose, onDashboardCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hello! I'm Workspan AI. I can analyze your business data or even build custom dashboards for you. How can I help today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!prompt.trim() || isLoading) return;

    const userMessage = { role: 'user', text: prompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const response = await analyticsApi.aiAnalyze(prompt, history);
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting to my brain. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuildDashboard = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    
    try {
      const newDashboard = await analyticsApi.aiGenerate(prompt);
      onDashboardCreated(newDashboard);
      onClose();
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Failed to build dashboard. " + err.message }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] border border-borderLight animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-borderLight bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-textPrimary tracking-tight">Workspan AI</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Active Intelligence</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-borderLight">
            <X size={20} className="text-textSecondary" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface/30">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-secondary text-white' : 'bg-primary text-white'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-secondary text-white border-secondary/20' 
                    : 'bg-white text-textPrimary border-borderLight'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-borderLight p-4 rounded-2xl shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-xs font-bold text-textSecondary uppercase tracking-widest">Processing...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar border-t border-borderLight bg-white">
          {[
            { label: 'Analyze Revenue', icon: TrendingUp },
            { label: 'Top Customers', icon: Target },
            { label: 'Growth Plan', icon: Zap }
          ].map((chip) => (
            <button 
              key={chip.label}
              onClick={() => setPrompt(chip.label)}
              className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-primary/5 border border-borderLight hover:border-primary/20 rounded-xl text-xs font-bold text-textSecondary hover:text-primary transition-all whitespace-nowrap"
            >
              <chip.icon size={14} />
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-borderLight">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything or describe a dashboard you want to build..."
              className="w-full pl-4 pr-32 py-4 bg-surface border border-borderLight rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all min-h-[56px] h-[56px] overflow-hidden"
              rows={1}
            />
            <div className="absolute right-2 top-1.5 flex gap-1.5">
              <button
                onClick={handleBuildDashboard}
                disabled={!prompt.trim() || isGenerating}
                className="px-4 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:hover:bg-primary/10 disabled:hover:text-primary flex items-center gap-2"
              >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Build
              </button>
              <button
                onClick={handleSend}
                disabled={!prompt.trim() || isLoading}
                className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-30 active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Architecting Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              <div className="relative w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 overflow-hidden">
                <Bot size={40} className="animate-bounce" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-textPrimary mb-2 tracking-tight">Architecting Protocol</h3>
            <p className="text-textSecondary text-sm max-w-xs leading-relaxed font-bold">
              Workspan AI is analyzing your request and synthesizing a custom analytical environment...
            </p>
            <div className="mt-8 flex gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiAssistantModal;
