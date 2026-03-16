import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const SideDrawer = ({ isOpen, onClose, title, description, children }) => {
  // Prevent scrolling on body when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-colors duration-300"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-surface border-l border-borderLight shadow-2xl z-[60] flex flex-col transition-colors duration-300"
          >
            {/* Header */}
            <div className="p-6 border-b border-borderLight flex items-center justify-between bg-surface/50 backdrop-blur-md sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-textPrimary leading-none">{title}</h2>
                {description && (
                  <p className="text-sm text-textSecondary mt-2">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surfaceHover rounded-full transition-all text-textSecondary hover:text-textPrimary"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {children}
            </div>

            {/* Optional Footer (can be passed in children or managed here if needed) */}
            {/* <div className="p-6 border-t border-borderLight bg-surfaceHover/30">
                <button onClick={onClose} className="w-full py-3 bg-primary text-white rounded-xl font-bold">
                    Close
                </button>
            </div> */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideDrawer;
