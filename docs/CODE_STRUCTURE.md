# Code Structure

The repository enforces strict separation of concerns:

- `src/cli.py`: Only contains `Typer` routing and `Rich` rendering logic.
- `src/bot/client.py`: The only file permitted to make outgoing network requests.
- `src/bot/validators.py`: Centralized validation logic ensuring payloads are structurally sound before execution.
