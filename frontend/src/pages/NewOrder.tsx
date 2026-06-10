import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

const NewOrder = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState('BUY');
  const [orderType, setOrderType] = useState('MARKET');
  const [quantity, setQuantity] = useState('0.001');
  
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[10:42:15.001] INFO Websocket connected to wss://testnet.binance.vision/ws',
    '[10:42:15.045] INFO Subscribed to stream: !markPrice@arr@1s'
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0,12)}] INFO Order submitted: POST /api/order`]);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol,
          side,
          order_type: orderType,
          quantity,
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to place order');
      }

      setLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0,12)}] SUCCESS Order #${data.data.order_id} state changed to ${data.data.status}`]);
    } catch (err: any) {
      setLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0,12)}] ERROR ${err.message}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[600px]">
      {/* Order Entry Panel */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="glass-panel rounded-xl flex flex-col shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center">
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white tracking-tight">Order Entry</h3>
            <button type="button" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
          
          <div className="p-5 flex flex-col gap-5">
            {/* Symbol */}
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Symbol</label>
              <input 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all uppercase" 
                type="text" 
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
              />
            </div>
            
            {/* Side Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
              <button 
                type="button" 
                onClick={() => setSide('BUY')}
                className={`flex-1 py-1.5 rounded-md text-sm font-semibold transition-all ${side === 'BUY' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                Buy
              </button>
              <button 
                type="button" 
                onClick={() => setSide('SELL')}
                className={`flex-1 py-1.5 rounded-md text-sm font-semibold transition-all ${side === 'SELL' ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                Sell
              </button>
            </div>
            
            {/* Order Type */}
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Order Type</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setOrderType('MARKET')} className={`flex-1 py-1.5 px-3 border rounded-lg text-sm font-medium transition-colors ${orderType === 'MARKET' ? 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>Market</button>
                <button type="button" onClick={() => setOrderType('LIMIT')} className={`flex-1 py-1.5 px-3 border rounded-lg text-sm font-medium transition-colors ${orderType === 'LIMIT' ? 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>Limit</button>
              </div>
            </div>
            
            {/* Quantity */}
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Quantity</label>
              <input 
                className="w-full text-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" 
                type="text" 
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
              />
            </div>
            
            {/* Submit Button */}
            <button type="submit" disabled={loading} className={`w-full py-2.5 mt-2 ${side === 'BUY' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'} text-white text-sm font-bold rounded-lg shadow-sm transition-colors`}>
              {loading ? 'Processing...' : `${side === 'BUY' ? 'Buy' : 'Sell'} ${quantity} ${symbol} ${orderType}`}
            </button>
          </div>
        </form>
      </div>

      {/* Terminal Output Panel */}
      <div className="lg:col-span-8 flex flex-col">
        <div className="bg-slate-950 border border-slate-800 rounded-xl flex flex-col flex-1 min-h-[400px] shadow-xl overflow-hidden relative">
          
          {/* Mac OS Style Terminal Header */}
          <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between backdrop-blur-md">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600"></div>
            </div>
            <span className="font-mono text-[11px] text-slate-500 font-medium uppercase tracking-wider absolute left-1/2 -translate-x-1/2">Terminal output</span>
          </div>
          
          {/* Terminal Body */}
          <div className="p-5 flex-1 overflow-y-auto font-mono text-[13px] leading-relaxed">
            {logs.map((log, i) => (
              <div key={i} className="mb-1 text-slate-300">
                {log.includes('INFO') && <><span className="text-slate-500">{log.split('INFO')[0]}</span><span className="text-cyan-400 font-semibold">INFO</span>{log.split('INFO')[1]}</>}
                {log.includes('SUCCESS') && <><span className="text-slate-500">{log.split('SUCCESS')[0]}</span><span className="text-emerald-400 font-semibold">SUCCESS</span>{log.split('SUCCESS')[1]}</>}
                {log.includes('ERROR') && <><span className="text-slate-500">{log.split('ERROR')[0]}</span><span className="text-rose-400 font-semibold">ERROR</span>{log.split('ERROR')[1]}</>}
              </div>
            ))}
            {loading && (
              <div className="text-slate-400 mt-2 flex items-center gap-2">
                <span className="text-emerald-400 animate-pulse">█</span>
                <span>Awaiting response...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
