import { useState, useEffect } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';

const Dashboard = () => {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  // Listen for theme changes to update the TradingView widget theme
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-6 h-full min-h-[700px]">
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-3 mt-1.5 text-[13px] text-slate-500 font-medium">
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Binance Testnet</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>Last Activity: Just now</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel rounded-xl p-4 min-w-[180px] shadow-sm">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Margin Balance</div>
            <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white mt-1">$24,500.20</div>
          </div>
          <div className="glass-panel rounded-xl p-4 min-w-[180px] shadow-sm">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Unrealized PNL</div>
            <div className="font-mono text-2xl font-bold text-emerald-500 mt-1">+$1,240.50</div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl flex-1 overflow-hidden p-1 shadow-sm relative z-10">
        <AdvancedRealTimeChart 
          key={isDark ? "dark" : "light"}
          symbol="BINANCE:BTCUSDT" 
          theme={isDark ? "dark" : "light"} 
          autosize 
          allow_symbol_change={true} 
          hide_side_toolbar={false}
          backgroundColor={isDark ? "#0f172a" : "#ffffff"}
        />
      </div>
    </div>
  );
};

export default Dashboard;
