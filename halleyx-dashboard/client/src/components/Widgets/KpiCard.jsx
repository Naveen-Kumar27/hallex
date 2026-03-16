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
              className={`p-2.5 rounded-2xl transition-all group-hover:scale-110 ${isRevenue ? 'text-primary' : 'bg-surfaceHover text-textTertiary'}`}
              style={isRevenue ? { backgroundColor: 'rgb(var(--primary-rgb) / 0.1)' } : {}}
            >
                {isRevenue ? <DollarSign size={20} strokeWidth={2.5} /> : <Activity size={20} strokeWidth={2.5} />}
            </div>
                <div 
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 border transition-all ${
                     isPositive ? 'text-emerald-500 border-emerald-500/20' : 'text-rose-500 border-rose-500/20'
                  }`}
                  style={{ backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)' }}
                >
                    {isPositive ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
                    {Math.abs(growth)}%
                </div>
            </div>

            <div className="space-y-0.5">
                <div className="text-3xl font-black text-textPrimary tracking-tight font-display">
                    {formattedCount}
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-textTertiary uppercase tracking-widest leading-none">Global Sector Snapshot</span>
                </div>
            </div>
        </div>
        
        <div className="h-10 w-full mt-6 flex items-end gap-1.5 px-0.5 relative">
            <div className="absolute inset-x-0 bottom-0 h-px bg-borderLight opacity-50"></div>
            {[35, 60, 40, 85, 50, 75, 45, 95].map((h, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-lg transition-all duration-500 group-hover:opacity-100`} 
                  style={{ 
                    height: `${i === 7 ? h : h * 0.7}%`,
                    opacity: 0.1 + (i * 0.1),
                    backgroundColor: isPositive ? 'rgb(var(--primary-rgb) / 0.4)' : '#fda4af'
                  }}
                ></div>
            ))}
        </div>
    </div>
  );
};

export default KpiCard;
