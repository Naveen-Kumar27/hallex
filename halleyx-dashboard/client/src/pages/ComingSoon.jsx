import React, { useState, useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

const SectorSnapshots = {
  Payments: [
    { label: "Secure Gateway", value: "Operational", status: "success" },
    { label: "PCI-DSS Protocol", value: "v4.0 Syncing", status: "warning" },
    { label: "Active Nodes", value: "12/14", status: "success" }
  ],
  Users: [
    { label: "Active Protocols", value: "1,280", status: "success" },
    { label: "Auth Latency", value: "14ms", status: "success" },
    { label: "Session Buffer", value: "98.2%", status: "success" }
  ],
  Analytics: [
    { label: "LLM Engine", value: "Gemini 1.5 Pro", status: "success" },
    { label: "Data Stream", value: "Active", status: "success" },
    { label: "Neural Mapping", value: "48% Complete", status: "warning" }
  ],
  Settings: [
    { label: "API Cluster", value: "Cluster-X1", status: "success" },
    { label: "Encryption", value: "AES-256-GCM", status: "success" },
    { label: "Environment", value: "Production", status: "warning" }
  ]
};

const ProtocolLogs = [
  "Synchronizing Neural Mapping Cluster...",
  "Verifying AES-256 Handshake...",
  "Indexing Sector Databases...",
  "Deploying UI Components...",
  "Benchmarking Latency Protocols..."
];

const ComingSoon = ({ title }) => {
  const [logIndex, setLogIndex] = useState(0);
  const snapshots = SectorSnapshots[title] || [
    { label: "Status", value: "Initializing", status: "warning" },
    { label: "Sector", value: title, status: "success" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex(prev => (prev + 1) % ProtocolLogs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout title={title}>
      <div className="animate-fade-in max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="w-20 h-20 bg-primary/10 rounded-[1.8rem] flex items-center justify-center mb-6 shadow-xl shadow-primary/5 border border-primary/20 relative"
          >
            <Construction className="w-8 h-8 text-primary" />
            <div className="absolute -top-1 -right-1 flex h-4 w-4">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>
               <span className="relative inline-flex rounded-full h-4 w-4 bg-primary/40 border-2 border-white scale-50"></span>
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-bold text-textPrimary tracking-tight mb-3 font-display">
            {title} Central Sector
          </h1>
          
          <p className="text-textSecondary max-w-lg mx-auto leading-relaxed font-medium text-sm">
            Module synchronization in progress. The Workspan AI engine is currently 
            allocating resources to the {title.toLowerCase()} infrastructure.
          </p>
        </div>

        {/* Mock Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           {snapshots.map((item, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="p-6 bg-white border border-borderLight rounded-3xl shadow-sm hover:shadow-md transition-all group"
             >
                <p className="text-[10px] font-bold text-textTertiary uppercase tracking-widest mb-2">{item.label}</p>
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-bold text-textPrimary">{item.value}</h3>
                   <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'} animate-pulse`} />
                </div>
             </motion.div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Visual Progress */}
            <div className="lg:col-span-2 bg-white border border-borderLight rounded-[2.5rem] p-10 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
               <div className="relative z-10 space-y-8">
                  <div className="space-y-3">
                     <div className="flex items-center justify-between font-bold text-sm tracking-tight">
                        <span className="text-textPrimary">Deployment Progress</span>
                        <span className="text-primary">75%</span>
                     </div>
                     <div className="h-2.5 w-full bg-surfaceHover rounded-full overflow-hidden border border-borderLight">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "75%" }}
                          transition={{ duration: 2, ease: "easeOut" }}
                          className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(71,179,147,0.4)]"
                        />
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                     {[
                       { label: "Database Schema", done: true },
                       { label: "UI Framework", done: true },
                       { label: "Neural API Link", done: true },
                       { label: "Data Pipeline", done: false },
                       { label: "Security Audit", done: false },
                       { label: "Global Sync", done: false }
                     ].map((item, i) => (
                       <div key={i} className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black border ${item.done ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-surfaceHover border-borderLight text-textTertiary'}`}>
                             {item.done ? '✓' : '•'}
                          </div>
                          <span className={`text-[11px] font-bold ${item.done ? 'text-textSecondary' : 'text-textTertiary'}`}>{item.label}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Live Log */}
            <div className="bg-surface border border-borderLight rounded-[2.5rem] p-8 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                   <div className="flex gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                   </div>
                   <span className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-auto">Terminal v4.0.2</span>
                </div>
                <div className="flex-1 font-mono text-[10px] space-y-3 overflow-hidden">
                   <p className="text-emerald-500 font-bold">$ halleyx init --sector {title.toLowerCase()}</p>
                   <p className="text-textTertiary leading-relaxed">
                      {"<"}System Log{">"}: Initializing sector {title}...<br/>
                      {"<"}System Log{">"}: Establishing peer-to-peer relay...<br/>
                      {"<"}System Log{">"}: Protocol authenticated via LLM-01...
                   </p>
                   <motion.p 
                     key={logIndex}
                     initial={{ opacity: 0, x: -5 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="text-primary font-bold border-l-2 border-primary pl-2 bg-primary/5 py-1"
                   >
                      {ProtocolLogs[logIndex]}
                   </motion.p>
                </div>
                <div className="mt-6 pt-4 border-t border-borderLight flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                   <span className="text-[9px] font-bold text-textTertiary uppercase tracking-[0.2em]">Synchronizing Stream</span>
                </div>
            </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ComingSoon;
