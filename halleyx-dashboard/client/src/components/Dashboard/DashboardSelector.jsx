import React, { useState } from 'react';
import { ChevronDown, Plus, Trash2, Edit3, Check, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardSelector = ({ dashboards, currentDashboardId, onSelect, onCreate, onDelete, onRename }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(null);
  const [newName, setNewName] = useState("");

  const currentDashboard = dashboards.find(d => d._id === currentDashboardId) || dashboards[0];

  const handleRenameSubmit = (e, id) => {
    e.stopPropagation();
    if (newName.trim()) {
      onRename(id, newName);
      setIsRenaming(null);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 px-4 py-2.5 bg-white border border-borderLight rounded-2xl hover:border-primary/30 transition-all group shadow-sm"
      >
        <div className="flex flex-col items-start min-w-[120px]">
          <span className="text-[10px] text-textTertiary font-bold uppercase tracking-[0.2em] mb-0.5">Ecosystem View</span>
          <span className="text-sm font-bold text-textPrimary group-hover:text-primary transition-colors truncate w-full">
            {currentDashboard?.name || 'Select Dashboard'}
          </span>
        </div>
        <div className={`p-1 rounded-lg bg-surfaceHover text-textTertiary transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}>
           <ChevronDown size={14} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-80 bg-white border border-borderLight rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-4 border-b border-borderLight flex items-center justify-between bg-surface">
            <span className="text-[10px] font-bold text-textTertiary uppercase tracking-widest pl-1">Available Dashboards</span>
            <button 
              onClick={() => {
                onCreate();
                setIsOpen(false);
              }}
              className="p-1.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all"
              title="Add New Workspace"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="max-h-72 overflow-y-auto p-2 scrollbar-hide">
            {dashboards.map((dash) => (
              <div 
                key={dash._id}
                onClick={() => {
                  onSelect(dash._id);
                  setIsOpen(false);
                }}
                className={`group flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all mb-1 ${dash._id === currentDashboardId ? 'bg-primary/5 border border-primary/20' : 'hover:bg-surfaceHover border border-transparent'}`}
              >
                <div className="flex flex-col flex-1 min-w-0 pr-4">
                  {isRenaming === dash._id ? (
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <input 
                          autoFocus
                          value={newName}
                          onChange={e => setNewName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleRenameSubmit(e, dash._id)}
                          className="bg-white border border-primary/30 rounded-xl px-3 py-1 text-xs text-textPrimary outline-none w-full focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                        <button onClick={e => handleRenameSubmit(e, dash._id)} className="text-primary hover:scale-110 transition-transform"><Check size={16} /></button>
                    </div>
                  ) : (
                    <span className={`text-sm font-bold truncate ${dash._id === currentDashboardId ? 'text-primary' : 'text-textPrimary'}`}>
                      {dash.name}
                    </span>
                  )}
                  <span className="text-[10px] text-textTertiary font-medium mt-1">
                    {dash.widgets?.length || 0} Modules • {new Date(dash.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(dash._id);
                      setIsOpen(false);
                    }}
                    className="p-2 hover:bg-primary/10 rounded-lg text-textTertiary hover:text-primary transition-all shadow-sm"
                    title="View Dashboard"
                  >
                    <Eye size={14} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRenaming(dash._id);
                      setNewName(dash.name);
                    }}
                    className="p-2 hover:bg-white rounded-lg text-textTertiary hover:text-primary transition-all shadow-sm"
                    title="Rename Dashboard"
                  >
                    <Edit3 size={14} />
                  </button>
                  {dashboards.length > 1 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if(window.confirm('Erase this workspace?')) onDelete(dash._id);
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg text-textTertiary hover:text-red-500 transition-all shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-surface border-t border-borderLight flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse outline outline-4 outline-emerald-500/10"></div>
             <span className="text-[10px] text-textTertiary font-bold uppercase tracking-widest">Protocol Operational</span>
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardSelector;
