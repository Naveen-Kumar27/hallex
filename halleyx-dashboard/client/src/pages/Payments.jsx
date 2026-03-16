import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { 
  CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, 
  CheckCircle, Clock, XCircle, Filter, Download, Search,
  Zap, Shield, RefreshCw
} from 'lucide-react';

const mockTransactions = [
  { id: 'TXN-9821', customer: 'Naveen Kumar', amount: 12400, method: 'Visa •••• 4242', status: 'Completed', date: '2026-03-15', product: 'Enterprise Fiber 2Gbps' },
  { id: 'TXN-9820', customer: 'Isabella Sterling', amount: 3200, method: 'Mastercard •••• 8871', status: 'Completed', date: '2026-03-14', product: 'Secure VoIP Matrix' },
  { id: 'TXN-9819', customer: 'Benjamin Vance', amount: 7800, method: 'Stripe', status: 'Pending', date: '2026-03-14', product: 'Cloud VPC - Unlimited' },
  { id: 'TXN-9818', customer: 'Charlotte Kensington', amount: 960, method: 'Visa •••• 1192', status: 'Completed', date: '2026-03-13', product: 'Managed Security Shield' },
  { id: 'TXN-9817', customer: 'Sebastian Chen', amount: 5500, method: 'Bank Transfer', status: 'Failed', date: '2026-03-13', product: 'Neural Network Gateway' },
  { id: 'TXN-9816', customer: 'Sophia Rodriguez', amount: 2100, method: 'Visa •••• 7731', status: 'Completed', date: '2026-03-12', product: 'Quantum Signal Hub' },
  { id: 'TXN-9815', customer: 'Julian Hawthorne', amount: 15200, method: 'Stripe', status: 'Completed', date: '2026-03-12', product: 'Global SD-WAN Bridge' },
  { id: 'TXN-9814', customer: 'Amelia Sinclair', amount: 4300, method: 'Mastercard •••• 3319', status: 'Pending', date: '2026-03-11', product: 'Edge Compute Node X1' },
  { id: 'TXN-9813', customer: 'Theodore Foster', amount: 8900, method: 'Bank Transfer', status: 'Completed', date: '2026-03-10', product: 'Enterprise Fiber 2Gbps' },
  { id: 'TXN-9812', customer: 'Harper Holloway', amount: 2750, method: 'Visa •••• 5521', status: 'Completed', date: '2026-03-09', product: 'Secure VoIP Matrix' },
];

const statusConfig = {
  Completed: { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle },
  Pending:   { color: 'text-amber-600 bg-amber-50 border-amber-200',     dot: 'bg-amber-400',   icon: Clock },
  Failed:    { color: 'text-red-600 bg-red-50 border-red-200',           dot: 'bg-red-500',     icon: XCircle },
};

const kpis = [
  { label: 'Total Revenue',      value: '$63,110',  growth: '+18.4%',  positive: true,  icon: TrendingUp,  color: 'from-primary/20 to-primary/5' },
  { label: 'Transactions',       value: '10',        growth: '+12.1%',  positive: true,  icon: CreditCard,  color: 'from-violet-200/50 to-violet-50' },
  { label: 'Success Rate',       value: '80%',       growth: '+2.3%',   positive: true,  icon: CheckCircle, color: 'from-emerald-200/50 to-emerald-50' },
  { label: 'Avg. Order Value',   value: '$6,311',    growth: '-3.1%',   positive: false, icon: Zap,         color: 'from-amber-200/50 to-amber-50' },
];

const Payments = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = mockTransactions.filter(t => {
    const matchSearch = t.customer.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Customer', 'Amount', 'Method', 'Status', 'Date', 'Product'];
    const rows = filtered.map(t => [t.id, t.customer, t.amount, t.method, t.status, t.date, t.product]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'payments.csv'; a.click();
  };

  return (
    <MainLayout title="Payments">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {kpis.map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-gradient-to-br ${kpi.color} border border-borderLight rounded-3xl p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-white/70 rounded-2xl flex items-center justify-center shadow-sm">
                  <kpi.icon className="w-5 h-5 text-textPrimary" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold ${kpi.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                  {kpi.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {kpi.growth}
                </span>
              </div>
              <p className="text-[10px] font-bold text-textTertiary uppercase tracking-widest mb-1">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-textPrimary font-display">{kpi.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl w-fit">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-700">PCI-DSS Compliant · AES-256 Encryption · All transactions are secured</span>
        </div>

        {/* Transactions Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white border border-borderLight rounded-3xl overflow-hidden shadow-sm">
          
          {/* Toolbar */}
          <div className="p-6 border-b border-borderLight flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-textPrimary font-display">Transaction Ledger</h2>
              <p className="text-xs text-textTertiary mt-0.5">{filtered.length} records found</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textTertiary" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search transactions..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-surface border border-borderLight rounded-xl focus:outline-none focus:border-primary text-textPrimary placeholder-textTertiary" />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 text-sm bg-surface border border-borderLight rounded-xl focus:outline-none text-textPrimary">
                <option>All</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
              <button onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface border-b border-borderLight">
                  {['Transaction ID', 'Customer', 'Product', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold text-textTertiary uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-borderLight">
                {filtered.map((t, i) => {
                  const cfg = statusConfig[t.status];
                  return (
                    <motion.tr key={t.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-surface/50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-mono font-bold text-primary">{t.id}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-textPrimary">{t.customer}</td>
                      <td className="px-6 py-4 text-sm text-textSecondary">{t.product}</td>
                      <td className="px-6 py-4 text-sm font-bold text-textPrimary">${t.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-textSecondary">{t.method}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-textTertiary">{t.date}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-textTertiary">
                <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-semibold">No transactions found</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Payments;
