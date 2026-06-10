<div align="center">
  <h1 align="center">TradeFlow Algorithmic CLI Bot</h1>
  <p align="center">
    <strong>A high-performance command-line trading bot for Binance Futures.</strong>
  </p>
</div>

---

## ⚡ Overview

TradeFlow CLI is the core engine that powers the trading terminal. It is a headless Python script designed to execute Futures orders with sub-millisecond latency using the official `python-binance` library.

**Note:** This `main` branch contains ONLY the core CLI trading logic. If you are looking for the full SaaS Web Application with the interactive TradingView charts and UI, switch to the **`webapp`** branch!

## 🚀 Installation

### 1. Clone & Environment Setup
```bash
git clone https://github.com/ManoharTej/tradeflow-terminal.git
cd tradeflow-terminal
```

Create a `.env` file in the root directory:
```env
BINANCE_API_KEY=your_futures_testnet_api_key
BINANCE_API_SECRET=your_futures_testnet_api_secret
BINANCE_ENV=testnet
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

## 💻 Usage

The CLI utilizes `Typer` and `Rich` to provide a beautiful, fully-typed terminal interface.

```bash
python cli.py --help
```

### Output:
```text
 Usage: cli.py [OPTIONS]                                                       
                                                                               
 Place a Futures order on Binance Testnet.                                     
                                                                               
 Supported order types: MARKET, LIMIT, STOP_LIMIT                              
                                                                               
 Examples:                                                                     
   # Market buy                                                                
   python cli.py --symbol BTCUSDT --side BUY --type MARKET --quantity 0.001    
                                                                               
   # Limit sell                                                                
   python cli.py --symbol BTCUSDT --side SELL --type LIMIT \                   
                 --quantity 0.001 --price 50000                                
                                                                               
   # Stop-limit sell                                                           
   python cli.py --symbol BTCUSDT --side SELL --type STOP_LIMIT \              
                 --quantity 0.001 --price 49000 --stop-price 49500             
                                                                               
┌─ Options ───────────────────────────────────────────────────────────────────┐
│ *  --symbol      -s      TEXT   Trading pair symbol (e.g. BTCUSDT)          │
│ *  --side                TEXT   Order side: BUY or SELL                     │
│ *  --type        -t      TEXT   Order type: MARKET, LIMIT, or STOP_LIMIT    │
│ *  --quantity    -q      FLOAT  Order quantity in base asset (e.g. 0.001)   │
│    --price       -p      FLOAT  Limit price.                                │
│    --stop-price          FLOAT  Stop trigger price.                         │
│    --help                       Show this message and exit.                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

## ⚙️ Example Execution

Executing a simulated market order:
```bash
$ python cli.py --symbol BTCUSDT --side BUY --type MARKET --quantity 0.001

[10:42:15] INFO  Binance Futures client created. Mode: TESTNET, Base URL: https://testnet.binancefuture.com
[10:42:15] INFO  Sending MARKET order | params: {'side': 'BUY', 'type': 'MARKET', 'quantity': '0.001'}
[10:42:16] INFO  Binance response: {'orderId': 3589129, 'status': 'FILLED', 'executedQty': '0.001'}
[10:42:16] SUCCESS  Order placed successfully! Response:
{
    "orderId": 3589129,
    "symbol": "BTCUSDT",
    "status": "FILLED",
    "clientOrderId": "web_xyz123",
    "price": "0",
    "avgPrice": "62000.50",
    "origQty": "0.001",
    "executedQty": "0.001",
    "cumQuote": "62.00",
    "timeInForce": "GTC",
    "type": "MARKET",
    "reduceOnly": false,
    "closePosition": false,
    "side": "BUY",
    "positionSide": "BOTH",
    "stopPrice": "0",
    "workingType": "CONTRACT_PRICE",
    "priceProtect": false,
    "origType": "MARKET",
    "time": 1718116936000,
    "updateTime": 1718116936000
}
```

---
*Developed and maintained by Manohar Tej.*
