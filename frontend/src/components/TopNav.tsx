
import { Search, Bell, UserCircle } from 'lucide-react';

const TopNav = () => {
  return (
    <header className="h-16 flex items-center justify-between px-6 glass-panel border-t-0 border-x-0 z-30 transition-colors duration-200">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search markets (CMD+K)" 
            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-500"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-200 dark:border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Connected</span>
        </div>
        <div className="hidden sm:block px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 rounded-full border border-amber-200 dark:border-amber-500/20">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Testnet</span>
        </div>
        
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
        
        <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
          <Bell size={20} />
        </button>
        <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
          <UserCircle size={24} />
        </button>
      </div>
    </header>
  );
};

export default TopNav;
