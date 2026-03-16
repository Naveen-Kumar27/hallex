import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }}
             onClick={onClose}
             className="absolute inset-0 bg-textPrimary/20 backdrop-blur-sm"
          />
          <motion.div 
             initial={{ opacity: 0, scale: 0.95, y: 10 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.95, y: 10 }}
             transition={{ duration: 0.2 }}
             className="relative w-full max-w-md bg-white border border-borderLight rounded-2xl shadow-xl overflow-hidden pointer-events-auto"
          >
             <div className="flex items-center justify-between p-5 border-b border-borderLight">
                <h3 className="text-lg font-semibold text-textPrimary tracking-tight">{title}</h3>
                <button onClick={onClose} className="p-1.5 rounded-lg text-textTertiary hover:text-textPrimary hover:bg-surfaceHover transition-all">
                   <X className="h-5 w-5" />
                </button>
             </div>
             <div className="p-6">
                {children}
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

