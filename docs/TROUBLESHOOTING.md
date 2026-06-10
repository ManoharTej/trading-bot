# Troubleshooting Guide

### 1. Connection Refused
If the React application displays a `Connection Refused` error in the terminal logs:
- Ensure `python api.py` is actively running on port 8000.
- Check that no other process is occupying port 8000.

### 2. Invalid API-Key or 401 Unauthorized
If Binance returns a 401 Unauthorized error:
1. Ensure you are using a **Testnet** API key, not a production API key.
2. Ensure you generated a **Futures** key, not a Spot key.
3. Testnet keys automatically expire after 30 days of inactivity. Generate a new one at testnet.binancefuture.com.
*(Note: TradeFlow will automatically intercept this error and provide a simulated fallback so your UI testing is not interrupted).*

### 3. Blank Chart
If the TradingView iframe is blank:
- Ensure your ad-blocker is not blocking `tradingview.com` scripts.
