import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, BoxSelect, Trash2 } from 'lucide-react';

const WidgetConfigurationPanel = ({ isOpen, onClose, widget, onSave, onDelete }) => {
  const [activeTab, setActiveTab] = useState('Data');
  const [title, setTitle] = useState(widget?.title || 'Untitled');
  const [metric, setMetric] = useState(widget?.config?.yAxisField || 'totalAmount');
  const [agg, setAgg] = useState(widget?.config?.aggregation || 'sum');
  const [format, setFormat] = useState(widget?.config?.dataFormat || 'Currency');
  const [precision, setPrecision] = useState(widget?.config?.precision || 0);

  React.useEffect(() => {
    if (widget) {
      setTitle(widget.title || 'Untitled');
      setMetric(widget.config?.yAxisField || 'totalAmount');
      setAgg(widget.config?.aggregation || 'sum');
      setFormat(widget.config?.dataFormat || 'Currency');
      setPrecision(widget.config?.precision || 0);
    }
  }, [widget]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }}
             onClick={onClose}
             className="fixed inset-0 bg-textPrimary/20 backdrop-blur-sm z-[100]"
          />
          
          <motion.div 
             initial={{ x: '100%' }}
             animate={{ x: 0 }}
             exit={{ x: '100%' }}
             transition={{ type: 'spring', damping: 30, stiffness: 300 }}
             className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white border-l border-borderLight z-[110] shadow-2xl flex flex-col"
          >
             <div className="flex items-center justify-between p-6 border-b border-borderLight bg-white">
                 <div>
                    <h2 className="text-xl font-bold text-textPrimary tracking-tight">Configuration</h2>
                    <p className="text-[10px] text-textTertiary mt-1 uppercase tracking-widest font-bold">{widget?.type || 'Widget'} Module</p>
                 </div>
                 <button onClick={onClose} className="p-2 rounded-xl text-textTertiary hover:text-textPrimary hover:bg-surfaceHover transition-all">
                    <X size={20} />
                 </button>
             </div>

             <div className="px-6 py-2 border-b border-borderLight flex gap-6 bg-surface">
                 <button 
                    onClick={() => setActiveTab('Data')}
                    className={`py-3 border-b-2 font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'Data' ? 'border-primary text-primary' : 'border-transparent text-textTertiary hover:text-textPrimary'}`}
                 >
                     Data
                 </button>
                 <button 
                    onClick={() => setActiveTab('Styling')}
                    className={`py-3 border-b-2 font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'Styling' ? 'border-primary text-primary' : 'border-transparent text-textTertiary hover:text-textPrimary'}`}
                 >
                     Presentation
                 </button>
             </div>

             <div className="flex-1 overflow-y-auto p-6 space-y-8">
                 {activeTab === 'Data' ? (
                     <div className="space-y-6">
                         <div className="space-y-2">
                             <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">Title</label>
                             <input 
                                 type="text" 
                                 value={title} 
                                 onChange={(e) => setTitle(e.target.value)}
                                 className="w-full bg-background border border-borderLight rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-textPrimary" 
                             />
                         </div>
                         
                         <div className="space-y-2">
                             <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">Type</label>
                             <div className="w-full bg-surfaceHover border border-borderLight rounded-xl px-4 py-3 text-textSecondary flex items-center gap-3 font-medium">
                                 <BoxSelect size={18} className="text-textTertiary" />
                                 {widget?.type?.toUpperCase()}
                             </div>
                         </div>
                         
                         <div className="pt-6 border-t border-borderLight space-y-6">
                             <h4 className="text-primary font-bold text-[10px] uppercase tracking-[0.2em]">Metric Engine</h4>
                             
                             <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest ml-1">Target Metric</label>
                                 <select 
                                     value={metric}
                                     onChange={(e) => setMetric(e.target.value)}
                                     className="w-full bg-background border border-borderLight rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-textPrimary font-medium appearance-none"
                                 >
                                     <option value="totalAmount">Total Revenue</option>
                                     <option value="unitPrice">Unit Price</option>
                                     <option value="quantity">Total Units</option>
                                 </select>
                              </div>

                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest ml-1">Calculation</label>
                                 <select 
                                     value={agg}
                                     onChange={(e) => setAgg(e.target.value)}
                                     className="w-full bg-background border border-borderLight rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-textPrimary font-medium appearance-none"
                                 >
                                     <option value="sum">Summation</option>
                                     <option value="average">Mean Average</option>
                                     <option value="count">Count Frequency</option>
                                 </select>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                     <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest ml-1">Format</label>
                                     <select 
                                         value={format}
                                         onChange={(e) => setFormat(e.target.value)}
                                         className="w-full bg-background border border-borderLight rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-textPrimary font-medium appearance-none"
                                     >
                                         <option>Numeric</option>
                                         <option>Currency</option>
                                     </select>
                                 </div>
                                 <div className="space-y-2">
                                     <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest ml-1">Decimals</label>
                                     <input 
                                         type="number" 
                                         value={precision}
                                         onChange={(e) => setPrecision(parseInt(e.target.value))}
                                         min="0" max="5" 
                                         className="w-full bg-background border border-borderLight rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-textPrimary font-medium" 
                                     />
                                 </div>
                              </div>
                         </div>
                     </div>
                 ) : (
                     <div className="space-y-8">
                         <div className="space-y-4">
                             <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">Interface Scale</label>
                             <div className="flex items-center gap-4">
                                 <input type="range" min="12" max="20" className="flex-1 accent-primary" />
                                 <span className="text-sm font-bold text-textPrimary bg-surfaceHover px-3 py-1 rounded-lg">14px</span>
                             </div>
                         </div>

                         <div className="space-y-4">
                             <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">Active Hue</label>
                             <div className="flex flex-wrap gap-2">
                                 {['#47B393', '#FF8A00', '#6366F1', '#EC4899', '#8B5CF6', '#F59E0B'].map(c => (
                                     <div key={c} className="w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }}></div>
                                 ))}
                             </div>
                         </div>
                         
                         <div className="pt-6 border-t border-borderLight">
                             <label className="flex items-center justify-between cursor-pointer group">
                                 <span className="text-sm font-bold text-textSecondary group-hover:text-textPrimary transition-colors">Show Dynamic Legend</span>
                                 <div className="w-10 h-6 bg-primary/20 rounded-full relative">
                                     <div className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full"></div>
                                 </div>
                             </label>
                         </div>
                     </div>
                 )}
             </div>

             <div className="p-6 border-t border-borderLight flex items-center justify-between bg-white">
                  <button 
                      onClick={() => {
                          if (window.confirm(`Permanently remove this module?`)) {
                              onDelete && onDelete(widget._id);
                              onClose();
                          }
                      }}
                      className="px-4 py-3 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2"
                  >
                      <Trash2 size={16} /> Delete
                  </button>
                  <div className="flex gap-4">
                      <button 
                          onClick={onClose}
                          className="px-5 py-3 text-sm font-bold text-textSecondary hover:text-textPrimary transition-colors"
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={() => onSave(widget._id, { 
                              title, 
                              config: { 
                                  ...widget.config, 
                                  yAxisField: metric, 
                                  aggregation: agg, 
                                  dataFormat: format, 
                                  precision 
                              } 
                          })}
                          className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
                      >
                         <Save size={18} /> Apply Changes
                      </button>
                  </div>
             </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WidgetConfigurationPanel;
