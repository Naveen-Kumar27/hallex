import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, LineChart, PieChart, Activity, GripVertical, Table, Hash, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';

const WIDGET_CATEGORIES = [
  {
    category: 'Charts',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    items: [
      { type: 'Bar Chart', icon: BarChart2, color: 'text-primary', bg: 'bg-primary/10', desc: 'Compare values across categories' },
      { type: 'Line Chart', icon: LineChart, color: 'text-violet-500', bg: 'bg-violet-500/10', desc: 'Track trends over time' },
      { type: 'Pie Chart', icon: PieChart, color: 'text-emerald-500', bg: 'bg-emerald-500/10', desc: 'Show proportional distribution' },
      { type: 'Area Chart', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10', desc: 'Visualize volume over time' },
    ]
  },
  {
    category: 'Data',
    color: 'text-slate-500',
    bgColor: 'bg-slate-500/10',
    items: [
      { type: 'Table', icon: Table, color: 'text-slate-500', bg: 'bg-slate-500/10', desc: 'Display tabular order data' },
    ]
  },
  {
    category: 'KPIs',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    items: [
      { type: 'KPI Value', icon: Hash, color: 'text-emerald-600', bg: 'bg-emerald-500/10', desc: 'Display a single metric value' },
    ]
  }
];

const WidgetLibrary = ({ isEditing, onDragStart }) => {
  const [openCategories, setOpenCategories] = useState({ Charts: true, Data: true, KPIs: true });

  const toggleCategory = (cat) => {
    setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <AnimatePresence>
      {isEditing && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-surface border-r border-borderLight flex flex-col h-full overflow-hidden flex-shrink-0 z-20 shadow-xl"
        >
          {/* Header */}
          <div className="p-5 border-b border-borderLight bg-gradient-to-br from-primary/5 to-transparent shrink-0">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-textPrimary font-bold text-base tracking-tight">Widget Library</h3>
            </div>
            <p className="text-[11px] text-textTertiary leading-relaxed mt-1 ml-[2.6rem]">
              Drag & drop into workspace
            </p>
          </div>

          {/* Widget list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {WIDGET_CATEGORIES.map((cat, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden border border-borderLight/50">
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(cat.category)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-surfaceHover/50 hover:bg-surfaceHover transition-colors"
                >
                  <span className="text-[10px] font-black text-textTertiary uppercase tracking-[0.15em]">{cat.category}</span>
                  {openCategories[cat.category]
                    ? <ChevronDown className="w-3.5 h-3.5 text-textTertiary" />
                    : <ChevronRight className="w-3.5 h-3.5 text-textTertiary" />}
                </button>

                {/* Items */}
                <AnimatePresence>
                  {openCategories[cat.category] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white"
                    >
                      {cat.items.map((item, itemIdx) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={itemIdx}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', item.type);
                              e.dataTransfer.effectAllowed = 'copy';
                              if (onDragStart) onDragStart(item.type);
                              e.currentTarget.style.opacity = '0.4';
                            }}
                            onDragEnd={(e) => {
                              e.currentTarget.style.opacity = '1';
                            }}
                            className="flex items-center gap-3 px-4 py-3 cursor-grab active:cursor-grabbing hover:bg-primary/5 transition-all group border-t border-borderLight/30 first:border-t-0"
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.bg} transition-transform group-hover:scale-110`}>
                              <Icon className={`w-4 h-4 ${item.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-textPrimary group-hover:text-primary transition-colors truncate">{item.type}</p>
                              <p className="text-[10px] text-textTertiary truncate">{item.desc}</p>
                            </div>
                            <GripVertical className="w-4 h-4 text-textTertiary opacity-30 group-hover:opacity-80 transition-all flex-shrink-0" />
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Footer tip */}
          <div className="p-4 border-t border-borderLight bg-gradient-to-t from-primary/5 to-transparent shrink-0">
            <p className="text-[10px] text-textTertiary text-center leading-relaxed italic">
              💡 Drag widgets onto the grid, then resize and configure them
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WidgetLibrary;
