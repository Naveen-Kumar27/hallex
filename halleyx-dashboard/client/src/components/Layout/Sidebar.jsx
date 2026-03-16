import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  CreditCard, 
  Users, 
  BarChart3, 
  Settings,
  HelpCircle
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: ShoppingCart, path: '/orders', label: 'Orders' },
    { icon: CreditCard, path: '/payments', label: 'Payments' },
    { icon: Users, path: '/users', label: 'Users' },
    { icon: BarChart3, path: '/analytics', label: 'Analytics' },
    { icon: Settings, path: '/settings', label: 'Settings' },
  ];

  return (
    <aside className="w-20 flex flex-col items-center py-8 bg-surface/90 backdrop-blur-xl border-r border-borderLight h-screen sticky top-0 z-40 transition-all duration-300">
      <div className="mb-10">
        <div className="w-12 h-12 bg-surface border border-borderLight rounded-2xl flex items-center justify-center text-primary shadow-xl rotate-3 hover:rotate-0 transition-all duration-500 group">
          <span className="font-black text-2xl text-gradient group-hover:scale-110 transition-transform">H</span>
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col gap-5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={item.label}
            className={({ isActive }) => `
              p-3.5 rounded-2xl transition-all duration-300 relative group
              ${isActive 
                ? 'text-primary shadow-[0_0_20px_rgb(var(--primary-rgb)/0.2)] border border-primary/20' 
                : 'text-textTertiary hover:bg-surfaceHover hover:text-primary border border-transparent'}
            `}
            style={({ isActive }) => isActive ? { backgroundColor: 'rgb(var(--primary-rgb) / 0.1)' } : {}}
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {/* Active Indicator Dot */}
                <div className={`absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-full transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-borderLight/30">
        <button className="p-3.5 text-textTertiary hover:bg-surfaceHover hover:text-secondary rounded-2xl transition-all border border-transparent hover:border-secondary/20 group">
          <HelpCircle size={22} strokeWidth={2} className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
