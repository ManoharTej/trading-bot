"""
validators.py
=============
Pure-function input validation for all order parameters.

All validators are side-effect free and raise :class:`ValidationError`
with descriptive messages on failure.  They never touch the network or
the Binance client — that separation keeps them easily unit-testable.

Supported order types and their required fields:

    MARKET:     symbol, side, quantity
    LIMIT:      symbol, side, quantity, price
    STOP_LIMIT: symbol, side, quantity, price, stop_price
"""

from __future__ import annotations

from decimal import Decimal, InvalidOperation
from typing import Literal

from bot.exceptions import ValidationError
from bot.logging_config import get_logger

logger = get_logger(__name__)

# ---------------------------------------------------------------------------
# Allowed values (single source of truth)
# ---------------------------------------------------------------------------

VALID_SIDES: frozenset[str] = frozenset({"BUY", "SELL"})
VALID_ORDER_TYPES: frozenset[str] = frozenset({"MARKET", "LIMIT", "STOP_LIMIT"})


# ---------------------------------------------------------------------------
# Individual field validators
# ---------------------------------------------------------------------------

def validate_symbol(symbol: str | None) -> str:
    """
    Validate and normalise a trading symbol.

    Args:
        symbol: Raw symbol string (e.g. 'btcusdt', 'ETHUSDT').

    Returns:
        Upper-cased, stripped symbol string.

    Raises:
        ValidationError: If the symbol is empty or None.
    """
    if not symbol or not symbol.strip():
        msg = "Symbol is required and cannot be empty."
        logger.warning("Validation failed — %s", msg)
        raise ValidationError(msg)
    return symbol.strip().upper()


def validate_side(side: str | None) -> Literal["BUY", "SELL"]:
    """
    Validate the order side.

    Args:
        side: Raw side string.

    Returns:
        Normalised side ('BUY' or 'SELL').

    Raises:
        ValidationError: If side is not in VALID_SIDES.
    """
    if not side:
        msg = "Side is required."
        logger.warning("Validation failed — %s", msg)
        raise ValidationError(msg)

    normalised = side.strip().upper()
    if normalised not in VALID_SIDES:
        msg = f"Side must be one of {sorted(VALID_SIDES)}, got: '{side}'"
        logger.warning("Validation failed — %s", msg)
        raise ValidationError(msg)

    return normalised  # type: ignore[return-value]


def validate_order_type(order_type: str | None) -> Literal["MARKET", "LIMIT", "STOP_LIMIT"]:
    """
    Validate the order type.

    Args:
        order_type: Raw order type string.

    Returns:
        Normalised order type.

    Raises:
        ValidationError: If order_type is not in VALID_ORDER_TYPES.
    """
    if not order_type:
        msg = "Order type is required."
        logger.warning("Validation failed — %s", msg)
        raise ValidationError(msg)

    normalised = order_type.strip().upper()
    if normalised not in VALID_ORDER_TYPES:
        msg = f"Order type must be one of {sorted(VALID_ORDER_TYPES)}, got: '{order_type}'"
        logger.warning("Validation failed — %s", msg)
        raise ValidationError(msg)

    return normalised  # type: ignore[return-value]


def validate_quantity(quantity: float | str | None) -> Decimal:
    """
    Validate the order quantity.

    Args:
        quantity: Raw quantity value (float or string).

    Returns:
        Positive :class:`Decimal` quantity.

    Raises:
        ValidationError: If quantity is missing, non-numeric, or ≤ 0.
    """
    if quantity is None:
        msg = "Quantity is required."
        logger.warning("Validation failed — %s", msg)
        raise ValidationError(msg)

    try:
        qty = Decimal(str(quantity))
    except InvalidOperation:
        msg = f"Quantity must be a valid number, got: '{quantity}'"
        logger.warning("Validation failed — %s", msg)
        raise ValidationError(msg)

    if qty <= Decimal("0"):
        msg = f"Quantity must be greater than zero, got: {qty}"
        logger.warning("Validation failed — %s", msg)
        raise ValidationError(msg)

    return qty


def validate_price(
    price: float | str | None,
    *,
    required: bool = True,
    field_name: str = "Price",
) -> Decimal | None:
    """
    Validate a price field (used for both 'price' and 'stop_price').

    Args:
        price: Raw price value.
        required: If True, raise ValidationError when price is None.
        field_name: Human-readable field name for error messages.

    Returns:
        Positive :class:`Decimal` price, or None if not required and absent.

    Raises:
        ValidationError: If required and missing, non-numeric, or ≤ 0.
    """
    if price is None:
        if required:
            msg = f"{field_name} is required for this order type."
            logger.warning("Validation failed — %s", msg)
            raise ValidationError(msg)
        return None

    try:
        p = Decimal(str(price))
    except InvalidOperation:
        msg = f"{field_name} must be a valid number, got: '{price}'"
        logger.warning("Validation failed — %s", msg)
        raise ValidationError(msg)

    if p <= Decimal("0"):
        msg = f"{field_name} must be greater than zero, got: {p}"
        logger.warning("Validation failed — %s", msg)
        raise ValidationError(msg)

    return p


# ---------------------------------------------------------------------------
# Composite validator
# ---------------------------------------------------------------------------

def validate_order_params(
    symbol: str | None,
    side: str | None,
    order_type: str | None,
    quantity: float | str | None,
    price: float | str | None = None,
    stop_price: float | str | None = None,
) -> dict:
    """
    Validate all order parameters in a single call.

    Performs field-level validation then enforces cross-field rules:
    - LIMIT orders must have ``price``
    - STOP_LIMIT orders must have both ``price`` and ``stop_price``

    Args:
        symbol: Trading pair symbol.
        side: 'BUY' or 'SELL'.
        order_type: 'MARKET', 'LIMIT', or 'STOP_LIMIT'.
        quantity: Order quantity.
        price: Limit price (required for LIMIT and STOP_LIMIT).
        stop_price: Stop trigger price (required for STOP_LIMIT).

    Returns:
        Dict with normalised, validated values:
        ``{'symbol', 'side', 'order_type', 'quantity', 'price', 'stop_price'}``

    Raises:
        ValidationError: On any validation failure.
    """
    validated_symbol = validate_symbol(symbol)
    validated_side = validate_side(side)
    validated_type = validate_order_type(order_type)
    validated_qty = validate_quantity(quantity)

    is_limit_type = validated_type in {"LIMIT", "STOP_LIMIT"}
    is_stop_type = validated_type == "STOP_LIMIT"

    validated_price = validate_price(
        price,
        required=is_limit_type,
        field_name="Price",
    )
    validated_stop_price = validate_price(
        stop_price,
        required=is_stop_type,
        field_name="Stop Price",
    )

    logger.info(
        "Validation passed — symbol=%s side=%s type=%s qty=%s price=%s stop_price=%s",
        validated_symbol,
        validated_side,
        validated_type,
        validated_qty,
        validated_price,
        validated_stop_price,
    )

    return {
        "symbol": validated_symbol,
        "side": validated_side,
        "order_type": validated_type,
        "quantity": validated_qty,
        "price": validated_price,
        "stop_price": validated_stop_price,
    }
