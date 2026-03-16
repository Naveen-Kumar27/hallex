import React, { useState } from 'react';
import Modal from './Modal';
import { Copy, Check, Download, Code, FileJson, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

const CodeExportModal = ({ isOpen, onClose, widgets, layouts, dashboardName }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('react');

  const generateReactCode = () => {
    const componentName = (dashboardName || 'MyDashboard').replace(/\s+/g, '');
    
    const code = `
import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, Bar, 
  LineChart, Line, 
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';

const ${componentName} = () => {
  const data = [
    { name: 'Monday', value: 400, revenue: 2400 },
    { name: 'Tuesday', value: 300, revenue: 1398 },
    { name: 'Wednesday', value: 200, revenue: 9800 },
    { name: 'Thursday', value: 278, revenue: 3908 },
    { name: 'Friday', value: 189, revenue: 4800 },
  ];

  return (
    <div className="p-8 bg-[#F9FAFB] min-h-screen text-[#1F2937] font-['Inter']">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-[#1F2937] mb-2 font-['Outfit']">${dashboardName || 'Analytical Ecosystem'}</h1>
          <p className="text-[#6B7280] font-medium">Enterprise-grade business intelligence metrics</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          ${widgets.map((w) => {
            const layout = layouts.lg.find(l => l.i === w._id) || { w: 4, h: 4 };
            const colSpan = layout.w;
            
            return `
          <div className="md:col-span-${colSpan} bg-white rounded-3xl border border-[#F1F5F9] p-6 shadow-sm flex flex-col">
            <h3 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.2em] mb-4">${w.title}</h3>
            <div className="flex-grow min-h-[300px]">
              ${generateWidgetCodeSnippet(w)}
            </div>
          </div>`;
          }).join('\n')}
        </div>
      </div>
    </div>
  );
};

export default ${componentName};
    `.trim();

    return code;
  };

  const generateWidgetCodeSnippet = (widget) => {
    switch(widget.type) {
      case 'kpi':
        return `
              <div className="flex flex-col h-full justify-between py-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-[#47B393]/10 text-[#47B393] rounded-xl">
                    <DollarSign size={20} />
                  </div>
                  <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold border border-emerald-100">+12%</div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1F2937] tracking-tight">1,284</p>
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase mt-1">Real-time performance</p>
                </div>
              </div>`;
      case 'bar':
        return `
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 600}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #F1F5F9', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#47B393" radius={[6, 6, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>`;
      case 'line':
        return `
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 600}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #F1F5F9', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#FF8A00" strokeWidth={4} dot={{ r: 4, fill: "#fff", stroke: "#FF8A00", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>`;
      case 'pie':
        return `
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={75}
                    paddingAngle={4} dataKey="value" stroke="none"
                  >
                    {[0,1,2,3,4,5].map((entry, index) => (
                      <Cell key={\`cell-\${index}\`} fill={['#47B393', '#FF8A00', '#6366F1', '#EC4899'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>`;
      case 'table':
        return `
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-[#94A3B8] border-b border-[#F1F5F9]">
                      <th className="pb-3 text-[10px] font-bold uppercase tracking-widest">Entry</th>
                      <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {data.slice(0, 5).map((item, i) => (
                      <tr key={i}>
                        <td className="py-3 font-medium text-[#1F2937]">{item.name}</td>
                        <td className="py-3 font-bold text-right text-[#47B393]">{item.value.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>`;
      default:
        return '<div className="text-textTertiary">Component ready for deployment</div>';
    }
  };

  const handleCopy = () => {
    const code = activeTab === 'react' ? generateReactCode() : JSON.stringify({ widgets, layouts }, null, 2);
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Protocol copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const code = activeTab === 'react' ? generateReactCode() : JSON.stringify({ widgets, layouts }, null, 2);
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeTab === 'react' ? `${dashboardName || 'Dashboard'}.jsx` : 'config.json';
    link.click();
    toast.success('System documentation exported');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Architecture" maxWidth="4xl">
      <div className="flex flex-col h-[70vh]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex bg-surface p-1 rounded-2xl border border-borderLight">
            <button 
              onClick={() => setActiveTab('react')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'react' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-textTertiary hover:text-textPrimary'}`}
            >
              <Code size={16} /> React Component
            </button>
            <button 
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'json' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-textTertiary hover:text-textPrimary'}`}
            >
              <FileJson size={16} /> JSON Protocol
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleCopy}
              className="p-3 bg-white border border-borderLight rounded-xl text-textTertiary hover:text-primary transition-all shadow-sm"
              title="Copy"
            >
              {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
            </button>
            <button 
              onClick={handleDownload}
              className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/10"
              title="Export File"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-grow bg-background rounded-3xl border border-borderLight overflow-hidden relative group shadow-inner">
          <div className="absolute top-6 right-6 z-10">
             <div className="px-3 py-1 bg-white border border-borderLight rounded-lg text-[10px] text-textTertiary uppercase font-bold tracking-widest shadow-sm">Internal Use Only</div>
          </div>
          <pre className="p-8 text-sm font-mono text-textPrimary h-full overflow-auto custom-scrollbar leading-relaxed">
            {activeTab === 'react' ? generateReactCode() : JSON.stringify({ widgets, layouts }, null, 2)}
          </pre>
        </div>

        <div className="mt-8 flex items-start gap-4 p-5 bg-primary/5 border border-primary/10 rounded-[1.5rem]">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Layers size={20} />
          </div>
          <div className="text-xs text-textSecondary leading-relaxed">
            <p className="font-bold text-textPrimary mb-1 uppercase tracking-widest">Protocol Deployment Note</p>
            {activeTab === 'react' ? (
              <p>This export generates a production-ready component using **Tailwind CSS** and **Recharts**. Ensure dependencies are synchronized: <code className="text-primary font-bold">npm i recharts lucide-react</code></p>
            ) : (
              <p>The JSON configuration provides the logical blueprint for this workspace. This protocol can be injected into any Hallex-compliant system to replicate the current state.</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CodeExportModal;
