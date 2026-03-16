import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShoppingBag, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'order',
    title: 'High-Value Order Protocol',
    desc: 'New transaction from Canada cluster: $2,450.00',
    time: '2 mins ago',
    icon: <ShoppingBag className="text-primary" />,
    status: 'urgent'
  },
  {
    id: 2,
    type: 'growth',
    title: 'Revenue Milestone Synchronized',
    desc: 'Daily target achieved: 112% increase vs baseline.',
    time: '15 mins ago',
    icon: <TrendingUp className="text-emerald-500" />,
    status: 'success'
  },
  {
    id: 3,
    type: 'alert',
    title: 'Inventory Variance Detected',
    desc: 'Fiber Internet 1Gbps modules below threshold levels.',
    time: '1 hour ago',
    icon: <AlertCircle className="text-amber-500" />,
    status: 'warning'
  }
];

const NotificationPanel = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-3 w-96 bg-white border border-borderLight rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 overflow-hidden"
          >
            <div className="p-6 border-b border-borderLight flex items-center justify-between bg-surface">
               <div className="flex items-center gap-2">
                  <Bell size={16} className="text-primary" />
                  <h3 className="text-sm font-black text-textPrimary uppercase tracking-widest">Intelligence Feed</h3>
               </div>
               <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md">3 Active</span>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-4 space-y-3 scrollbar-hide">
               {NOTIFICATIONS.map((notif) => (
                 <motion.div 
                   key={notif.id}
                   whileHover={{ x: 5 }}
                   className="p-4 bg-white border border-borderLight rounded-2xl hover:bg-surfaceHover hover:border-primary/20 transition-all cursor-pointer group relative"
                 >
                    <div className="flex gap-4">
                       <div className="w-10 h-10 rounded-xl bg-surfaceHover flex items-center justify-center shrink-0 border border-borderLight group-hover:bg-white transition-colors">
                          {notif.icon}
                       </div>
                       <div className="space-y-1">
                          <p className="text-xs font-bold text-textPrimary leading-tight">
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-textTertiary leading-relaxed">
                            {notif.desc}
                          </p>
                          <div className="flex items-center gap-1.5 pt-1 text-[9px] font-bold text-textTertiary uppercase tracking-tighter">
                             <Clock size={10} strokeWidth={3} />
                             {notif.time}
                          </div>
                       </div>
                    </div>
                    {notif.status === 'urgent' && (
                       <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(71,179,147,0.8)]"></div>
                    )}
                 </motion.div>
               ))}
            </div>

            <div className="p-4 bg-surface border-t border-borderLight flex items-center justify-center">
               <button className="text-[10px] font-bold text-textTertiary hover:text-primary uppercase tracking-widest transition-colors">
                  View Full Event Log
               </button>
            </div>
          </motion.div>
          {/* Backdrop for mobile or easier closing */}
          <div 
            className="fixed inset-0 z-40 bg-transparent" 
            onClick={onClose}
          ></div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
