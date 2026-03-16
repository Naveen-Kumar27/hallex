import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Download, Calendar, Filter, ArrowUpRight, TrendingUp, Activity, Users, DollarSign } from 'lucide-react';

const revenueData = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 2000, profit: 9800 },
  { name: 'Apr', revenue: 2780, profit: 3908 },
  { name: 'May', revenue: 1890, profit: 4800 },
  { name: 'Jun', revenue: 2390, profit: 3800 },
  { name: 'Jul', revenue: 3490, profit: 4300 },
];

const trafficData = [
  { name: 'Week 1', organic: 4000, paid: 2400 },
  { name: 'Week 2', organic: 3000, paid: 1398 },
  { name: 'Week 3', organic: 2000, paid: 9800 },
  { name: 'Week 4', organic: 2780, paid: 3908 },
];

const deviceData = [
  { name: 'Desktop', value: 400 },
  { name: 'Mobile', value: 300 },
  { name: 'Tablet', value: 300 },
  { name: 'Other', value: 200 },
];
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];

const stats = [
  { label: 'Total Revenue', value: '$124,500', growth: '+12.5%', icon: DollarSign, color: 'from-primary/20 to-primary/5' },
  { label: 'Active Users', value: '8,234', growth: '+5.2%', icon: Users, color: 'from-emerald-200/50 to-emerald-50' },
  { label: 'Conversion Rate', value: '3.4%', growth: '+1.1%', icon: Activity, color: 'from-violet-200/50 to-violet-50' },
  { label: 'Avg Session', value: '4m 32s', growth: '-0.4%', icon: TrendingUp, color: 'from-amber-200/50 to-amber-50' },
];

const PerformanceCard = ({ title, children, delay }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }}
    className="bg-white border border-borderLight rounded-3xl p-6 shadow-sm flex flex-col h-[350px]">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-sm font-bold text-textPrimary uppercase tracking-wider">{title}</h3>
      <button className="p-1.5 hover:bg-surface rounded-lg transition-colors"><Download className="w-4 h-4 text-textTertiary" /></button>
    </div>
    <div className="flex-1 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-borderLight p-3 rounded-xl shadow-xl">
        <p className="text-xs font-bold text-textSecondary mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && entry.name !== 'Active Users' ? `$${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('This Month');

  return (
    <MainLayout title="Performance Analytics">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
        
        {/* Header Toolbar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-textPrimary font-display">Performance Metrics</h1>
            <p className="text-sm text-textTertiary mt-1">Track your platform's growth and engagement.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-white border border-borderLight rounded-xl p-1 shadow-sm">
              {['Today', 'This Week', 'This Month', 'This Year'].map(range => (
                <button key={range} onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${timeRange === range ? 'bg-primary text-white shadow-md' : 'text-textSecondary hover:text-textPrimary'}`}>
                  {range}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-borderLight text-textPrimary text-sm font-bold rounded-xl hover:bg-surface transition-colors shadow-sm">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md">
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${s.color} border border-borderLight rounded-3xl p-6 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <s.icon className="w-16 h-16" />
              </div>
              <div className="w-10 h-10 bg-white/70 rounded-2xl flex items-center justify-center shadow-sm mb-4 relative z-10">
                <s.icon className="w-5 h-5 text-textPrimary" />
              </div>
              <p className="text-[10px] font-bold text-textTertiary uppercase tracking-widest mb-1 relative z-10">{s.label}</p>
              <h3 className="text-3xl font-bold text-textPrimary font-display relative z-10">{s.value}</h3>
              <div className="mt-3 flex items-center gap-1.5 relative z-10">
                <span className={`flex items-center text-xs font-bold ${s.growth.startsWith('+') ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {s.growth.startsWith('+') ? <ArrowUpRight className="w-3.5 h-3.5" /> : null}
                  {s.growth}
                </span>
                <span className="text-xs text-textTertiary font-semibold">vs last period</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PerformanceCard title="Revenue vs Profit (YTD)" delay={0.2}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </PerformanceCard>
          </div>
          
          <div className="lg:col-span-1">
            <PerformanceCard title="Traffic Devices" delay={0.3}>
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="45%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {deviceData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="text-xs font-bold text-textSecondary">{entry.name}</span>
                  </div>
                ))}
              </div>
            </PerformanceCard>
          </div>

          <div className="lg:col-span-3">
            <PerformanceCard title="Traffic Acquisition (Organic vs Paid)" delay={0.4}>
              <BarChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="organic" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]} />
                <Bar dataKey="paid" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </PerformanceCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
