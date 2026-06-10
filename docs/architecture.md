# TradeFlow Web Architecture

The WebApp branch contains a fully decoupled frontend/backend architecture designed for latency optimization and UI responsiveness.

## System Diagram

```mermaid
graph TD
    User([Quantitative Trader]) -->|Web Browser| Vite[Vite Dev Server :5173]
    Vite --> React[React 18 SPA]
    
    subgraph Frontend Client
        React --> Router[React Router]
        Router --> Dashboard[Dashboard View]
        Router --> Orders[Order Entry Panel]
        Dashboard --> TV[TradingView Widgets]
    end

    subgraph Backend Proxy
        React -->|REST JSON| FastAPI[FastAPI :8000]
        FastAPI --> Validator[Pydantic Models]
        Validator --> Client[BinanceClient]
    end

    subgraph Execution Layer
        Client -->|HMAC-SHA256| Binance[Binance Futures Testnet]
        Binance -->|401 Unauthorized| Interceptor[Simulation Fallback]
        Interceptor --> Client
    end
```

## Component Hierarchy

- `App.tsx`: Context Providers (Theme, Settings) and Router.
- `Dashboard.tsx`: Primary view containing charts and real-time logs.
- `Layout.tsx`: Glassmorphic navigation shell.
- `api.py`: Python FastAPI execution environment bridging the UI and Binance.
