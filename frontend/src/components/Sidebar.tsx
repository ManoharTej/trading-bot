
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusSquare, 
  ListOrdered, 
  History, 
  Terminal, 
  Settings 
} from 'lucide-react';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
    <rect width="48" height="48" rx="12" fill="currentColor" className="text-emerald-500 bg-opacity-10" fillOpacity="0.1" />
    <path d="M14 24L20 18L26 26L34 16" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M26 16H34V24" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 20V34" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 20V34" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'New Order', path: '/order', icon: <PlusSquare size={18} /> },
    { name: 'Open Orders', path: '/open-orders', icon: <ListOrdered size={18} /> },
    { name: 'Order History', path: '/history', icon: <History size={18} /> },
    { name: 'Logs', path: '/logs', icon: <Terminal size={18} /> },
  ];

  return (
    <nav className="hidden md:flex h-screen w-64 flex-col glass-panel border-y-0 border-l-0 z-40 transition-colors duration-200">
      <div className="h-16 flex items-center px-6 border-b border-slate-200/50 dark:border-slate-800/50">
        <Logo />
        <h1 className="font-display text-lg font-bold text-slate-900 dark:text-white tracking-tight">TradeFlow</h1>
      </div>
      
      <div className="py-4 px-3 flex-1 flex flex-col gap-1 overflow-y-auto">
        <div className="px-3 pb-2 pt-2">
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">Menu</p>
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          );
        })}
        
        <div className="mt-auto">
          <div className="px-3 pb-2 pt-4">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">System</p>
          </div>
          <NavLink
            to="/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
              location.pathname === '/settings'
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
