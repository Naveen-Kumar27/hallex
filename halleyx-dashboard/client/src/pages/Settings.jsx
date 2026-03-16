import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  User, Shield, CreditCard, Bell, Key, Smartphone, 
  Mail, Link as LinkIcon, Download, LogOut, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <MainLayout title="Settings">
      <div className="max-w-7xl mx-auto pb-12 animate-fade-in flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="md:w-64 flex-shrink-0 space-y-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-textSecondary hover:bg-surface hover:text-textPrimary'
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white border border-borderLight rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <AnimatePresence mode="popLayout">
            
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-textPrimary font-display">Public Profile</h2>
                  <p className="text-sm text-textTertiary mt-1">This information will be displayed publicly so be careful what you share.</p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-display font-bold shadow-lg">
                    {user?.name?.charAt(0) || 'N'}
                  </div>
                  <div>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-surface border border-borderLight text-textPrimary text-sm font-bold rounded-xl hover:bg-borderLight transition-colors">Change Avatar</button>
                      <button className="px-4 py-2 text-red-500 text-sm font-bold hover:bg-red-50 rounded-xl transition-colors">Remove</button>
                    </div>
                    <p className="text-xs text-textTertiary mt-2">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-textTertiary uppercase tracking-wider mb-1.5 block">Full Name</label>
                    <input defaultValue={user?.name || "Naveen Kumar"} className="w-full px-4 py-2.5 text-sm bg-surface border border-borderLight rounded-xl focus:outline-none focus:border-primary text-textPrimary" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-textTertiary uppercase tracking-wider mb-1.5 block">Email Address</label>
                    <input defaultValue={user?.email || "naveen@halleyx.ai"} type="email" className="w-full px-4 py-2.5 text-sm bg-surface border border-borderLight rounded-xl focus:outline-none focus:border-primary text-textPrimary" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-textTertiary uppercase tracking-wider mb-1.5 block">Bio</label>
                    <textarea rows="4" defaultValue="Lead Platform Architect & AI Specialist at Halleyx Ecosystems." className="w-full px-4 py-3 text-sm bg-surface border border-borderLight rounded-xl focus:outline-none focus:border-primary text-textPrimary resize-none"></textarea>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-borderLight flex justify-end">
                  <button onClick={handleSave} className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md">
                    Save Changes
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-textPrimary font-display">Security Settings</h2>
                  <p className="text-sm text-textTertiary mt-1">Manage your password, 2FA, and connected devices.</p>
                </div>

                <div className="space-y-6">
                  <div className="p-5 border border-borderLight rounded-2xl flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center"><Key className="w-5 h-5 text-textSecondary" /></div>
                      <div>
                        <h4 className="text-sm font-bold text-textPrimary">Password</h4>
                        <p className="text-xs text-textTertiary">Last changed 3 months ago</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-surface text-textPrimary text-sm font-bold rounded-xl hover:bg-borderLight transition-colors">Update</button>
                  </div>

                  <div className="p-5 border border-emerald-200 bg-emerald-50 rounded-2xl flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center"><Smartphone className="w-5 h-5 text-emerald-600" /></div>
                      <div>
                        <h4 className="text-sm font-bold text-textPrimary">Two-Factor Authentication</h4>
                        <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Enabled via Authenticator App</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white text-emerald-700 text-sm font-bold rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors">Manage</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div key="billing" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-textPrimary font-display">Billing & Plans</h2>
                  <p className="text-sm text-textTertiary mt-1">Manage your subscription and billing details.</p>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><CreditCard className="w-32 h-32" /></div>
                  <div className="relative z-10">
                    <span className="px-2.5 py-1 bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/10 mb-4 inline-block">Current Plan</span>
                    <h3 className="text-3xl font-bold font-display mb-1">Enterprise Plus</h3>
                    <p className="text-sm text-indigo-200 mb-6">$1,200 / month · Renews Oct 15, 2026</p>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-white text-slate-900 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors">Manage Plan</button>
                      <button className="px-4 py-2 bg-white/10 text-white border border-white/20 text-sm font-bold rounded-xl hover:bg-white/20 transition-colors"><Download className="w-4 h-4 inline-block mr-2" />Invoices</button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-textPrimary mb-4">Payment Methods</h4>
                  <div className="p-5 border border-borderLight rounded-2xl flex items-center justify-between group hover:border-primary transition-colors cursor-pointer">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-8 bg-surface rounded flex items-center justify-center border border-borderLight font-mono text-xs font-bold text-textSecondary uppercase">Visa</div>
                      <div>
                        <h4 className="text-sm font-bold text-textPrimary group-hover:text-primary transition-colors">Visa ending in 4242</h4>
                        <p className="text-xs text-textTertiary">Expires 12/28</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">Default</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-textPrimary font-display">Notification Preferences</h2>
                  <p className="text-sm text-textTertiary mt-1">Control when and how you receive alerts.</p>
                </div>

                <div className="space-y-0 border border-borderLight rounded-2xl overflow-hidden divide-y divide-borderLight">
                  {[
                    { title: 'Security Alerts', desc: 'Get notified of unrecognized logins or password changes.', toggle: true },
                    { title: 'Billing Updates', desc: 'Receive monthly invoices and subscription change alerts.', toggle: true },
                    { title: 'New Orders', desc: 'Get an email every time a new enterprise order is placed.', toggle: false },
                    { title: 'AI Assistant', desc: 'Alerts when background dashboard generation completes.', toggle: true },
                  ].map((item, idx) => (
                    <div key={idx} className="p-5 flex items-center justify-between bg-white hover:bg-surface/50 transition-colors">
                      <div className="pr-4">
                        <h4 className="text-sm font-bold text-textPrimary">{item.title}</h4>
                        <p className="text-xs text-textTertiary mt-0.5">{item.desc}</p>
                      </div>
                      <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${item.toggle ? 'bg-primary' : 'bg-borderLight'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${item.toggle ? 'translate-x-6' : ''}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
