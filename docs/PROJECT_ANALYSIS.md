# Project Analysis: TradeFlow Algorithmic Trading Terminal

## Overview
TradeFlow is a full-stack algorithmic trading terminal designed specifically for Binance Futures (Testnet and Live). It provides a high-performance, real-time graphical interface for manual and automated order execution, overriding the need to use the clunky default exchange interfaces. 

## Problem Solved
Traders and algorithmic developers often struggle with:
1. **Testing logic safely**: Developing against Binance Futures requires setting up raw API requests which can be dangerous if accidentally run on the live network. TradeFlow provides a sandbox environment built tightly around the Binance Testnet.
2. **Visualizing automated trades**: Headless Python bots have no UI. TradeFlow acts as a control center, providing a polished UI, real-time TradingView charting, and direct WebSocket logging to monitor the health and output of the underlying trading bot in real time.

## Core Features
1. **Real-Time Dashboard**: Integrates `react-ts-tradingview-widgets` to provide live, interactive charting for Binance Futures pairs.
2. **Order Execution Engine**: Provides a complete interface for Market, Limit, and Stop-Limit orders, directly communicating with the Binance API via a secure backend proxy.
3. **Paper Trading Fallback**: The backend intelligently intercepts Binance `401 Unauthorized` errors (common with expiring testnet keys) and provides a simulated order execution environment so UI development and testing can continue uninterrupted.
4. **Live System Logs**: A macOS-styled terminal emulator directly in the browser streaming real-time operational logs from the backend bot.
5. **Theme Management**: Native support for Light and Dark modes using Tailwind V4 custom variants, with perfectly synced state management extending into the TradingView iframe.

## Technology Stack
### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS v4 (using native variables and custom dark variants)
- **Icons**: Lucide React
- **Build Tool**: Vite

### Backend
- **Framework**: FastAPI (Python)
- **Exchange Integration**: `python-binance` library
- **Environment Management**: `python-dotenv`
- **Server**: Uvicorn

## Architecture & Technical Decisions
1. **Decoupled Architecture**: The frontend (React) and backend (FastAPI) are completely decoupled. The frontend communicates entirely via REST APIs (`/api/order`), ensuring the python trading logic can run headless on a remote server while the UI is accessed locally.
2. **Security Posture**: API Keys are *never* hardcoded in the repository. They are strictly loaded via `.env` and injected into the backend memory. The UI handles local overrides for testing via `localStorage`, ensuring keys aren't accidentally exposed.
3. **Tailwind V4 Styling**: The application leverages the bleeding-edge Tailwind V4 CSS engine, utilizing raw utility classes (`glass-panel`, `bg-slate-900`) for a modern, glassmorphic SaaS aesthetic without heavy CSS bloat.
4. **Mocking Mechanism**: The Python `api.py` layer contains a robust error-handling mechanism that falls back to generating local simulated order IDs if the Binance API key is rejected, ensuring high availability of the UI during development.

## Setup Requirements
1. **Node.js**: Required for running the Vite dev server (`npm run dev`).
2. **Python 3.9+**: Required for the FastAPI backend (`pip install -r requirements.txt`).
3. **Binance Futures Testnet Account**: Required to generate valid API keys for live data pulling.
