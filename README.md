# Binance Futures Testnet Trading Bot

A **production-quality Python CLI trading bot** for Binance USDT-M Futures Testnet.
Place MARKET, LIMIT, and STOP-LIMIT orders from the command line with full validation,
structured rotating logs, and clean layered architecture.

---

## Features

| Feature | Details |
|---------|---------|
| 📈 **Order Types** | MARKET, LIMIT, STOP-LIMIT (bonus) |
| ✅ **Input Validation** | Symbol, side, type, quantity, price — all validated with clear error messages |
| 🎨 **Rich CLI Output** | Amber/Cyan/Green terminal panels inspired by Bloomberg Terminal aesthetics |
| 📋 **Structured Logging** | Rotating file logger (10 MB × 5) with timestamped, pipe-delimited records |
| 🏗️ **Layered Architecture** | CLI → Orders → Client → Exceptions (strict separation of concerns) |
| 🔐 **Secure Config** | Zero hardcoded credentials — loaded from `.env` via python-dotenv |
| 🛡️ **Error Handling** | Typed exception hierarchy for validation, API, network, and config errors |
| 📦 **Type Hints + Docstrings** | Full PEP 484 typing throughout, every public function documented |

---

## Project Structure

```
trading_bot/
├── cli.py                  # CLI entry point (Typer + Rich)
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variable template
├── .gitignore
├── README.md
├── bot/
│   ├── __init__.py         # Package marker
│   ├── client.py           # Binance API wrapper (testnet URL override)
│   ├── orders.py           # Order placement logic (dataclasses)
│   ├── validators.py       # Pure-function input validation
│   ├── logging_config.py   # Rotating file + console logger setup
│   └── exceptions.py       # Custom exception hierarchy
└── logs/
    ├── bot.log             # Live rotating log (auto-created)
    ├── market_order.log    # Sample: successful MARKET order
    └── limit_order.log     # Sample: successful LIMIT order
```

---

## Architecture Overview

```
CLI (cli.py / Typer)
    └── validators.py       ← validate all inputs (pure functions)
    └── orders.py           ← build & dispatch order (dataclasses)
        └── client.py       ← Binance API wrapper (requests / python-binance)
            └── exceptions.py ← typed exception hierarchy
logging_config.py           ← cross-cutting concern, used by all layers
```

**Design principles:**
- Each layer has exactly one responsibility
- No layer bypasses its neighbour
- All data crosses boundaries as typed dataclasses (`OrderParams`, `OrderResponse`)
- The client is injectable for unit testing without mocking the full SDK

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd trading_bot
```

### 2. Create a virtual environment

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure credentials

```bash
cp .env.example .env
```

Open `.env` and fill in your **Binance Futures Testnet** credentials:

```ini
BINANCE_API_KEY=your_testnet_api_key_here
BINANCE_API_SECRET=your_testnet_api_secret_here
```

> **How to get Testnet credentials:**
> 1. Visit [https://testnet.binancefuture.com](https://testnet.binancefuture.com)
> 2. Log in with your GitHub account
> 3. Go to **API Key Management** and generate a key pair

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BINANCE_API_KEY` | ✅ Yes | Your Binance Futures Testnet API key |
| `BINANCE_API_SECRET` | ✅ Yes | Your Binance Futures Testnet API secret |

Store these in `.env` at the project root. Never commit this file to version control (it is already in `.gitignore`).

---

## Usage Examples

### Market Order (BUY)

```bash
python cli.py --symbol BTCUSDT --side BUY --type MARKET --quantity 0.001
```

**Output:**

```
╔══════════════════════════════════════════════╗
║   BINANCE FUTURES TESTNET BOT  ◉ CONNECTED   ║
╚══════════════════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━ ORDER REQUEST ━━━━━━━━━━━━━━━━━━━━━━━━━┓
  Symbol        BTCUSDT
  Side          BUY
  Type          MARKET
  Quantity      0.001
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━ ORDER RESPONSE ━━━━━━━━━━━━━━━━━━━━━━━━┓
  Order ID        3842901
  Status          FILLED
  Executed Qty    0.001
  Average Price   104532.11
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅  SUCCESS: Order placed successfully
```

