# API Reference

The CLI currently interfaces with the following `python-binance` endpoints:

- `client.futures_create_order()`: Used for execution.

### Implemented Order Types
- **MARKET**: Executes immediately at current order book prices.
- **LIMIT**: Adds liquidity to the order book at a specific `--price`.
- **STOP_LIMIT**: Triggers a limit order when the mark price reaches `--stop-price`.
