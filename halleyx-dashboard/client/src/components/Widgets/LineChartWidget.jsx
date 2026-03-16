import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const LineChartWidget = ({ data, config }) => {
  const xKey = config?.xAxisField || 'name';
  const yKey = config?.yAxisField || 'value';
  const color = config?.chartConfig?.colorPalette?.[0] || "#FF8A00";

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface/90 backdrop-blur-md border border-borderLight/50 p-4 rounded-2xl shadow-2xl transition-all duration-300 scale-105">
          <p className="text-textTertiary text-[9px] font-black uppercase tracking-[0.2em] mb-2 font-display">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-textPrimary text-lg font-black font-display">
              {payload[0].value.toLocaleString()}
            </p>
            <span className="text-[10px] text-primary font-bold">Units</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
        <XAxis 
            dataKey={xKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--chart-axis)', fontSize: 10, fontWeight: 600 }} 
            dy={10}
        />
        <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--chart-axis)', fontSize: 10, fontWeight: 600 }} 
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey={yKey} 
          stroke={color} 
          strokeWidth={4}
          activeDot={{ r: 6, fill: "#fff", stroke: color, strokeWidth: 3 }}
          dot={{ r: 4, fill: "#fff", stroke: color, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartWidget;

