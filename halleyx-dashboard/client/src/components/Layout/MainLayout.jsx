import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LogOut, Search, Bell, Sun, Moon } from 'lucide-react';
import NotificationPanel from '../UI/NotificationPanel';
import CommandPalette from '../UI/CommandPalette';
import Sidebar from './Sidebar';

const MainLayout = ({ children, title = "Customer Orders" }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-textPrimary font-sans antialiased transition-colors duration-300">
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Subtle background glow for dark mode */}
        <div 
          className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none"
          style={{ backgroundColor: 'rgb(var(--primary-rgb) / 0.05)' }}
        ></div>
        <div 
          className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full blur-[100px] pointer-events-none"
          style={{ backgroundColor: 'rgb(var(--secondary-rgb) / 0.05)' }}
        ></div>

        {/* Top Header */}
        <header 
          className="h-16 backdrop-blur-md border-b border-borderLight flex items-center justify-between px-8 sticky top-0 z-30 transition-all duration-300"
          style={{ backgroundColor: 'rgb(var(--surface-rgb) / 0.8)' }}
        >
          <div className="flex items-center gap-4">
             <h1 className="text-xl font-bold text-gradient tracking-tight">{title}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div 
              className="relative group flex items-center cursor-pointer"
              onClick={() => setIsCommandPaletteOpen(true)}
            >
               <Search className="absolute left-3 h-4 w-4 text-textTertiary" />
               <input 
                 type="text" 
                 placeholder="Search anything..." 
                 readOnly
                 className="pl-10 pr-12 py-2 bg-background border border-borderLight/20 rounded-xl text-sm cursor-pointer transition-all hover:border-primary/50 outline-none w-64 text-textPrimary"
               />
               <div className="absolute right-2 px-1.5 py-0.5 border border-borderLight/30 rounded text-[10px] text-textTertiary font-mono bg-surface pointer-events-none group-focus-within:hidden font-bold">
                 ⌘K
               </div>
            </div>

            <div className="flex items-center gap-4 border-l border-borderLight pl-6">
              <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-textSecondary hover:bg-surfaceHover hover:text-primary transition-all duration-300 border border-transparent hover:border-borderLight"
                title={`Switch to ${theme === 'light' ? 'Midnight' : 'Light'} Mode`}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <div className="relative">
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className={`p-2.5 rounded-xl transition-all relative border ${isNotifOpen ? 'text-primary border-primary/20' : 'text-textSecondary hover:bg-surfaceHover border-transparent'}`}
                  style={isNotifOpen ? { backgroundColor: 'rgb(var(--primary-rgb) / 0.1)' } : {}}
                >
                   <Bell size={18} />
                   <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-surface shadow-[0_0_10px_rgb(var(--primary-rgb)/0.8)]"></span>
                </button>
                <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
              </div>
              
              <div className="flex items-center gap-3 ml-2 pr-2">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-textPrimary leading-none">{user?.name || "Premium User"}</p>
                    <p className="text-[10px] text-primary mt-1 uppercase tracking-widest font-black opacity-80">{user?.jobTitle || "Admin Member"}</p>
                 </div>
                 <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-textPrimary font-bold overflow-hidden border border-white/10 shadow-lg relative bg-surface"
                    style={{ background: !user?.avatar ? 'linear-gradient(135deg, rgb(var(--primary-rgb) / 0.3), rgb(var(--secondary-rgb) / 0.3))' : 'none' }}
                  >
                    {user?.avatar ? (
                      <img 
                        src={`http://localhost:5000${user.avatar}`} 
                        alt={user.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366F1&color=fff`;
                        }}
                      />
                    ) : (
                      user?.name?.charAt(0) || "B"
                    )}
                 </div>
              </div>

              <button 
                onClick={logout}
                className="p-2.5 text-textTertiary hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8">
           {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
