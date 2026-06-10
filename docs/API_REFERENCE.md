# API Reference

The React frontend communicates with the FastAPI backend via RESTful endpoints.

### Endpoints

- `POST /api/order`: Submits an order payload.
  - **Body**: `{"symbol": "BTCUSDT", "side": "BUY", "type": "MARKET", "quantity": 0.001}`
  - **Response**: Returns the executed order data or a simulated fallback if the API key is unauthorized.
  
- `GET /api/account`: Retrieves account balance and leverage settings.
