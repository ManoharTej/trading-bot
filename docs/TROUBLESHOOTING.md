# Troubleshooting Guide

### 401 Unauthorized Errors
If Binance returns a 401 Unauthorized error:
1. Ensure you are using a **Testnet** API key, not a production API key.
2. Ensure you generated a **Futures** key, not a Spot key.
3. Testnet keys automatically expire after 30 days of inactivity. Generate a new one at testnet.binancefuture.com.

### Validation Errors
If the CLI rejects your order with a `ValidationError`:
1. Check that you included `--price` for Limit and Stop-Limit orders.
2. Check that `--quantity` is greater than 0.
