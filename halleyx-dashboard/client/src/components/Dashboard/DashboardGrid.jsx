import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import WidgetRenderer from './WidgetRenderer';
import { Settings2, X, AlertTriangle, Lock, Unlock, Copy, Maximize2 } from 'lucide-react';
import Modal from '../UI/Modal';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardGrid = ({ 
  layouts, 
  widgets, 
  isEditing, 
  onLayoutChange, 
  onDeleteWidget, 
  onConfigureWidget, 
  onWidgetDetail,
  onDrop 
}) => {
  const [widgetToDelete, setWidgetToDelete] = useState(null);

  const confirmDelete = () => {
     if (widgetToDelete && onDeleteWidget) {
         onDeleteWidget(widgetToDelete._id);
     }
     setWidgetToDelete(null);
  };

  const toggleLock = (widgetId, e) => {
      e.stopPropagation();
      // Only emit change if we have layout update tracking, but for now we'll 
      // rely on dashboard grid sending the whole layout back. We need to find
      // this component in layout and flip its static property.
      if (onLayoutChange) {
         const newLayouts = { ...layouts };
         Object.keys(newLayouts).forEach(br => {
             newLayouts[br] = newLayouts[br].map(l => {
                 if (l.i === widgetId) return { ...l, static: !l.static };
                 return l;
             });
         });
         onLayoutChange(newLayouts);
      }
  };

  return (
    <>
    <ResponsiveGridLayout
      className="layout mt-4"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 8, sm: 4, xs: 2, xxs: 1 }}
      rowHeight={80}
      margin={[28, 28]}
      onLayoutChange={(currentLayout, allLayouts) => {
        if (onLayoutChange) {
           onLayoutChange(allLayouts);
        }
      }}
      draggableCancel=".no-drag"
      isDraggable={isEditing}
      isResizable={isEditing}
      isDroppable={isEditing}
      resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
      onDrop={onDrop}
      droppingItem={{ i: "__dropping-elem__", w: 4, h: 4 }}
      compactType={null}
      preventCollision={false}
      useCSSTransforms={true}
    >
      {(widgets || []).map((widget) => {
          // Find if widget is static in current responsive layout constraint (checking 'lg' as default proxy)
          const isLocked = layouts?.lg?.find(l => l.i === widget._id)?.static || false;
          
          return (
            <div 
               key={widget._id} 
               className={`glass-card flex flex-col overflow-hidden group hover:neon-glow hover:border-primary/50 ${isLocked ? 'border-amber-500/30 shadow-[0_0_15px_rgb(245 158 11 / 0.1)]' : ''} ${isEditing && !isLocked ? 'cursor-grab active:cursor-grabbing' : ''}`}
            >
              <div className="flex items-center justify-between px-6 pt-5 pb-3 relative z-50">
                <div className="flex-grow cursor-grab active:cursor-grabbing overflow-hidden flex items-center gap-2">
                   {isLocked && <Lock size={12} className="text-amber-500 animate-pulse" />}
                   <h3 className="text-sm font-bold text-textPrimary truncate group-hover:text-primary transition-all duration-300 pr-2">
                     {widget.title}
                   </h3>
                </div>
                
                <div className="no-drag flex items-center space-x-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <button 
                      onClick={(e) => {
                          e.stopPropagation();
                          onWidgetDetail && onWidgetDetail(widget);
                      }}
                      className="p-1.5 rounded-xl text-textTertiary hover:text-primary hover:bg-primary/10 transition-all duration-300"
                      title="View Details"
                  >
                      <Maximize2 size={13} />
                  </button>
                  <button 
                      onClick={(e) => toggleLock(widget._id, e)}
                      className="p-1.5 rounded-xl text-textTertiary hover:text-amber-500 hover:bg-amber-500/10 transition-all duration-300"
                      title={isLocked ? "Unlock Widget" : "Lock Widget"}
                  >
                      {isLocked ? <Unlock size={13} /> : <Lock size={13} />}
                  </button>
                  <button 
                      onClick={(e) => {
                          e.stopPropagation();
                          onConfigureWidget && onConfigureWidget(widget);
                      }}
                      className="p-1.5 rounded-xl text-textTertiary hover:text-primary hover:bg-primary/10 transition-all duration-300"
                      title="Edit Widget"
                  >
                      <Settings2 size={13} />
                  </button>
                  <button 
                      onClick={(e) => {
                          e.stopPropagation();
                          setWidgetToDelete(widget);
                      }}
                      className="p-1.5 rounded-xl text-textTertiary hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
                      title="Delete Widget"
                  >
                      <X size={13} />
                  </button>
                </div>
              </div>
              
              <div className="px-6 pb-6 flex-grow overflow-hidden relative z-10 flex flex-col">
                 {!isEditing && (
                     <div className="flex items-center gap-2 mb-3">
                        <span className="text-[9px] text-textTertiary font-black uppercase tracking-[0.2em] opacity-50">Pulse Control</span>
                        <div className="h-[2px] flex-1 bg-borderLight/20 rounded-full overflow-hidden">
                           <div 
                             className="h-full w-1/4 animate-shimmer"
                             style={{ background: 'linear-gradient(90deg, rgb(var(--primary-rgb) / 0.4), rgb(var(--secondary-rgb) / 0.4))' }}
                           />
                        </div>
                     </div>
                 )}
                 <div className="flex-1 w-full relative">
                    <WidgetRenderer widget={widget} />
                 </div>
              </div>
            </div>
          );
      })}
    </ResponsiveGridLayout>

    <Modal 
       isOpen={!!widgetToDelete} 
       onClose={() => setWidgetToDelete(null)}
       title="Delete Widget"
    >
       <div className="flex items-start gap-4 mb-8">
           <div className="p-3 bg-red-50 text-red-500 rounded-full flex-shrink-0">
               <AlertTriangle size={24} />
           </div>
           <div>
               <h4 className="text-textPrimary font-bold text-lg leading-tight">Remove this widget?</h4>
               <p className="text-sm text-textSecondary mt-2 leading-relaxed">This action cannot be undone. The '{widgetToDelete?.title || 'Untitled'}' widget will be removed from your dashboard.</p>
           </div>
       </div>
       <div className="flex items-center justify-end gap-3 pt-4 border-t border-borderLight">
           <button 
               onClick={() => setWidgetToDelete(null)}
               className="px-4 py-2 font-bold text-textSecondary hover:text-textPrimary transition-colors"
           >
               Keep Widget
           </button>
           <button 
               onClick={confirmDelete}
               className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-200"
           >
               Delete
           </button>
       </div>
    </Modal>
    </>
  );
};

export default DashboardGrid;
