import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import {
  Users as UsersIcon, Shield, UserCheck, UserX, Search,
  Plus, MoreVertical, Mail, Phone, Globe, Crown, User, Wrench
} from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Naveen Kumar',         email: 'naveen@halleyx.ai',         role: 'Super Admin',  status: 'Active',   avatar: 'NK', country: 'India',     lastActive: '2 mins ago',   orders: 24 },
  { id: 2, name: 'Isabella Sterling',    email: 'isabella@corporate.ai',      role: 'Manager',      status: 'Active',   avatar: 'IS', country: 'UK',        lastActive: '1 hr ago',     orders: 12 },
  { id: 3, name: 'Benjamin Vance',       email: 'benjamin@corporate.ai',      role: 'Analyst',      status: 'Active',   avatar: 'BV', country: 'USA',       lastActive: '3 hrs ago',    orders: 8  },
  { id: 4, name: 'Charlotte Kensington', email: 'charlotte@corporate.ai',     role: 'Sales Rep',    status: 'Inactive', avatar: 'CK', country: 'Canada',    lastActive: '2 days ago',   orders: 5  },
  { id: 5, name: 'Sebastian Chen',       email: 'sebastian@corporate.ai',     role: 'Analyst',      status: 'Active',   avatar: 'SC', country: 'Singapore', lastActive: '30 mins ago',  orders: 17 },
  { id: 6, name: 'Sophia Rodriguez',     email: 'sophia@corporate.ai',        role: 'Manager',      status: 'Active',   avatar: 'SR', country: 'UAE',       lastActive: '5 hrs ago',    orders: 9  },
  { id: 7, name: 'Julian Hawthorne',     email: 'julian@corporate.ai',        role: 'Sales Rep',    status: 'Suspended',avatar: 'JH', country: 'Germany',   lastActive: '1 week ago',   orders: 3  },
  { id: 8, name: 'Amelia Sinclair',      email: 'amelia@corporate.ai',        role: 'Analyst',      status: 'Active',   avatar: 'AS', country: 'Japan',     lastActive: '15 mins ago',  orders: 21 },
];

const roleConfig = {
  'Super Admin': { color: 'text-violet-700 bg-violet-50 border-violet-200', icon: Crown },
  'Manager':     { color: 'text-blue-700 bg-blue-50 border-blue-200',       icon: Shield },
  'Analyst':     { color: 'text-primary bg-primary/10 border-primary/20',   icon: Wrench },
  'Sales Rep':   { color: 'text-amber-700 bg-amber-50 border-amber-200',    icon: User },
};

const statusConfig = {
  Active:    { dot: 'bg-emerald-500', text: 'text-emerald-600' },
  Inactive:  { dot: 'bg-slate-400',   text: 'text-slate-500' },
  Suspended: { dot: 'bg-red-500',     text: 'text-red-600' },
};

const avatarColors = ['bg-violet-500', 'bg-primary', 'bg-amber-500', 'bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-slate-500', 'bg-indigo-500'];

const stats = [
  { label: 'Total Users',    value: '8',  icon: UsersIcon,  color: 'from-primary/20 to-primary/5' },
  { label: 'Active Users',   value: '6',  icon: UserCheck,  color: 'from-emerald-200/50 to-emerald-50' },
  { label: 'Inactive',       value: '1',  icon: UserX,      color: 'from-slate-200/50 to-slate-50' },
  { label: 'Admins',         value: '1',  icon: Crown,      color: 'from-violet-200/50 to-violet-50' },
];

const UsersPage = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <MainLayout title="Users">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-gradient-to-br ${s.color} border border-borderLight rounded-3xl p-6`}>
              <div className="w-10 h-10 bg-white/70 rounded-2xl flex items-center justify-center shadow-sm mb-4">
                <s.icon className="w-5 h-5 text-textPrimary" />
              </div>
              <p className="text-[10px] font-bold text-textTertiary uppercase tracking-widest mb-1">{s.label}</p>
              <h3 className="text-3xl font-bold text-textPrimary font-display">{s.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* User Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white border border-borderLight rounded-3xl overflow-hidden shadow-sm">
          
          {/* Toolbar */}
          <div className="p-6 border-b border-borderLight flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-textPrimary font-display">Team Directory</h2>
              <p className="text-xs text-textTertiary mt-0.5">{filtered.length} members</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textTertiary" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-surface border border-borderLight rounded-xl focus:outline-none focus:border-primary text-textPrimary placeholder-textTertiary" />
              </div>
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                className="px-3 py-2.5 text-sm bg-surface border border-borderLight rounded-xl focus:outline-none text-textPrimary">
                <option>All</option>
                <option>Super Admin</option>
                <option>Manager</option>
                <option>Analyst</option>
                <option>Sales Rep</option>
              </select>
              <button onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors whitespace-nowrap">
                <Plus className="w-4 h-4" /> Add User
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface border-b border-borderLight">
                  {['Member', 'Role', 'Status', 'Country', 'Orders', 'Last Active'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold text-textTertiary uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-borderLight">
                {filtered.map((u, i) => {
                  const roleCfg = roleConfig[u.role];
                  const statusCfg = statusConfig[u.status];
                  const RoleIcon = roleCfg.icon;
                  return (
                    <motion.tr key={u.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 ${avatarColors[i % avatarColors.length]} rounded-2xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {u.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-textPrimary">{u.name}</p>
                            <p className="text-xs text-textTertiary">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${roleCfg.color}`}>
                          <RoleIcon className="w-3 h-3" />
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-xs font-bold ${statusCfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} animate-pulse`} />
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-textSecondary flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-textTertiary" />{u.country}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-textPrimary">{u.orders}</td>
                      <td className="px-6 py-4 text-xs text-textTertiary">{u.lastActive}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-textTertiary">
                <UsersIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-semibold">No users found</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-borderLight rounded-3xl p-8 w-full max-w-md shadow-2xl mx-4">
              <h3 className="text-xl font-bold text-textPrimary font-display mb-6">Invite New Member</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-textTertiary uppercase tracking-wider mb-1.5 block">Full Name</label>
                  <input placeholder="e.g. Alexander Mercer"
                    className="w-full px-4 py-2.5 text-sm bg-surface border border-borderLight rounded-xl focus:outline-none focus:border-primary text-textPrimary placeholder-textTertiary" />
                </div>
                <div>
                  <label className="text-xs font-bold text-textTertiary uppercase tracking-wider mb-1.5 block">Email Address</label>
                  <input placeholder="member@corporate.ai" type="email"
                    className="w-full px-4 py-2.5 text-sm bg-surface border border-borderLight rounded-xl focus:outline-none focus:border-primary text-textPrimary placeholder-textTertiary" />
                </div>
                <div>
                  <label className="text-xs font-bold text-textTertiary uppercase tracking-wider mb-1.5 block">Role</label>
                  <select className="w-full px-4 py-2.5 text-sm bg-surface border border-borderLight rounded-xl focus:outline-none text-textPrimary">
                    <option>Analyst</option>
                    <option>Sales Rep</option>
                    <option>Manager</option>
                    <option>Super Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold border border-borderLight rounded-xl text-textSecondary hover:bg-surface transition-colors">
                  Cancel
                </button>
                <button onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
                  Send Invite
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default UsersPage;
