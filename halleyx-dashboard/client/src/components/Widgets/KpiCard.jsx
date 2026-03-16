import React from 'react';
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const KpiCard = ({ title, count, growth = 12.5, status = 'success' }) => {
  const isRevenue = title.toLowerCase().includes('revenue') || title.toLowerCase().includes('value') || title.toLowerCase().includes('amount');
  const formattedCount = typeof count === 'number' 
     ? (isRevenue ? `$${count.toLocaleString()}` : count.toLocaleString()) 
     : count;

  const isPositive = growth >= 0;

  return (
    <div className="flex flex-col h-full justify-between py-2 overflow-hidden group">
        <div className="space-y-4">
            <div className="flex items-center justify-between">
            <div 
              className={`p-3 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm ${isRevenue ? 'bg-indigo-50/50 text-indigo-600' : 'bg-pink-50/50 text-pink-600'}`}
              style={{ 
                border: `1px solid ${isRevenue ? 'rgba(99, 102, 241, 0.1)' : 'rgba(236, 72, 153, 0.1)'}`,
                boxShadow: `0 8px 16px -4px ${isRevenue ? 'rgba(99, 102, 241, 0.1)' : 'rgba(236, 72, 153, 0.1)'}`
              }}
            >
                {isRevenue ? <DollarSign size={22} strokeWidth={2.5} /> : <Activity size={22} strokeWidth={2.5} />}
            </div>
                <div 
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 border transition-all duration-500 hover:scale-105 ${
                     isPositive ? 'text-emerald-500 border-emerald-500/20 bg-emerald-50/30' : 'text-rose-500 border-rose-500/20 bg-rose-50/30'
                  }`}
                >
                    {isPositive ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
                    {Math.abs(growth)}%
                </div>
            </div>

            <div className="space-y-1">
                <div className="text-4xl font-black text-textPrimary tracking-tight font-display leading-none">
                    {formattedCount}
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary-glow animate-pulse" />
                   <span className="text-[10px] font-bold text-textTertiary uppercase tracking-widest leading-none">Global Sector Snapshot</span>
                </div>
            </div>
        </div>
        
        <div className="h-12 w-full mt-6 flex items-end gap-1 px-1 relative">
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-borderLight to-transparent opacity-30"></div>
            {[35, 60, 40, 85, 50, 75, 45, 95].map((h, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-md transition-all duration-700 delay-[${i * 50}ms] group-hover:opacity-100`} 
                  style={{ 
                    height: `${i === 7 ? h : h * 0.7}%`,
                    opacity: 0.1 + (i * 0.1),
                    background: isPositive 
                      ? `linear-gradient(180deg, var(--accent-teal) 0%, rgba(16, 185, 129, 0.1) 100%)` 
                      : `linear-gradient(180deg, var(--secondary) 0%, rgba(236, 72, 153, 0.1) 100%)`
                  }}
                ></div>
            ))}
        </div>
    </div>
  );
};

export default KpiCard;
