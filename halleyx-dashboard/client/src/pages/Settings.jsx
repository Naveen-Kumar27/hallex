import React, { useState, useRef } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api';
import { 
  User, Shield, CreditCard, Bell, Key, Smartphone, 
  Mail, Link as LinkIcon, Download, LogOut, CheckCircle2,
  Camera, MapPin, Briefcase, Phone, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    jobTitle: user?.jobTitle || '',
    phoneNumber: user?.phoneNumber || '',
    location: user?.location || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await authApi.updateProfile(formData);
      updateUser(updatedUser);
      toast.success("Profile synchronized successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error("Image must be less than 1MB");
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setIsUploading(true);
    try {
      const { avatar } = await authApi.uploadAvatar(formData);
      updateUser({ ...user, avatar });
      toast.success("Avatar updated!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const API_URL = 'http://localhost:5000';

  return (
    <MainLayout title="Enterprise Settings">
      <div className="max-w-7xl mx-auto pb-12 animate-fade-in flex flex-col lg:flex-row gap-8 px-4">
        
        {/* Sidebar Nav */}
        <div className="lg:w-72 flex-shrink-0 space-y-2">
          <div className="bg-surface/50 backdrop-blur-xl border border-borderLight rounded-3xl p-4 mb-6 shadow-sm">
             <div className="flex items-center gap-4 px-2 py-2">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary/20 bg-surface flex items-center justify-center text-primary font-bold text-xl">
                  {user?.avatar ? (
                    <img 
                      src={`${API_URL}${user.avatar}`} 
                      alt={user.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366F1&color=fff`;
                      }}
                    />
                  ) : user?.name?.charAt(0) || 'U'}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-textPrimary truncate">{user?.name}</h3>
                  <p className="text-[10px] text-textTertiary font-black uppercase tracking-widest truncate">{user?.jobTitle || 'Platform User'}</p>
                </div>
             </div>
          </div>

          <div className="space-y-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-5 py-3.5 text-sm font-bold rounded-2xl transition-all group ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' 
                    : 'text-textSecondary hover:bg-surface hover:text-textPrimary'
                }`}>
                <div className="flex items-center gap-3">
                  <tab.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-white' : 'text-textTertiary'}`} />
                  {tab.label}
                </div>
                {activeTab === tab.id && <motion.div layoutId="activeTabIcon" className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />}
              </button>
            ))}
          </div>

          <div className="pt-8 px-2">
             <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                <LogOut size={18} />
                Terminate Session
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card p-6 sm:p-10 relative overflow-hidden min-h-[600px]">
          <AnimatePresence mode="wait">
            
            {activeTab === 'profile' && (
              <motion.div 
                key="profile" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                className="space-y-10"
              >
                <div>
                  <h2 className="text-2xl font-black text-textPrimary font-display tracking-tight">Public Profile</h2>
                  <p className="text-sm text-textTertiary mt-2">Update your enterprise identity across the Halleyx Ecosystem.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 bg-surface/40 p-6 rounded-[2.5rem] border border-borderLight/50">
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-4xl font-display font-bold relative z-10 transition-transform group-hover:scale-105 duration-500">
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      )}
                      {user?.avatar ? (
                        <img 
                          src={`${API_URL}${user.avatar}`} 
                          alt={user.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366F1&color=fff`;
                          }}
                        />
                      ) : user?.name?.charAt(0) || 'U'}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current.click()}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20"
                    >
                      <Camera size={18} />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-textPrimary text-lg">Identity Credentials</h3>
                    <p className="text-xs text-textTertiary leading-relaxed max-w-xs">
                      Square JPG, GIF or PNG. Max size 1MB. Recommended 400x400 for high resolution rendering.
                    </p>
                    <div className="flex gap-4 pt-1">
                       <button onClick={() => fileInputRef.current.click()} className="text-xs font-black uppercase tracking-widest text-primary hover:underline">Upload New</button>
                       <button className="text-xs font-black uppercase tracking-widest text-textTertiary hover:text-red-500">Remove</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-textTertiary uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-textTertiary" />
                      <input 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-surface border border-borderLight rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/40 text-textPrimary font-bold text-sm transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-textTertiary uppercase tracking-[0.2em] ml-1">Job Title</label>
                    <div className="relative">
                      <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-textTertiary" />
                      <input 
                        name="jobTitle"
                        placeholder="e.g. Lead Designer"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-surface border border-borderLight rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/40 text-textPrimary font-bold text-sm transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-textTertiary uppercase tracking-[0.2em] ml-1">Email (ReadOnly)</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-textTertiary" />
                      <input 
                        value={user?.email} 
                        readOnly 
                        className="w-full pl-12 pr-4 py-3.5 bg-surfaceHover/50 border border-borderLight rounded-2xl text-textTertiary font-medium text-sm cursor-not-allowed" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-textTertiary uppercase tracking-[0.2em] ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-textTertiary" />
                      <input 
                        name="phoneNumber"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-surface border border-borderLight rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/40 text-textPrimary font-bold text-sm transition-all" 
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-textTertiary uppercase tracking-[0.2em] ml-1">Location</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-textTertiary" />
                      <input 
                        name="location"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-surface border border-borderLight rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/40 text-textPrimary font-bold text-sm transition-all" 
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-textTertiary uppercase tracking-[0.2em] ml-1">Professional Bio</label>
                    <textarea 
                      name="bio"
                      rows="4" 
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-surface border border-borderLight rounded-[1.5rem] focus:ring-4 focus:ring-primary/5 focus:border-primary/40 text-textPrimary font-medium text-sm transition-all resize-none shadow-inner"
                      placeholder="Write a few sentences about your role..."
                    ></textarea>
                  </div>
                </div>

                <div className="pt-8 flex items-center justify-between border-t border-borderLight">
                   <div className="hidden sm:block">
                     <p className="text-xs text-textTertiary italic">Last synchronized: {new Date().toLocaleTimeString()}</p>
                   </div>
                   <button 
                    disabled={isSaving}
                    onClick={handleSaveProfile} 
                    className="w-full sm:w-auto px-10 py-4 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Synchronize Identity'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Other tabs remain similar but with consistent styling */}
            {activeTab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div>
                   <h2 className="text-2xl font-black text-textPrimary font-display tracking-tight">Security Protocols</h2>
                   <p className="text-sm text-textTertiary mt-2">Manage your core encryption and verification methods.</p>
                </div>

                <div className="space-y-6">
                   <div className="p-6 bg-surface/40 border border-borderLight/50 rounded-3xl flex items-center justify-between group hover:border-primary/30 transition-all">
                      <div className="flex gap-5 items-center">
                         <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center border border-borderLight group-hover:scale-110 transition-transform"><Key className="w-6 h-6 text-primary" /></div>
                         <div>
                            <h4 className="text-base font-bold text-textPrimary">Access Credentials</h4>
                            <p className="text-xs text-textTertiary mt-1">Update your password regularly for better security</p>
                         </div>
                      </div>
                      <button className="px-5 py-2.5 bg-white border border-borderLight text-textPrimary text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">Update</button>
                   </div>

                   <div className="p-6 bg-emerald-50/30 border border-emerald-100 rounded-3xl flex items-center justify-between">
                      <div className="flex gap-5 items-center">
                         <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center border border-emerald-200"><Smartphone className="w-6 h-6 text-emerald-600" /></div>
                         <div>
                            <h4 className="text-base font-bold text-emerald-900">Multi-Factor Intel</h4>
                            <p className="text-xs text-emerald-700/70 font-bold flex items-center gap-1.5 mt-1"><CheckCircle2 size={14} /> Active via Google Authenticator</p>
                         </div>
                      </div>
                      <button className="px-5 py-2.5 bg-white text-emerald-700 text-xs font-black uppercase tracking-widest rounded-xl border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">Manage</button>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div key="billing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                <div className="bg-gradient-to-br from-[#0B0F1A] via-[#161B2C] to-[#1F263D] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
                  <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700"><CreditCard className="w-48 h-48" /></div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                       <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/10 backdrop-blur-md">Cloud Identity: Managed</span>
                    </div>
                    <div>
                      <h3 className="text-4xl font-black font-display tracking-tight text-white mb-2">Enterprise Core</h3>
                      <p className="text-lg text-indigo-200 font-medium">Unlimited Workspace Metrics · $1,200 / month</p>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-4">
                      <button className="px-8 py-3.5 bg-white text-slate-900 text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all shadow-xl shadow-black/20 active:scale-95">Upgrade License</button>
                      <button className="px-8 py-3.5 bg-white/10 text-white border border-white/20 text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-white/20 transition-all backdrop-blur-md flex items-center gap-2">
                        <Download size={18} /> Invoices
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                 <div className="space-y-6">
                    {[
                      { title: 'Security Alerts', desc: 'Real-time login and access telemetry notification.', toggle: true },
                      { title: 'Payment Intel', desc: 'Sync monthly budget and billing cycle updates.', toggle: true },
                      { title: 'Network Orders', desc: 'Broadcast alerts when high-value orders hit the grid.', toggle: false },
                      { title: 'AI Workspace', desc: 'Signals when background analytical processing completes.', toggle: true },
                    ].map((item, idx) => (
                      <div key={idx} className="p-6 flex items-center justify-between bg-surface/30 border border-borderLight/50 rounded-3xl hover:bg-white transition-all group">
                        <div className="pr-6">
                          <h4 className="text-base font-bold text-textPrimary group-hover:text-primary transition-colors">{item.title}</h4>
                          <p className="text-xs text-textTertiary mt-1 font-medium">{item.desc}</p>
                        </div>
                        <div className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-all duration-300 relative ${item.toggle ? 'bg-primary' : 'bg-borderLight'}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 absolute top-1 ${item.toggle ? 'left-8' : 'left-1'}`} />
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
