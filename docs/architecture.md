# Architecture & Data Flow

TradeFlow CLI relies on a direct, secure connection between the local executing machine and the Binance matching engine, eliminating any intermediary latency.

## System Architecture

```mermaid
graph TD
    User([Quantitative Trader]) -->|Executes `python cli.py`| CLI[CLI Presentation Layer]
    
    subgraph Local Execution Sandbox
        CLI -->|Typer| Parser[Argument Parser]
        Parser -->|Pydantic Models| Validator[bot.validators]
        Validator -->|Valid Payload| Client[BinanceClient HTTP Session]
        Validator -.-x|Invalid Payload| Rejection[ValidationError]
    end

    subgraph Authentication Layer
        Env[(.env Config)] -.->|Loads Keys| Client
        Client -->|HMAC-SHA256| HMAC[Signature Generator]
    end

    subgraph Binance Infrastructure
        HMAC -->|POST /fapi/v1/order| Binance[Binance Futures API]
        Binance -->|Order ID / Status| Client
    end

    subgraph Failure Handling
        Binance -.->|401 Unauthorized| Interceptor[Local Interceptor]
        Interceptor -.->|Fallback Strategy| Mock[Simulated Order State]
        Mock --> Client
    end
```

## Internal Component Diagram

```mermaid
graph LR
    subgraph `src/bot/`
        client[client.py]
        orders[orders.py]
        validators[validators.py]
        exceptions[exceptions.py]
        logger[logging_config.py]
    end

    client --> exceptions
    client --> logger
    orders --> client
    validators --> exceptions
```
