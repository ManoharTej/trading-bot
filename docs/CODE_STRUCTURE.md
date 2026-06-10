# Code Structure

The repository enforces strict separation of concerns between the frontend SPA and the backend proxy.

- `frontend/src/`: Contains all React components, contexts, and hooks.
  - `components/`: Atomic UI components (Buttons, Modals, Terminal).
  - `pages/`: Primary view routes (Dashboard, Settings).
  - `context/`: Global state management (Theme, API Key).
- `api.py`: The single-entry FastAPI server that safely manages the Binance Python Client.
- `bot/`: The core trading logic, validators, and exception handlers decoupled from the API layer.
