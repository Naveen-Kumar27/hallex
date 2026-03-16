import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, LineChart, PieChart, Activity, GripVertical } from 'lucide-react';

const WIDGET_CATEGORIES = [
  {
    category: 'Charts',
    items: [
      { type: 'Bar Chart', icon: <BarChart className="w-5 h-5 text-primary" /> },
      { type: 'Line Chart', icon: <LineChart className="w-5 h-5 text-secondary" /> },
      { type: 'Pie Chart', icon: <PieChart className="w-5 h-5 text-emerald-500" /> },
      { type: 'Area Chart', icon: <Activity className="w-5 h-5 text-amber-500" /> },
    ]
  },
  {
    category: 'Tables',
    items: [
      { type: 'Table', icon: <Activity className="w-5 h-5 text-textTertiary" /> },
    ]
  },
  {
    category: 'KPIs',
    items: [
      { type: 'KPI Value', icon: <Activity className="w-5 h-5 text-emerald-500" /> },
    ]
  }
];

const WidgetLibrary = ({ isEditing }) => {
  return (
    <AnimatePresence>
      {isEditing && (
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="bg-white border-r border-borderLight flex flex-col h-full overflow-hidden flex-shrink-0 z-20"
        >
          <div className="p-5 border-b border-borderLight shrink-0">
             <h3 className="text-textPrimary font-bold text-lg tracking-tight">Widget Library</h3>
             <p className="text-xs text-textTertiary mt-1 leading-relaxed">Drag components into the workspace to build your dashboard.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
             {WIDGET_CATEGORIES.map((cat, idx) => (
                <div key={idx}>
                   <h4 className="text-[10px] font-bold text-textTertiary uppercase tracking-widest mb-3 pl-2">{cat.category}</h4>
                   <div className="space-y-2">
                      {cat.items.map((item, itemIdx) => (
                         <div 
                            key={itemIdx}
                            draggable
                            onDragStart={(e) => {
                               e.dataTransfer.setData("text/plain", item.type);
                               e.dataTransfer.effectAllowed = 'copy';
                               e.currentTarget.style.opacity = '0.4';
                            }}
                            onDragEnd={(e) => {
                               e.currentTarget.style.opacity = '1';
                            }}
                            className="bg-white border border-borderLight rounded-xl p-3 flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm transition-all group layout-item-draggable"
                         >
                            <div className="flex items-center gap-3">
                               {item.icon}
                               <span className="text-sm font-bold text-textSecondary group-hover:text-textPrimary">{item.type}</span>
                            </div>
                            <GripVertical className="w-4 h-4 text-textTertiary group-hover:text-textSecondary opacity-40 group-hover:opacity-100 transition-all" />
                         </div>
                      ))}
                   </div>
                </div>
             ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WidgetLibrary;

