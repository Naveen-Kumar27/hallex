import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#47B393', '#FF8A00', '#6366F1', '#EC4899', '#8B5CF6', '#F59E0B'];

const PieChartWidget = ({ data, config }) => {
  const xKey = config?.xAxisField || 'name';
  const yKey = config?.yAxisField || 'value';
  const palette = config?.chartConfig?.colorPalette || COLORS;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface/90 backdrop-blur-md border border-borderLight/50 p-4 rounded-2xl shadow-2xl transition-all duration-300 scale-105">
          <p className="text-textTertiary text-[9px] font-black uppercase tracking-[0.2em] mb-2 font-display">{payload[0].name}</p>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]" style={{ backgroundColor: payload[0].payload.fill }}></div>
            <p className="text-textPrimary text-lg font-black font-display">
                {payload[0].value.toLocaleString()}
            </p>
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
          innerRadius={45}
          outerRadius={70}
          paddingAngle={4}
          dataKey={yKey}
          nameKey={xKey}
          stroke="none"
        >
          {data?.map((entry, index) => (
            <Cell 
               key={`cell-${index}`} 
               fill={palette[index % palette.length]} 
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartWidget;
