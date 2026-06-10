# Developer Setup Guide

To contribute to or run the TradeFlow WebApp locally, you must start both the frontend and backend servers.

## 1. Backend Setup
1. **Python Environment**: Ensure Python 3.9+ is installed.
2. **Dependencies**: `pip install -r requirements.txt`
3. **Environment Variables**: Create a `.env` file containing `BINANCE_API_KEY` and `BINANCE_API_SECRET`.
4. **Run**: `python api.py`

## 2. Frontend Setup
1. **Node Environment**: Ensure Node.js (v20+) is installed.
2. **Dependencies**: `cd frontend && npm install`
3. **Run**: `npm run dev`

The application will be live at `http://localhost:5173`.
