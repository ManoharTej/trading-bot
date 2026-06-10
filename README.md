<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/terminal-square.svg" alt="TradeFlow Logo" width="80" height="80">
  <h1 align="center">TradeFlow Algorithmic Terminal</h1>
  <p align="center">
    <strong>A high-performance, SaaS-grade trading terminal for Binance Futures.</strong>
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a>
  </p>
</div>

---

## ⚡ Overview

TradeFlow is a professional-grade, full-stack algorithmic trading terminal designed specifically for Binance Futures (Testnet and Live). It bridges the gap between headless Python algorithmic scripts and modern web interfaces, providing a secure, real-time graphical control center for manual order execution, visual charting, and algorithmic monitoring.

## ✨ Features

<div align="center">
  <img src="docs/assets/demo.webp" alt="TradeFlow Demo Walkthrough" width="800">
</div>

- **Real-Time Interactive Charting**: Deep integration with TradingView widgets for high-fidelity market data visualization.
- **Order Execution Engine**: Secure, RESTful proxy backend capable of firing Market, Limit, and Stop orders via the Binance API.
- **Paper Trading Fallback**: Intelligent backend simulation mode automatically kicks in if testnet API keys expire, ensuring uninterrupted UI workflows.
- **Live System Telemetry**: A macOS-styled terminal emulator streaming real-time operational logs directly to the browser.

### Application Views

| Dashboard | Order Entry |
| :---: | :---: |
| <img src="docs/screenshots/dashboard.png" width="400"> | <img src="docs/screenshots/new_order.png" width="400"> |

| Open Orders | Settings |
| :---: | :---: |
| <img src="docs/screenshots/open_orders.png" width="400"> | <img src="docs/screenshots/settings.png" width="400"> |

## 🏗 Architecture

The system utilizes a decoupled architecture to ensure security and scalability:

- **Frontend**: React 18, TypeScript, Tailwind V4, Vite.
- **Backend Proxy**: FastAPI (Python), `python-binance`.
- **Exchange**: Binance Futures API (Testnet / Live).

*(See `docs/architecture.md` for full system diagrams and `docs/PROJECT_ANALYSIS.md` for technical decisions).*

## 🚀 Installation

### Prerequisites
- Node.js (v16+)
- Python 3.9+
- A Binance Futures Testnet Account

### 1. Clone & Environment Setup
```bash
git clone https://github.com/ManoharTej/tradeflow-terminal.git
cd tradeflow-terminal
```

Create a `.env` file in the root directory:
```env
BINANCE_API_KEY=your_testnet_api_key
BINANCE_API_SECRET=your_testnet_api_secret
BINANCE_ENV=testnet
```

### 2. Start the Backend
```bash
pip install -r requirements.txt
python api.py
```
*The FastAPI server will start on `http://127.0.0.1:8000`*

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*The Vite dev server will start on `http://localhost:5173`*

## 💻 Usage

1. Open `http://localhost:5173` in your browser.
2. Navigate to the **Settings** page to configure your environment (Light/Dark mode) and verify your API keys.
3. Use the **Dashboard** to analyze real-time pair data.
4. Execute trades via the **New Order** page and watch the integrated terminal log for success/failure states.

## 🔮 Future Improvements
- **Automated Strategy Hooks**: Allow the UI to toggle specific headless Python algorithms on/off.
- **WebSocket Price Feeds**: Replace REST polling with raw WebSocket connections for sub-millisecond order book updates.
- **Portfolio Analytics**: Add profit/loss graphing over time using a local SQLite database for historical trades.

---
*Developed and maintained by Manohar Tej.*
