import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Layout, Users, CreditCard, Settings, Sun, Moon, Plus, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const actions = [
    { id: 'dashboard', title: 'Go to Dashboard', icon: <Layout size={18} />, category: 'Navigation', action: () => navigate('/') },
    { id: 'payments', title: 'View Payments', icon: <CreditCard size={18} />, category: 'Navigation', action: () => navigate('/payments') },
    { id: 'users', title: 'Team Directory', icon: <Users size={18} />, category: 'Navigation', action: () => navigate('/users') },
    { id: 'analytics', title: 'Advanced Analytics', icon: <Sparkles size={18} />, category: 'Navigation', action: () => navigate('/analytics') },
    { id: 'settings', title: 'Account Settings', icon: <Settings size={18} />, category: 'Navigation', action: () => navigate('/settings') },
    { id: 'theme', title: `Switch to ${theme === 'light' ? 'Midnight' : 'Light'} Mode`, icon: theme === 'light' ? <Moon size={18} /> : <Sun size={18} />, category: 'Settings', action: () => { toggleTheme(); onClose(); } },
    { id: 'add-widget', title: 'Add New Widget', icon: <Plus size={18} />, category: 'Dashboard', action: () => { /* This might need a custom event or shared state */ onClose(); } },
  ];

  const filteredActions = actions.filter(action =>
    action.title.toLowerCase().includes(query.toLowerCase()) ||
    action.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === 'Enter') {
      filteredActions[selectedIndex]?.action();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Palette container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-surface border border-borderLight shadow-2xl rounded-2xl overflow-hidden overflow-y-auto transition-colors duration-300"
            onKeyDown={handleKeyDown}
          >
            {/* Input Area */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-borderLight bg-surface/80 backdrop-blur-md sticky top-0 z-10 transition-colors duration-300">
               <Search className="text-textTertiary" size={20} />
               <input
                 ref={inputRef}
                 type="text"
                 placeholder="Search actions or commands..."
                 className="flex-1 bg-transparent text-lg text-textPrimary outline-none placeholder:text-textTertiary"
                 value={query}
                 onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
               />
               <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surfaceHover border border-borderLight text-xs text-textTertiary font-mono">
                 <Command size={12} />
                 <span>K</span>
               </div>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1 scrollbar-hide">
              {filteredActions.length > 0 ? (
                filteredActions.map((action, index) => (
                  <button
                    key={action.id}
                    onClick={() => action.action()}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      index === selectedIndex ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:bg-surfaceHover'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                       <div className={`p-2 rounded-lg ${index === selectedIndex ? 'bg-primary/20 text-primary' : 'bg-surfaceHover text-textTertiary'}`}>
                          {action.icon}
                       </div>
                       <div className="text-left">
                          <p className={`font-bold text-sm ${index === selectedIndex ? 'text-primary' : 'text-textPrimary'}`}>{action.title}</p>
                          <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">{action.category}</p>
                       </div>
                    </div>
                    {index === selectedIndex && (
                       <div className="flex items-center gap-1 text-[10px] font-bold text-primary/60">
                          <span>Enter</span>
                          <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                             ↵
                          </motion.div>
                       </div>
                    )}
                  </button>
                ))
              ) : (
                <div className="py-12 text-center">
                   <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surfaceHover mb-4">
                      <Search size={24} className="text-textTertiary" />
                   </div>
                   <p className="text-textSecondary font-bold">No commands found for "{query}"</p>
                   <p className="text-xs text-textTertiary mt-1">Try searching for "theme" or "dashboard"</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-borderLight bg-surfaceHover/30 flex items-center justify-between text-[10px] text-textTertiary font-bold uppercase tracking-widest transition-all">
                <div className="flex items-center gap-4">
                   <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-surface border border-borderLight">↑↓</kbd> Navigate</span>
                   <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-surface border border-borderLight">Enter</kbd> Select</span>
                </div>
                <div className="flex items-center gap-1">
                   <kbd className="px-1.5 py-0.5 rounded bg-surface border border-borderLight">Esc</kbd> Close
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
