
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
          <div className="h-16 w-full"></div> {/* Bottom padding */}
        </main>
        <footer className="absolute bottom-0 w-full md:w-[calc(100%-16rem)] right-0 h-8 flex justify-between items-center px-6 glass-panel border-b-0 border-x-0 z-50">
          <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            SYSTEM OPERATIONAL
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
