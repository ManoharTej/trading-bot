import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [environment, setEnvironment] = useState('testnet');
  const [theme, setTheme] = useState(() => document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('BINANCE_API_KEY', apiKey);
    localStorage.setItem('BINANCE_API_SECRET', apiSecret);
    localStorage.setItem('BINANCE_ENV', environment);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto h-full min-h-[600px] flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your application preferences and API keys.</p>
      </div>
      
      <div className="glass-panel rounded-xl shadow-sm p-6 flex flex-col gap-8">
        
        {/* Appearance Section */}
        <section>
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white mb-4">Appearance</h3>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg">
            <div>
              <label className="text-sm font-semibold text-slate-900 dark:text-white block">Dark Theme</label>
              <p className="text-xs text-slate-500 mt-1">Enable dark mode for the entire application.</p>
            </div>
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`}></div>
            </button>
          </div>
        </section>

        <div className="h-px w-full bg-slate-200 dark:bg-slate-800/50"></div>

        {/* API Configuration Section */}
        <section>
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white mb-4">API Configuration</h3>
          
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            {/* Environment Toggle */}
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Environment</label>
              <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setEnvironment('testnet')}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${environment === 'testnet' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Testnet (Free Testing)
                </button>
                <button 
                  type="button" 
                  onClick={() => setEnvironment('live')}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${environment === 'live' ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Live (Real Money)
                </button>
              </div>
            </div>

            {/* API Key */}
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">API Key</label>
              <input 
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                placeholder="Enter Binance API Key"
              />
            </div>

            {/* API Secret */}
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">API Secret</label>
              <input 
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                placeholder="Enter Binance API Secret"
              />
            </div>

            {/* Save Button */}
            <button 
              type="submit" 
              className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
            >
              {saved ? 'Saved Successfully!' : 'Save Configuration'}
            </button>
            
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 text-center font-medium">
              Note: Currently editing settings locally for the UI. Backend updates require server restart.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Settings;
