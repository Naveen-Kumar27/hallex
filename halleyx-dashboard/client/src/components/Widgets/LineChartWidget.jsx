import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';

const LineChartWidget = ({ data, config }) => {
  const xKey = config?.xAxisField || 'name';
  const yKey = config?.yAxisField || 'value';

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
      <LineChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
        <defs>
          <filter id="shadow" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="4" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
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
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey={yKey} 
          stroke="var(--secondary)" 
          strokeWidth={4}
          filter="url(#shadow)"
          activeDot={{ r: 6, fill: "#fff", stroke: "var(--secondary)", strokeWidth: 3 }}
          dot={{ r: 4, fill: "#fff", stroke: "var(--secondary)", strokeWidth: 2 }}
          animationDuration={1500}
        >
          <LabelList 
            dataKey={yKey} 
            position="top" 
            offset={12} 
            style={{ fill: 'var(--text-secondary)', fontSize: '11px', fontWeight: 'bold' }} 
          />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartWidget;

