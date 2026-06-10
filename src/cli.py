"""
cli.py
======
Command-line entry point for the Binance Futures Testnet Trading Bot.

Uses Typer for ergonomic argument parsing and Rich for premium terminal
output.  This module is intentionally thin -- it handles only presentation
and delegates all business logic to the bot package.

Usage examples:
    # Market order
    python cli.py --symbol BTCUSDT --side BUY --type MARKET --quantity 0.001

    # Limit order
    python cli.py --symbol BTCUSDT --side SELL --type LIMIT --quantity 0.001 --price 50000

    # Stop-limit order (bonus feature)
    python cli.py --symbol BTCUSDT --side SELL --type STOP_LIMIT \\
                  --quantity 0.001 --price 49000 --stop-price 49500
"""

from __future__ import annotations

import io
import sys
from decimal import Decimal
from typing import Optional

# Force UTF-8 output on Windows to support Rich's Unicode box-drawing chars
if sys.stdout.encoding and sys.stdout.encoding.lower() not in ("utf-8", "utf-8-sig"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
if sys.stderr.encoding and sys.stderr.encoding.lower() not in ("utf-8", "utf-8-sig"):
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

import typer
from rich import box
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text

from bot.exceptions import TradingBotError, ValidationError
from bot.logging_config import get_logger, setup_logging
from bot.orders import OrderParams, OrderResponse, place_order
from bot.validators import validate_order_params

# ---------------------------------------------------------------------------
# Initialise application
# ---------------------------------------------------------------------------

setup_logging()
logger = get_logger(__name__)

app = typer.Typer(
    name="trading-bot",
    help="Binance Futures Testnet — CLI trading bot",
    add_completion=False,
    rich_markup_mode="rich",
)

console = Console()
err_console = Console(stderr=True)


# ---------------------------------------------------------------------------
# Rich output helpers
# ---------------------------------------------------------------------------

def _print_header() -> None:
    """Print an amber banner identifying the application."""
    console.print(
        Panel(
            Text(
                "BINANCE FUTURES TESTNET BOT  [*] CONNECTED",
                justify="center",
                style="bold #f0b429",
            ),
            style="bold #f0b429",
            box=box.DOUBLE,
        )
    )


def _print_request_panel(params: OrderParams) -> None:
    """Render the ORDER REQUEST summary table."""
    table = Table(
        show_header=False,
        box=box.SIMPLE_HEAVY,
        padding=(0, 2),
        style="dim white",
    )
    table.add_column("Field", style="bold #a2e7ff", min_width=14)
    table.add_column("Value", style="bold white")

    table.add_row("Symbol", f"[bold #00d4ff]{params.symbol}[/]")

    side_color = "#00ff88" if params.side == "BUY" else "#ff4757"
    table.add_row("Side", f"[bold {side_color}]{params.side}[/]")

    table.add_row("Type", f"[bold yellow]{params.order_type}[/]")
    table.add_row("Quantity", str(params.quantity))

    if params.price is not None:
        table.add_row("Price", str(params.price))
    if params.stop_price is not None:
        table.add_row("Stop Price", str(params.stop_price))

    console.print(
        Panel(table, title="[bold #f0b429]  ORDER REQUEST  [/]", border_style="#f0b429")
    )


def _print_response_panel(response: OrderResponse) -> None:
    """Render the ORDER RESPONSE summary table."""
    table = Table(
        show_header=False,
        box=box.SIMPLE_HEAVY,
        padding=(0, 2),
        style="dim white",
    )
    table.add_column("Field", style="bold #a2e7ff", min_width=16)
    table.add_column("Value", style="bold white")

    table.add_row("Order ID", str(response.order_id))

    status_color = "#00ff88" if response.status == "FILLED" else "yellow"
    table.add_row("Status", f"[bold {status_color}]{response.status}[/]")

    table.add_row("Executed Qty", str(response.executed_qty))

    avg_price_display = (
        str(response.avg_price) if response.avg_price > Decimal("0") else "—  (pending fill)"
    )
    table.add_row("Average Price", avg_price_display)

    console.print(
        Panel(
            table,
            title="[bold #00ff88]  ORDER RESPONSE  [/]",
            border_style="#00ff88",
        )
    )


def _print_success() -> None:
    """Print a green success footer."""
    console.print("\n[bold #00ff88]>> SUCCESS: Order placed successfully[/]\n")


def _print_failure(message: str) -> None:
    """Print a red failure footer to stderr."""
    err_console.print(f"\n[bold #ff4757]XX FAILED: {message}[/]\n")


# ---------------------------------------------------------------------------
# Main command
# ---------------------------------------------------------------------------

@app.command()
def main(
    symbol: str = typer.Option(
        ...,
        "--symbol", "-s",
        help="Trading pair symbol (e.g. BTCUSDT)",
    ),
    side: str = typer.Option(
        ...,
        "--side",
        help="Order side: BUY or SELL",
    ),
    order_type: str = typer.Option(
        ...,
        "--type", "-t",
        help="Order type: MARKET, LIMIT, or STOP_LIMIT",
    ),
    quantity: float = typer.Option(
        ...,
        "--quantity", "-q",
        help="Order quantity in base asset (e.g. 0.001)",
    ),
    price: Optional[float] = typer.Option(
        None,
        "--price", "-p",
        help="Limit price. Required for LIMIT and STOP_LIMIT orders.",
    ),
    stop_price: Optional[float] = typer.Option(
        None,
        "--stop-price",
        help="Stop trigger price. Required for STOP_LIMIT orders.",
    ),
) -> None:
    """
    Place a Futures order on Binance Testnet.

    Supported order types: MARKET, LIMIT, STOP_LIMIT

    \b
    Examples:
      # Market buy
      python cli.py --symbol BTCUSDT --side BUY --type MARKET --quantity 0.001

      # Limit sell
      python cli.py --symbol BTCUSDT --side SELL --type LIMIT \\
                    --quantity 0.001 --price 50000

      # Stop-limit sell
      python cli.py --symbol BTCUSDT --side SELL --type STOP_LIMIT \\
                    --quantity 0.001 --price 49000 --stop-price 49500
    """
    _print_header()

    # ------------------------------------------------------------------
    # 1. Validate inputs
    # ------------------------------------------------------------------
    try:
        validated = validate_order_params(
            symbol=symbol,
            side=side,
            order_type=order_type,
            quantity=quantity,
            price=price,
            stop_price=stop_price,
        )
    except ValidationError as exc:
        logger.warning("CLI validation failed: %s", exc.message)
        _print_failure(f"[ValidationError] {exc.message}")
        raise typer.Exit(code=1)

    params = OrderParams(
        symbol=validated["symbol"],
        side=validated["side"],
        order_type=validated["order_type"],
        quantity=validated["quantity"],
        price=validated["price"],
        stop_price=validated["stop_price"],
    )

    # ------------------------------------------------------------------
    # 2. Print request summary
    # ------------------------------------------------------------------
    _print_request_panel(params)

    # ------------------------------------------------------------------
    # 3. Place the order
    # ------------------------------------------------------------------
    try:
        response: OrderResponse = place_order(params)
    except ValidationError as exc:
        logger.warning("Order validation error: %s", exc, exc_info=True)
        _print_failure(f"[ValidationError] {exc.message}")
        raise typer.Exit(code=1)
    except TradingBotError as exc:
        logger.error("Order failed: %s", exc, exc_info=True)
        _print_failure(str(exc))
        raise typer.Exit(code=1)
    except Exception as exc:  # noqa: BLE001
        logger.critical("Unexpected error: %s", exc, exc_info=True)
        _print_failure(f"Unexpected error: {exc}")
        raise typer.Exit(code=1)

    # ------------------------------------------------------------------
    # 4. Print response summary
    # ------------------------------------------------------------------
    _print_response_panel(response)
    _print_success()


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    app()
