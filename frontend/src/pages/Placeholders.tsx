

const mockOpenOrders = [
  { id: '109348', symbol: 'BTCUSDT', type: 'LIMIT', side: 'BUY', price: '$59,000.00', amount: '0.5 BTC', filled: '0.00%', status: 'NEW' },
  { id: '109349', symbol: 'ETHUSDT', type: 'STOP_MARKET', side: 'SELL', price: '$3,100.00', amount: '10.0 ETH', filled: '0.00%', status: 'NEW' },
];

const mockOrderHistory = [
  { id: '108112', date: '2026-06-11 10:14:22', symbol: 'SOLUSDT', type: 'MARKET', side: 'BUY', price: '$142.50', amount: '50 SOL', status: 'FILLED' },
  { id: '108095', date: '2026-06-10 16:45:10', symbol: 'BTCUSDT', type: 'LIMIT', side: 'SELL', price: '$62,150.00', amount: '0.1 BTC', status: 'FILLED' },
  { id: '107988', date: '2026-06-09 09:22:05', symbol: 'BNBUSDT', type: 'LIMIT', side: 'BUY', price: '$590.00', amount: '5 BNB', status: 'CANCELED' },
];

export const OpenOrders = () => {
  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Open Orders</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your active limit and stop orders.</p>
      </div>
      
      <div className="glass-panel rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type / Side</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Filled</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {mockOpenOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-300">#{order.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{order.symbol}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-xs font-bold ${order.side === 'BUY' ? 'text-emerald-500' : 'text-rose-500'}`}>{order.side}</span>
                      <span className="text-xs text-slate-500 font-mono mt-0.5">{order.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-700 dark:text-slate-300">{order.price}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-700 dark:text-slate-300">{order.amount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-0"></div>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{order.filled}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-semibold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 px-3 py-1.5 rounded-md transition-colors">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OpenOrders;

export const OrderHistory = () => {
  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Order History</h2>
        <p className="text-sm text-slate-500 mt-1">A complete record of your filled and canceled orders.</p>
      </div>
      
      <div className="glass-panel rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type / Side</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {mockOrderHistory.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-mono text-slate-700 dark:text-slate-300">{order.date.split(' ')[0]}</span>
                      <span className="text-xs text-slate-500 font-mono mt-0.5">{order.date.split(' ')[1]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{order.symbol}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.side === 'BUY' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                        {order.side}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{order.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-700 dark:text-slate-300">{order.price}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-700 dark:text-slate-300">{order.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${order.status === 'FILLED' ? 'text-emerald-500' : 'text-slate-500'}`}>
                      {order.status === 'FILLED' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const Logs = () => {
  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight">System Logs</h2>
        <p className="text-sm text-slate-500 mt-1">Live streaming diagnostic events from your trading bot.</p>
      </div>
      
      <div className="bg-slate-950 border border-slate-800 rounded-xl flex flex-col flex-1 shadow-xl overflow-hidden relative">
        <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between backdrop-blur-md">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600"></div>
          </div>
          <span className="font-mono text-[11px] text-slate-500 font-medium uppercase tracking-wider absolute left-1/2 -translate-x-1/2">system.log</span>
        </div>
        
        <div className="p-5 flex-1 overflow-y-auto font-mono text-[13px] leading-relaxed">
          <div className="mb-1 text-slate-300"><span className="text-slate-500">[10:42:15.001] </span><span className="text-cyan-400 font-semibold">INFO</span> System startup sequence initiated. Loading configuration...</div>
          <div className="mb-1 text-slate-300"><span className="text-slate-500">[10:42:15.045] </span><span className="text-emerald-400 font-semibold">SUCCESS</span> Connected to Binance Futures Testnet successfully.</div>
          <div className="mb-1 text-slate-300"><span className="text-slate-500">[10:42:15.102] </span><span className="text-cyan-400 font-semibold">INFO</span> Initializing Websocket streams for real-time market data.</div>
          <div className="mb-1 text-slate-300"><span className="text-slate-500">[10:42:16.420] </span><span className="text-cyan-400 font-semibold">INFO</span> Subscribed to streams: !markPrice@arr@1s, !ticker@arr</div>
          <div className="mb-1 text-slate-300"><span className="text-slate-500">[10:42:16.899] </span><span className="text-emerald-400 font-semibold">SUCCESS</span> Trading bot is now fully operational and awaiting commands.</div>
        </div>
      </div>
    </div>
  );
};
