import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LabelList } from 'recharts';

const BarChartWidget = ({ data, config }) => {
  const xKey = config?.xAxisField || 'name';
  const yKey = config?.yAxisField || 'value';
  
  // Custom label renderer for clarity
  const renderCustomLabel = (props) => {
    const { x, y, width, value } = props;
    return (
      <text 
        x={x + width / 2} 
        y={y - 10} 
        fill="var(--text-secondary)" 
        textAnchor="middle" 
        fontSize={11} 
        fontWeight="bold"
      >
        {value.toLocaleString()}
      </text>
    );
  };

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
      <BarChart data={data} margin={{ top: 25, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
        <XAxis 
            dataKey={xKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--chart-axis)', fontSize: 11, fontWeight: 600 }} 
            dy={10}
        />
        <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--chart-axis)', fontSize: 11, fontWeight: 600 }} 
        />
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={{ fill: 'var(--surface-hover)', radius: 8 }} 
        />
        <Bar 
          dataKey={yKey} 
          fill="url(#barGradient)" 
          radius={[6, 6, 0, 0]} 
          barSize={24}
          animationDuration={1500}
        >
          <LabelList content={renderCustomLabel} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartWidget;

