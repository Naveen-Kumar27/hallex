import React, { useState, useEffect } from 'react';
import DashboardGrid from '../components/Dashboard/DashboardGrid';
import { analyticsApi, dashboardsApi } from '../api';
import { LayoutDashboard, Share2, Settings, Bot, Undo2, Redo2, Save } from 'lucide-react';
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
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  
  // History state for Undo/Redo
  const [pastLayouts, setPastLayouts] = useState([]);
  const [futureLayouts, setFutureLayouts] = useState([]);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);

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
        // Reset state if no dashboards found
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
    // Cleanup timer on unmount
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
        // In a more complex app, we might trigger a global refetch of analytics data here
        // or update specific widget states.
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
    // Clear any pending auto-saves for the old dashboard
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
    // If we are deleting the CURRENTLY active dashboard, clear timers
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
    // Only track history if we are in Edit Mode
    if (isEditing) {
        setPastLayouts(prev => [...prev.slice(-9), layouts]); // Keep last 10 states
        setFutureLayouts([]);
    }
    setLayouts({ ...layouts, ...newLayouts });
    
    // Auto-save logic
    if (!isEditing && dashboardId) {
        setIsAutoSaving(true);
        // Debounce simple auto-save
        clearTimeout(window.autoSaveTimeout);
        window.autoSaveTimeout = setTimeout(async () => {
            try {
                await dashboardsApi.updateDashboard(dashboardId, { layouts: { ...layouts, ...newLayouts } });
                toast.success("Layout saved automatically", { icon: '💾', duration: 2000 });
            } catch (err) {
                console.error("Auto-save failed", err);
                // If it's a 404, the dashboard might have been deleted/swapped
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

  const applyTemplate = (templateName) => {
       // Mock template generation logic
       toast.success(`${templateName} template applied! (Preview only)`);
  };

  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    try {
        const newDashboard = await analyticsApi.autoGenerate();
        setDashboardId(newDashboard._id);
        setLayouts(newDashboard.layouts);
        setOriginalLayouts(newDashboard.layouts);
        setWidgets(newDashboard.widgets);
        toast.success("Template applied");
    } catch (err) {
        toast.error("Generation failed");
    } finally {
        setIsGenerating(false);
    }
 };

  const handleAiGenerate = async (e) => {
     if (e) e.preventDefault();
     if (!aiPrompt.trim()) {
       toast.error("Please enter a workspace objective first.");
       return;
     }
     
     setIsAiAssistantOpen(true);
  };

  const handleAiDashboardCreated = (newDashboard) => {
      setDashboardId(newDashboard._id);
      setLayouts(newDashboard.layouts);
      setOriginalLayouts(newDashboard.layouts);
      setWidgets(newDashboard.widgets);
      setAiPrompt("");
  };

  const handleDrop = (layout, layoutItem, _event) => {
    const displayType = _event.dataTransfer.getData("text/plain");
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
        {/* Sidebar Library */}
        <WidgetLibrary isEditing={isEditing} />

        {/* Dashboard Workspace */}
        <main className={`flex-1 overflow-y-auto p-6 lg:p-8 transition-all duration-500 ${isEditing ? 'bg-surfaceActive animate-fade-in' : 'bg-transparent'}`}>
          <div className={`w-full mx-auto max-w-[1600px] h-full ${isEditing ? 'border-2 border-dashed border-primary/20 rounded-3xl bg-surface' : ''}`}>
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
                       <form 
                         onSubmit={handleAiGenerate}
                         className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/50 border border-emerald-100 rounded-xl group transition-all focus-within:ring-4 focus-within:ring-emerald-500/5 focus-within:border-emerald-300"
                       >
                         <Bot size={14} className="text-emerald-500 group-hover:animate-bounce" />
                         <input 
                           type="text"
                           placeholder="Ask Workspan AI to build..."
                           className="bg-transparent text-[11px] font-bold text-emerald-800 placeholder:text-emerald-400 outline-none w-48 lg:w-64"
                           value={aiPrompt}
                           onChange={(e) => setAiPrompt(e.target.value)}
                         />
                         <button type="submit" className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">Generate</button>
                       </form>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-textPrimary tracking-tight">
                        {isEditing ? 'Dashboard Architecture' : currentDashboardName}
                      </h1>
                      <p className="text-textSecondary text-sm">{isEditing ? 'Drag and drop components to build your workspace' : 'Real-time analytical metrics and business intelligence'}</p>
                    </div>
                  </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    {isAutoSaving && <span className="text-xs text-textTertiary font-bold animate-pulse flex items-center gap-1"><Save size={12}/> Saving...</span>}
                    
                    <button 
                       onClick={() => setIsExportModalOpen(true)}
                       className="group flex items-center gap-2 px-4 py-2 bg-white border border-borderLight text-textSecondary rounded-xl text-sm font-bold hover:text-textPrimary hover:border-textTertiary transition-all shadow-sm"
                    >
                       <Share2 className="h-4 w-4" />
                       Export
                    </button>
                    {isEditing ? (
                       <div className="flex items-center gap-2">
                          {/* Undo / Redo Controls */}
                          <div className="flex bg-surfaceHover rounded-xl p-1 border border-borderLight mr-2">
                             <button onClick={handleUndo} disabled={pastLayouts.length === 0} className="p-1.5 text-textSecondary hover:text-textPrimary disabled:opacity-30 disabled:hover:text-textSecondary rounded-lg transition-colors"><Undo2 size={16} /></button>
                             <button onClick={handleRedo} disabled={futureLayouts.length === 0} className="p-1.5 text-textSecondary hover:text-textPrimary disabled:opacity-30 disabled:hover:text-textSecondary rounded-lg transition-colors"><Redo2 size={16} /></button>
                          </div>
                          
                          <button 
                              onClick={handleCancelConfiguration}
                              className="px-4 py-2 bg-white border border-borderLight text-textSecondary rounded-xl text-sm font-bold hover:bg-surfaceHover transition-all"
                          >
                             Discard
                          </button>
                          <button 
                              onClick={handleSaveConfiguration}
                              className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                          >
                             <Save size={16} /> Save Changes
                          </button>
                       </div>
                    ) : (
                       <button 
                           onClick={() => setIsEditing(true)}
                           className="flex items-center gap-2 bg-white border border-borderLight text-textPrimary px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-surfaceHover transition-all shadow-sm"
                       >
                           <Settings size={18} className="text-textTertiary" />
                           Edit Dashboard
                       </button>
                    )}
                 </div>
              </div>

              {isLoading || isGenerating ? (
                  <div className="flex flex-col justify-center items-center py-32 space-y-4">
                      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <p className="text-primary font-bold animate-pulse text-xs tracking-widest uppercase">
                          Synchronizing Protocol...
                      </p>
                  </div>
              ) : (
                  <>
                      {(widgets.length === 0 && !isEditing) && (
                          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-12">
                              <div className="w-24 h-24 bg-surfaceHover rounded-full flex items-center justify-center mb-8 border border-borderLight">
                                  <LayoutDashboard className="h-10 w-10 text-textTertiary" />
                              </div>
                              <h2 className="text-2xl font-bold text-textPrimary mb-3">Empty Workspace</h2>
                              <p className="text-textSecondary max-w-sm mx-auto mb-8 leading-relaxed">
                                  Your dashboard is ready for configuration. Add widgets manually or use our AI to generate a custom template.
                              </p>
                              <div className="flex flex-wrap items-center justify-center gap-4">
                                  <button 
                                      onClick={() => setIsEditing(true)}
                                      className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg shadow-primary/20 transition-all"
                                  >
                                      Enter Architect Mode
                                  </button>
                                  <button 
                                      onClick={handleAutoGenerate}
                                      className="px-8 py-3 bg-white border border-borderLight text-textSecondary rounded-xl font-bold hover:bg-surfaceHover transition-all flex items-center gap-2"
                                  >
                                      <Bot size={18} /> Use Template
                                  </button>
                                  
                                  {isEditing && (
                                    <div className="w-full mt-8 pt-8 border-t border-borderLight flex flex-col items-center">
                                       <h3 className="text-sm font-bold text-textSecondary uppercase tracking-widest mb-4">Quick Layouts</h3>
                                       <div className="flex gap-4">
                                           <button onClick={() => applyTemplate('Sales')} className="px-6 py-2 bg-surfaceHover border border-borderLight text-textPrimary rounded-xl text-sm font-bold hover:border-primary transition-all">Sales View</button>
                                           <button onClick={() => applyTemplate('Analytics')} className="px-6 py-2 bg-surfaceHover border border-borderLight text-textPrimary rounded-xl text-sm font-bold hover:border-primary transition-all">Analytics Focus</button>
                                       </div>
                                    </div>
                                  )}
                              </div>
                          </div>
                      )}

                      {(widgets.length > 0 || isEditing) && (
                          <div className="relative min-h-[60vh]">
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
          <div className="space-y-8">
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
                         {[1,2,3,4,5].map(i => (
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

             <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-xs text-textSecondary leading-relaxed italic">
                   Note: Advanced filters and date-range adjustments applied to the main dashboard are reflected in this detailed view.
                </p>
             </div>
          </div>
        </SideDrawer>
         <AiAssistantModal 
            isOpen={isAiAssistantOpen}
            onClose={() => setIsAiAssistantOpen(false)}
            initialPrompt={aiPrompt}
            onGenerated={handleAiDashboardCreated}
         />
      </div>
    </MainLayout>
  );
};

export default Dashboard;

