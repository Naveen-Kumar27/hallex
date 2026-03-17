import React, { useState, useEffect, useRef } from 'react';
import DashboardGrid from '../components/Dashboard/DashboardGrid';
import { analyticsApi, dashboardsApi } from '../api';
import { LayoutDashboard, Share2, Settings, Layers, Undo2, Redo2, Save, Zap, Bot, Sparkles, MessageSquare } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import WidgetConfigurationPanel from '../components/Dashboard/WidgetConfigurationPanel';
import WidgetLibrary from '../components/Dashboard/WidgetLibrary';
import DashboardSelector from '../components/Dashboard/DashboardSelector';
import SideDrawer from '../components/UI/SideDrawer';
import CodeExportModal from '../components/UI/CodeExportModal';
import WidgetRenderer from '../components/Dashboard/WidgetRenderer';
import useSocket from '../hooks/useSocket';
import toast from 'react-hot-toast';
import AiAssistantModal from '../components/Dashboard/AiAssistantModal';

// Module-level var to reliably track dragged widget type.
let _draggedWidgetType = null;

const Dashboard = () => {
  const [layouts, setLayouts] = useState({ lg: [], md: [], sm: [] });
  const [originalLayouts, setOriginalLayouts] = useState({ lg: [], md: [], sm: [] });
  const [widgets, setWidgets] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [dashboardId, setDashboardId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [configuringWidget, setConfiguringWidget] = useState(null);
  
  // History state for Undo/Redo
  const [pastLayouts, setPastLayouts] = useState([]);
  const [futureLayouts, setFutureLayouts] = useState([]);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);

  // AI State
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const fetchDashboards = async (selectId = null) => {
    try {
      setIsLoading(true);
      const data = await dashboardsApi.getDashboards();
      setDashboards(data);
      if (data.length > 0) {
        const dash = selectId ? data.find(d => d._id === selectId) || data[0] : data[0];
        setDashboardId(dash._id);
        setLayouts(dash.layouts || { lg: [], md: [], sm: [] });
        setOriginalLayouts(dash.layouts || { lg: [], md: [], sm: [] });
        setWidgets(dash.widgets || []);
      } else {
        setDashboardId(null);
        setLayouts({ lg: [], md: [], sm: [] });
        setWidgets([]);
      }
    } catch (error) {
      toast.error("Failed to fetch dashboards");
    } finally {
      setIsLoading(false);
    }
  };

  const { socket } = useSocket();

  useEffect(() => {
    fetchDashboards();
    return () => {
        if (window.autoSaveTimeout) clearTimeout(window.autoSaveTimeout);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('new-order', (order) => {
        toast.success(`New order received! Total: $${order.orderInfo?.totalAmount}`, {
          icon: '📦',
          duration: 4000
        });
      });

      socket.on('order-deleted', (orderId) => {
        toast.error(`Order ${orderId} has been removed.`, {
          icon: '🗑️'
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('new-order');
        socket.off('order-deleted');
      }
    };
  }, [socket]);

  const handleCreateDashboard = async () => {
    try {
      const newDash = await dashboardsApi.createDashboard({ 
        name: `New Dashboard ${dashboards.length + 1}`,
        layouts: { lg: [], md: [], sm: [] },
        widgets: []
      });
      toast.success("New dashboard created!");
      fetchDashboards(newDash._id);
    } catch (err) {
      toast.error("Failed to create dashboard");
    }
  };

  const handleSelectDashboard = (id) => {
    if (window.autoSaveTimeout) clearTimeout(window.autoSaveTimeout);
    setIsAutoSaving(false);

    const dash = dashboards.find(d => d._id === id);
    if (dash) {
      setDashboardId(dash._id);
      setLayouts(dash.layouts || { lg: [], md: [], sm: [] });
      setOriginalLayouts(dash.layouts || { lg: [], md: [], sm: [] });
      setWidgets(dash.widgets || []);
      setIsEditing(false);
    }
  };

  const handleDeleteDashboard = async (id) => {
    if (id === dashboardId) {
        if (window.autoSaveTimeout) clearTimeout(window.autoSaveTimeout);
        setIsAutoSaving(false);
    }

    try {
      await dashboardsApi.deleteDashboard(id);
      toast.success("Dashboard deleted");
      
      const remainingDashboards = dashboards.filter(d => d._id !== id);
      if (remainingDashboards.length === 0) {
          setDashboardId(null);
          setLayouts({ lg: [], md: [], sm: [] });
          setWidgets([]);
          setDashboards([]);
      } else {
          fetchDashboards();
      }
    } catch (err) {
      toast.error("Failed to delete dashboard");
    }
  };

  const handleAiDashboardCreated = (newDashboard) => {
    toast.success("AI Dashboard Generated!");
    fetchDashboards(newDashboard._id);
  };

  const handleAiGenerate = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim() || isAiGenerating) return;

    setIsAiGenerating(true);
    const loadingToast = toast.loading("Workspan AI is architecting your dashboard...");

    try {
      const newDash = await analyticsApi.aiGenerate(aiPrompt);
      toast.dismiss(loadingToast);
      toast.success("AI Dashboard Ready!");
      setAiPrompt('');
      fetchDashboards(newDash._id);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("AI Generation failed: " + err.message);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleRenameDashboard = async (id, name) => {
    try {
      await dashboardsApi.updateDashboard(id, { name });
      setDashboards(dashboards.map(d => d._id === id ? { ...d, name } : d));
      toast.success("Dashboard renamed");
    } catch (err) {
      toast.error("Failed to rename dashboard");
    }
  };

  const handleLayoutChange = (newLayouts) => {
    if (isEditing) {
        setPastLayouts(prev => [...prev.slice(-9), layouts]);
        setFutureLayouts([]);
    }
    setLayouts({ ...layouts, ...newLayouts });
    
    if (!isEditing && dashboardId) {
        setIsAutoSaving(true);
        clearTimeout(window.autoSaveTimeout);
        window.autoSaveTimeout = setTimeout(async () => {
            try {
                await dashboardsApi.updateDashboard(dashboardId, { layouts: { ...layouts, ...newLayouts } });
                toast.success("Layout saved automatically", { icon: '💾', duration: 2000 });
            } catch (err) {
                console.error("Auto-save failed", err);
                if (err.response?.status === 404) {
                    toast.error("Active dashboard session expired. Refreshing...");
                    fetchDashboards();
                }
            } finally {
                setIsAutoSaving(false);
            }
        }, 1500);
    }
  };

  const handleUndo = () => {
      if (pastLayouts.length === 0) return;
      const previous = pastLayouts[pastLayouts.length - 1];
      const newPast = pastLayouts.slice(0, -1);
      setFutureLayouts([layouts, ...futureLayouts]);
      setLayouts(previous);
      setPastLayouts(newPast);
  };

  const handleRedo = () => {
      if (futureLayouts.length === 0) return;
      const next = futureLayouts[0];
      const newFuture = futureLayouts.slice(1);
      setPastLayouts([...pastLayouts, layouts]);
      setLayouts(next);
      setFutureLayouts(newFuture);
  };

  const handleWidgetDetail = (widget) => {
      setSelectedWidget(widget);
  };

  const handleSaveConfiguration = async () => {
    if (dashboardId) {
        try {
            const updatedDash = await dashboardsApi.updateDashboard(dashboardId, { 
              layouts: layouts,
              widgets: widgets 
            });
            setWidgets(updatedDash.widgets);
            setOriginalLayouts(updatedDash.layouts);
            setPastLayouts([]);
            setFutureLayouts([]);
            setIsEditing(false);
            toast.success("Dashboard protocol synchronized!");
        } catch(err) {
            toast.error("Failed to save changes.");
        }
    }
  };

  const handleDeleteWidget = (widgetId) => {
     setWidgets(widgets.filter(w => w._id !== widgetId));
     const newLayouts = { ...layouts };
     Object.keys(newLayouts).forEach(size => {
        newLayouts[size] = newLayouts[size].filter(l => l.i !== widgetId);
     });
     setLayouts(newLayouts);
     toast.success("Widget removed");
  };

  const handleUpdateWidgetTitle = (widgetId, updates) => {
     setWidgets(widgets.map(w => w._id === widgetId ? { ...w, ...updates } : w));
     setConfiguringWidget(null);
     toast.success("Widget updated");
  };

  const handleCancelConfiguration = () => {
       setLayouts(originalLayouts);
       setPastLayouts([]);
       setFutureLayouts([]);
       setIsEditing(false);
       toast("Changes discarded", { icon: '🔄' });
  };

  const handleAutoGenerate = async () => {
    try {
        const newDashboard = await analyticsApi.autoGenerate();
        setDashboardId(newDashboard._id);
        setLayouts(newDashboard.layouts);
        setOriginalLayouts(newDashboard.layouts);
        setWidgets(newDashboard.widgets);
        toast.success("Template applied");
    } catch (err) {
        toast.error("Generation failed");
    }
  };

  const handleDrop = (layout, layoutItem, _event) => {
    const displayType = _draggedWidgetType || (_event?.dataTransfer?.getData('text/plain'));
    _draggedWidgetType = null;
    if (!displayType) return;

    const typeMap = {
        'Bar Chart': 'bar',
        'Line Chart': 'line',
        'Pie Chart': 'pie',
        'Table': 'table',
        'KPI Value': 'kpi'
    };

    const type = typeMap[displayType] || 'bar';
    const newId = `new_widget_${Date.now()}`;
    const isKpi = type === 'kpi';
    const w = isKpi ? 3 : 4;
    const h = isKpi ? 2 : 4;

    const newWidget = {
        _id: newId,
        title: 'Untitled',
        type: type,
        config: {
            xAxisField: 'product',
            yAxisField: 'totalAmount',
            aggregation: 'sum'
        }
    };

    setWidgets([...widgets, newWidget]);
    
    const newItem = {
        ...layoutItem,
        i: newId,
        w: w,
        h: h
    };

    const updatedLayouts = {
      lg: layouts?.lg ? [...layouts.lg, newItem] : [newItem],
      md: layouts?.md ? [...layouts.md, newItem] : [newItem],
      sm: layouts?.sm ? [...layouts.sm, newItem] : [newItem],
      xs: layouts?.xs ? [...layouts.xs, newItem] : [newItem],
      xxs: layouts?.xxs ? [...layouts.xxs, newItem] : [newItem]
    };
    
    setLayouts(updatedLayouts);
    toast.success(`${displayType} added!`);
  };

  const currentDashboardName = dashboards.find(d => d._id === dashboardId)?.name;

  return (
    <MainLayout title="Dashboard Metrics">
      <div className="flex flex-1 overflow-hidden h-full">
        <WidgetLibrary
          isEditing={isEditing}
          onDragStart={(type) => { _draggedWidgetType = type; }}
        />

        <main className={`flex-1 overflow-y-auto transition-all duration-500 relative ${
          isEditing
            ? 'bg-[#f5f6ff] bg-[radial-gradient(circle,_#c7cef0_1px,_transparent_1px)] [background-size:22px_22px]'
            : 'p-6 lg:p-8 bg-transparent'
        }`}>
          {!isEditing && (
            <>
              <div className="bg-blob w-[500px] h-[500px] bg-primary/20 -top-64 -left-64 animate-pulse" />
              <div className="bg-blob w-[400px] h-[400px] bg-secondary/10 bottom-0 -right-32 animate-pulse delay-700" />
              <div className="bg-blob w-[300px] h-[300px] bg-accentViolet/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-1000" />
            </>
          )}

          <div className="w-full mx-auto max-w-[1600px] h-full relative z-10">
            <div className="p-4 md:p-6 min-h-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="space-y-2">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <DashboardSelector 
                        dashboards={dashboards}
                        currentDashboardId={dashboardId}
                        onSelect={handleSelectDashboard}
                        onCreate={handleCreateDashboard}
                        onDelete={handleDeleteDashboard}
                        onRename={handleRenameDashboard}
                      />
                      <div className="h-4 w-px bg-borderLight mx-1"></div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[11px] font-bold text-emerald-700">Live</span>
                      </div>
                    </div>
                    <div>
                      <h1 className="text-3xl font-black text-textPrimary tracking-tight">
                        {isEditing ? (
                          <span className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs font-black uppercase tracking-widest">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                              Architect Mode
                            </span>
                          </span>
                        ) : currentDashboardName}
                      </h1>
                      <p className="text-textSecondary text-sm mt-1">{isEditing ? 'Drag components from the library · Resize from edges · Click widgets to configure' : 'Real-time analytical metrics and business intelligence'}</p>
                    </div>
                  </div>
                </div>

                {!isEditing && (
                  <div className="flex-1 max-w-md mx-6 hidden xl:block">
                    <form onSubmit={handleAiGenerate} className="relative group">
                      <input 
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Ask Workspan AI to build a dashboard..."
                        className="w-full pl-12 pr-24 py-3 bg-white border border-borderLight rounded-2xl text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm group-hover:shadow-md"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-50 group-hover:opacity-100 transition-opacity">
                        <Bot size={20} />
                      </div>
                      <button 
                        type="submit"
                        disabled={!aiPrompt.trim() || isAiGenerating}
                        className="absolute right-2 top-1.5 px-4 py-1.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-30 flex items-center gap-1.5"
                      >
                        {isAiGenerating ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={14} />}
                        Build
                      </button>
                    </form>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  {isAutoSaving && <span className="text-xs text-textTertiary font-bold animate-pulse flex items-center gap-1"><Save size={12}/> Saving...</span>}
                  <button 
                    onClick={() => setIsExportModalOpen(true)}
                    className="group flex items-center gap-2 px-4 py-2.5 bg-white border border-borderLight text-textSecondary rounded-xl text-sm font-bold hover:text-textPrimary hover:border-primary/40 hover:bg-surface transition-all shadow-sm"
                  >
                    <Share2 className="h-4 w-4 group-hover:text-primary transition-colors" />
                    Export
                  </button>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                       <div className="flex bg-white rounded-xl p-1 border border-borderLight shadow-sm">
                          <button onClick={handleUndo} disabled={pastLayouts.length === 0} title="Undo" className="p-2 text-textSecondary hover:text-primary disabled:opacity-25 disabled:cursor-not-allowed rounded-lg transition-colors hover:bg-primary/10">
                            <Undo2 size={15} />
                          </button>
                          <div className="w-px bg-borderLight my-1" />
                          <button onClick={handleRedo} disabled={futureLayouts.length === 0} title="Redo" className="p-2 text-textSecondary hover:text-primary disabled:opacity-25 disabled:cursor-not-allowed rounded-lg transition-colors hover:bg-primary/10">
                            <Redo2 size={15} />
                          </button>
                       </div>
                       <button onClick={handleCancelConfiguration} className="px-4 py-2.5 bg-white border border-borderLight text-textSecondary rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
                           Discard
                       </button>
                       <button onClick={handleSaveConfiguration} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95">
                          <Save size={15} /> Save Changes
                       </button>
                    </div>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                        <Settings size={18} />
                        Edit Dashboard
                    </button>
                  )}
                </div>
              </div>

              {isLoading ? (
                <div className="flex flex-col justify-center items-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-primary font-bold animate-pulse text-xs tracking-widest uppercase">Synchronizing Protocol...</p>
                </div>
              ) : (
                <>
                  {(widgets.length === 0 && !isEditing) && (
                    <div className="flex flex-col items-center justify-center min-h-[55vh] text-center p-12">
                      <div className="relative w-28 h-28 mb-8">
                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-40" />
                        <div className="relative w-28 h-28 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full flex items-center justify-center border border-primary/20 shadow-xl">
                          <LayoutDashboard className="h-12 w-12 text-primary" />
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-5">
                        <Zap className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Ready to build</span>
                      </div>
                      <h2 className="text-3xl font-black text-textPrimary mb-3 tracking-tight">Empty Workspace</h2>
                      <p className="text-textSecondary max-w-sm mx-auto mb-10 leading-relaxed text-sm">
                        Your dashboard is ready. Add interactive widgets manually or kick-start with a pre-built template.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-4">
                        <button onClick={() => setIsEditing(true)} className="px-8 py-3.5 bg-primary text-white rounded-2xl font-bold hover:shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95">
                          Enter Architect Mode
                        </button>
                        <button onClick={handleAutoGenerate} className="px-8 py-3.5 bg-white border border-borderLight text-textSecondary rounded-2xl font-bold hover:bg-surface transition-all flex items-center gap-2 active:scale-95">
                          <Layers size={18} className="text-primary" /> Use Template
                        </button>
                      </div>
                    </div>
                  )}

                  {(widgets.length > 0 || isEditing) && (
                    <div className={`relative min-h-[60vh] ${isEditing ? 'rounded-3xl overflow-hidden border-2 border-dashed border-primary/15 bg-[radial-gradient(circle,_rgb(var(--primary-rgb)/0.04)_1px,_transparent_1px)] [background-size:28px_28px] p-3' : ''}`}>
                      {isEditing && (
                        <div className="absolute inset-0 pointer-events-none rounded-3xl ring-1 ring-inset ring-primary/10 z-0" />
                      )}
                      <DashboardGrid
                        widgets={widgets}
                        layouts={layouts}
                        isEditing={isEditing}
                        onLayoutChange={handleLayoutChange}
                        onDeleteWidget={handleDeleteWidget}
                        onConfigureWidget={(widget) => setConfiguringWidget(widget)}
                        onDrop={handleDrop}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>

        {!isEditing && (
          <button 
            onClick={() => setIsAiAssistantOpen(true)}
            className="fixed bottom-8 right-8 z-[90] p-4 bg-primary text-white rounded-2xl shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all group flex items-center gap-3"
          >
            <div className="relative">
              <Bot size={24} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-primary rounded-full animate-pulse" />
            </div>
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-black text-xs uppercase tracking-widest whitespace-nowrap">
              Open AI Assistant
            </span>
          </button>
        )}

        <AiAssistantModal 
          isOpen={isAiAssistantOpen}
          onClose={() => setIsAiAssistantOpen(false)}
          onDashboardCreated={handleAiDashboardCreated}
        />

        <WidgetConfigurationPanel 
          isOpen={!!configuringWidget}
          onClose={() => setConfiguringWidget(null)}
          widget={configuringWidget}
          onSave={handleUpdateWidgetTitle}
          onDelete={handleDeleteWidget}
        />

        <CodeExportModal 
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          widgets={widgets}
          layouts={layouts}
          dashboardName={currentDashboardName}
        />

        <SideDrawer
          isOpen={!!selectedWidget}
          onClose={() => setSelectedWidget(null)}
          title={selectedWidget?.title || "Widget Details"}
          description={`Detailed telemetry and data drill-down for ${selectedWidget?.type || 'widget'}.`}
        >
          <div className="space-y-8 p-6">
            <div className="bg-surfaceHover/50 rounded-2xl p-6 border border-borderLight h-[400px]">
              {selectedWidget && <WidgetRenderer widget={selectedWidget} />}
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-textPrimary uppercase tracking-widest text-xs flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                Raw Telemetry Data
              </h3>
              <div className="border border-borderLight rounded-2xl overflow-hidden bg-surface transition-colors duration-300 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surfaceHover/50 border-b border-borderLight transition-colors duration-300">
                      <th className="px-4 py-3 text-xs font-bold text-textSecondary uppercase">Timestamp</th>
                      <th className="px-4 py-3 text-xs font-bold text-textSecondary uppercase">Value</th>
                      <th className="px-4 py-3 text-xs font-bold text-textSecondary uppercase">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borderLight transition-colors duration-300">
                    {[1, 2, 3, 4, 5].map(i => (
                      <tr key={i} className="hover:bg-surfaceHover/30 transition-all duration-200">
                        <td className="px-4 py-3 text-sm text-textPrimary font-mono">2026-03-15 16:4{i}:{10 * i}</td>
                        <td className="px-4 py-3 text-sm text-textSecondary font-bold text-primary">${(Math.random() * 1000).toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${i % 2 === 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {i % 2 === 0 ? '+12%' : '-4%'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </SideDrawer>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
