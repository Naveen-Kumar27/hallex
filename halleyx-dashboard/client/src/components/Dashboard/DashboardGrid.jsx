import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import WidgetRenderer from './WidgetRenderer';
import { Settings2, X, AlertTriangle, Lock, Unlock, Maximize2, GripHorizontal } from 'lucide-react';
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
      {/* Edit mode hint bar */}
      {isEditing && (
        <div className="mb-4 px-4 py-3 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-3">
          <GripHorizontal className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-xs text-primary font-bold">
            Drag from the library on the left to add widgets · Drag widgets to rearrange · Resize from any edge
          </p>
        </div>
      )}

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 8, sm: 4, xs: 2, xxs: 1 }}
        rowHeight={80}
        margin={[20, 20]}
        onLayoutChange={(currentLayout, allLayouts) => {
          if (onLayoutChange) onLayoutChange(allLayouts);
        }}
        draggableCancel=".no-drag"
        isDraggable={isEditing}
        isResizable={isEditing}
        isDroppable={isEditing}
        resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
        onDrop={onDrop}
        droppingItem={{ i: '__dropping-elem__', w: 4, h: 4 }}
        compactType={null}
        preventCollision={false}
        useCSSTransforms={true}
      >
        {(widgets || []).map((widget) => {
          const isLocked = layouts?.lg?.find(l => l.i === widget._id)?.static || false;

          return (
            <div
              key={widget._id}
              className={`
                glass-card flex flex-col overflow-hidden group transition-all duration-300
                hover:shadow-xl hover:border-primary/30
                ${isLocked ? 'border-amber-400/40 bg-amber-50/10' : ''}
                ${isEditing && !isLocked ? 'cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-primary/20' : ''}
                ${isEditing ? 'border-dashed border-2 border-primary/15' : ''}
              `}
            >
              {/* Widget Header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2 relative z-50">
                <div className="flex-grow overflow-hidden flex items-center gap-2">
                  {isLocked && <Lock size={11} className="text-amber-500 animate-pulse flex-shrink-0" />}
                  {isEditing && !isLocked && <GripHorizontal size={14} className="text-textTertiary opacity-40 flex-shrink-0" />}
                  <h3 className="text-sm font-bold text-textPrimary truncate group-hover:text-primary transition-colors duration-300 pr-2">
                    {widget.title}
                  </h3>
                </div>

                {/* Action buttons — slide in on hover */}
                <div className="no-drag flex items-center space-x-1 shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                  {!isEditing && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onWidgetDetail && onWidgetDetail(widget); }}
                      className="p-1.5 rounded-lg text-textTertiary hover:text-primary hover:bg-primary/10 transition-all"
                      title="View Details"
                    >
                      <Maximize2 size={12} />
                    </button>
                  )}
                  {isEditing && (
                    <>
                      <button
                        onClick={(e) => toggleLock(widget._id, e)}
                        className="p-1.5 rounded-lg text-textTertiary hover:text-amber-500 hover:bg-amber-500/10 transition-all"
                        title={isLocked ? 'Unlock Widget' : 'Lock Widget'}
                      >
                        {isLocked ? <Unlock size={12} /> : <Lock size={12} />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onConfigureWidget && onConfigureWidget(widget); }}
                        className="p-1.5 rounded-lg text-textTertiary hover:text-primary hover:bg-primary/10 transition-all"
                        title="Configure Widget"
                      >
                        <Settings2 size={12} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setWidgetToDelete(widget); }}
                        className="p-1.5 rounded-lg text-textTertiary hover:text-red-500 hover:bg-red-500/10 transition-all"
                        title="Remove Widget"
                      >
                        <X size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Pulse bar in view mode */}
              {!isEditing && (
                <div className="px-5 mb-2 flex items-center gap-2">
                  <div className="h-[2px] flex-1 bg-borderLight/20 rounded-full overflow-hidden">
                    <div
                      className="h-full w-1/3 animate-shimmer"
                      style={{ background: 'linear-gradient(90deg, rgb(var(--primary-rgb) / 0.4), rgb(var(--secondary-rgb) / 0.4))' }}
                    />
                  </div>
                </div>
              )}

              {/* Widget content */}
              <div className="px-5 pb-5 flex-grow overflow-hidden relative z-10 flex flex-col">
                <div className="flex-1 w-full relative">
                  <WidgetRenderer widget={widget} />
                </div>
              </div>

              {/* Edit mode drag indicator overlay */}
              {isEditing && !isLocked && (
                <div className="absolute inset-0 pointer-events-none border-2 border-primary/0 group-hover:border-primary/20 rounded-[inherit] transition-all duration-300" />
              )}
            </div>
          );
        })}
      </ResponsiveGridLayout>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!widgetToDelete}
        onClose={() => setWidgetToDelete(null)}
        title="Remove Widget"
      >
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-red-50 text-red-500 rounded-2xl flex-shrink-0">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h4 className="text-textPrimary font-bold text-base leading-tight">Remove this widget?</h4>
            <p className="text-sm text-textSecondary mt-1.5 leading-relaxed">
              <span className="font-bold text-textPrimary">"{widgetToDelete?.title || 'Untitled'}"</span> will be permanently removed from your dashboard. This cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-borderLight">
          <button
            onClick={() => setWidgetToDelete(null)}
            className="px-5 py-2.5 font-bold text-textSecondary hover:text-textPrimary text-sm transition-colors rounded-xl hover:bg-surfaceHover"
          >
            Keep Widget
          </button>
          <button
            onClick={confirmDelete}
            className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95 text-sm"
          >
            Remove
          </button>
        </div>
      </Modal>
    </>
  );
};

export default DashboardGrid;
