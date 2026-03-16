import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#06B6D4'  // Cyan
];

const PieChartWidget = ({ data, config }) => {
  const xKey = config?.xAxisField || 'name';
  const yKey = config?.yAxisField || 'value';
  
  // Premium Palette Fix: Ensure we always have colors even if config is empty
  const configPalette = config?.chartConfig?.colorPalette;
  const palette = (Array.isArray(configPalette) && configPalette.length > 0) ? configPalette : COLORS;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface/95 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl transition-all duration-300 scale-105">
           <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill }}></div>
              <p className="text-textTertiary text-[10px] font-black uppercase tracking-widest font-display">{payload[0].name}</p>
           </div>
           <div className="flex items-baseline gap-2">
            <p className="text-textPrimary text-2xl font-black font-display">
                {payload[0].value.toLocaleString()}
            </p>
            <span className="text-[10px] text-textTertiary font-bold uppercase">Total</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={4}
          cornerRadius={6}
          dataKey={yKey}
          nameKey={xKey}
          stroke="none"
          animationBegin={0}
          animationDuration={1500}
          label={{ 
            fill: 'var(--text-secondary)', 
            fontSize: 11, 
            fontWeight: 'bold',
            formatter: (value) => value.toLocaleString()
          }}
          labelLine={{ stroke: 'var(--text-tertiary)', strokeWidth: 1 }}
        >
          {data?.map((entry, index) => (
            <Cell 
               key={`cell-${index}`} 
               fill={palette[index % palette.length]} 
               className="hover:opacity-80 transition-opacity duration-300 cursor-pointer shadow-lg"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartWidget;
