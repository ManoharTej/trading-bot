"""
orders.py
=========
Order placement business logic layer.

This module sits between the CLI (presentation layer) and the API client
(infrastructure layer).  It:

1. Accepts validated parameters as a typed dataclass
2. Delegates to :class:`~bot.client.BinanceClient`
3. Returns a structured :class:`OrderResponse` dataclass

Using dataclasses (rather than raw dicts) at the boundary makes the
code self-documenting and testable without mocking the entire Binance SDK.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from decimal import Decimal
from typing import Any

from bot.client import BinanceClient
from bot.logging_config import get_logger

logger = get_logger(__name__)


# ---------------------------------------------------------------------------
# Typed data containers
# ---------------------------------------------------------------------------

@dataclass(frozen=True)
class OrderParams:
    """
    Immutable container for a validated order request.

    All numeric fields use :class:`decimal.Decimal` for financial precision.
    """

    symbol: str
    side: str          # 'BUY' | 'SELL'
    order_type: str    # 'MARKET' | 'LIMIT' | 'STOP_LIMIT'
    quantity: Decimal
    price: Decimal | None = field(default=None)
    stop_price: Decimal | None = field(default=None)


@dataclass(frozen=True)
class OrderResponse:
    """
    Immutable container for a successful order result.

    Attributes:
        order_id:     Binance-assigned order identifier.
        status:       Order status (e.g. 'FILLED', 'NEW').
        executed_qty: Quantity actually filled so far.
        avg_price:    Volume-weighted average fill price (0.0 for unfilled).
        raw:          Full raw response from Binance (for logging/debugging).
    """

    order_id: int
    status: str
    executed_qty: Decimal
    avg_price: Decimal
    raw: dict[str, Any] = field(default_factory=dict, compare=False)


# ---------------------------------------------------------------------------
# Order placement
# ---------------------------------------------------------------------------

def place_order(params: OrderParams, *, client: BinanceClient | None = None) -> OrderResponse:
    """
    Place a Futures order and return a structured response.

    The ``client`` parameter is injectable for testing — in production the
    function creates its own :class:`BinanceClient` from environment vars.

    Args:
        params: A fully-validated :class:`OrderParams` instance.
        client: Optional pre-constructed API client (for unit tests).

    Returns:
        An :class:`OrderResponse` with the execution details.

    Raises:
        BinanceAPIError: If Binance rejects the order.
        NetworkError: If a transport-level failure occurs.
    """
    if client is None:
        client = BinanceClient()

    logger.info(
        "Placing order — symbol=%s side=%s type=%s qty=%s price=%s stop=%s",
        params.symbol,
        params.side,
        params.order_type,
        params.quantity,
        params.price,
        params.stop_price,
    )

    raw: dict[str, Any] = client.place_futures_order(
        symbol=params.symbol,
        side=params.side,
        order_type=params.order_type,
        quantity=params.quantity,
        price=params.price,
        stop_price=params.stop_price,
    )

    response = _parse_response(raw)

    logger.info(
        "Order confirmed — id=%s status=%s exec_qty=%s avg_price=%s",
        response.order_id,
        response.status,
        response.executed_qty,
        response.avg_price,
    )

    return response


def _parse_response(raw: dict[str, Any]) -> OrderResponse:
    """
    Parse the raw Binance API dict into an :class:`OrderResponse`.

    Handles both MARKET orders (where avgPrice is non-zero immediately) and
    LIMIT/STOP_LIMIT orders (where avgPrice may be '0' until filled).

    Args:
        raw: Direct API response from Binance.

    Returns:
        Structured :class:`OrderResponse`.
    """
    avg_price_str = raw.get("avgPrice") or raw.get("price") or "0"

    return OrderResponse(
        order_id=int(raw["orderId"]),
        status=raw.get("status", "UNKNOWN"),
        executed_qty=Decimal(raw.get("executedQty", "0")),
        avg_price=Decimal(avg_price_str),
        raw=raw,
    )