---

### Limit Order (SELL)

```bash
python cli.py --symbol BTCUSDT --side SELL --type LIMIT --quantity 0.001 --price 50000
```

---

### Stop-Limit Order (SELL) — Bonus Feature

```bash
python cli.py \
  --symbol BTCUSDT \
  --side SELL \
  --type STOP_LIMIT \
  --quantity 0.001 \
  --price 49000 \
  --stop-price 49500
```

---

### Validation Error Example

```bash
python cli.py --symbol BTCUSDT --side SHORT --type MARKET --quantity 0.001

❌  FAILED: [ValidationError] Side must be one of ['BUY', 'SELL'], got: 'SHORT'
```

---

## Logging

All activity is written to `logs/bot.log` in rotating files:

- **Max file size:** 10 MB  
- **Retained backups:** 5 files → max 50 MB total  
- **Format:** `YYYY-MM-DD HH:MM:SS | LEVEL | module | message`

### Log events captured

| Event | Level |
|-------|-------|
| Application startup | INFO |
| Validation pass/fail | INFO / WARNING |
| API request payload | INFO |
| API response | INFO |
| Binance API errors | ERROR |
| Network failures | ERROR |
| Unexpected exceptions | CRITICAL |

### Sample log entry

```
2025-01-15 10:24:06 | INFO     | client          | Sending MARKET order | params: {'symbol': 'BTCUSDT', 'side': 'BUY', 'type': 'MARKET', 'quantity': '0.001'}
2025-01-15 10:24:07 | INFO     | client          | Binance response: {'orderId': 3842901, 'status': 'FILLED', 'avgPrice': '104532.11', ...}
```

Console output shows **WARNING and above** only, keeping the terminal clean.

---

## Error Handling

The bot uses a typed exception hierarchy (`bot/exceptions.py`):

```
TradingBotError          ← base class
├── ValidationError      ← bad user input
├── BinanceAPIError      ← Binance rejected the order (with error code)
├── NetworkError         ← timeout, DNS failure, connection refused
└── ConfigurationError   ← missing API credentials
```

| Scenario | User sees | Logged as |
|----------|-----------|-----------|
| Invalid side `SHORT` | `[ValidationError] Side must be one of...` | WARNING |
| Missing `--price` for LIMIT | `[ValidationError] Price is required...` | WARNING |
| Insufficient balance | `[Binance #-2019] Margin is insufficient` | ERROR |
| API timeout | `Connection timed out while contacting Binance API` | ERROR |
| Missing `.env` credentials | `BINANCE_API_KEY is not set` | ERROR |

---

## Assumptions

1. **Testnet only** — the bot targets `https://testnet.binancefuture.com`. For mainnet, remove the URL overrides in `client.py` and update `.env`.
2. **One-way hedge mode** — orders use `positionSide=BOTH` (default one-way mode). Hedge mode is not supported.
3. **Decimal precision** — quantities and prices are passed as strings to Binance to avoid IEEE-754 floating-point issues.
4. **Synchronous client** — uses the synchronous python-binance client for simplicity. For high-frequency or streaming use cases, replace with `AsyncClient`.
5. **GTC time-in-force** — LIMIT and STOP-LIMIT orders default to Good Till Cancelled. This is appropriate for testnet experimentation.
6. **STOP_LIMIT → Binance `STOP`** — Binance Futures uses the type name `STOP` for stop-limit orders. The mapping is handled transparently in `client.py`.

---

## Running Tests (optional)

```bash
pip install pytest
pytest tests/
```

*(Test files can be added to a `tests/` directory following standard pytest conventions.)*

---

## License

MIT — free to use, modify, and distribute.
