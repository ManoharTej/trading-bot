"""
client.py
=========
Binance Futures Testnet API wrapper.

Wraps the python-binance synchronous client, overrides the base URL for
the USDT-M Futures Testnet, and maps all library/network exceptions to
the bot's typed exception hierarchy.

Environment variables required:
    BINANCE_API_KEY     — Testnet API key
    BINANCE_API_SECRET  — Testnet API secret

These must be set in a .env file at the project root and are loaded
automatically by :func:`_load_credentials`.
"""

from __future__ import annotations

import os
from decimal import Decimal
from typing import Any

import requests
from binance.client import Client
from binance.exceptions import BinanceAPIException, BinanceRequestException
from dotenv import load_dotenv

from bot.exceptions import BinanceAPIError, ConfigurationError, NetworkError
from bot.logging_config import get_logger

logger = get_logger(__name__)

# The endpoint is chosen at client‑creation time (see _create_client).

# Mapping from our order_type strings to Binance API order type values
ORDER_TYPE_MAP: dict[str, str] = {
    "MARKET": Client.FUTURE_ORDER_TYPE_MARKET,
    "LIMIT": Client.FUTURE_ORDER_TYPE_LIMIT,
    "STOP_LIMIT": "STOP",   # Binance Futures uses 'STOP' for stop-limit
}


# ---------------------------------------------------------------------------
# Credential loading
# ---------------------------------------------------------------------------

def _load_credentials() -> tuple[str, str]:
    """
    Load API credentials from environment variables.

    Reads from .env at project root if present, then checks the process
    environment.

    Returns:
        (api_key, api_secret) tuple.

    Raises:
        ConfigurationError: If either variable is missing or empty.
    """
    load_dotenv()

    api_key = os.getenv("BINANCE_API_KEY", "").strip()
    api_secret = os.getenv("BINANCE_API_SECRET", "").strip()

    if not api_key:
        raise ConfigurationError(
            "BINANCE_API_KEY is not set. Add it to your .env file."
        )
    if not api_secret:
        raise ConfigurationError(
            "BINANCE_API_SECRET is not set. Add it to your .env file."
        )

    logger.debug("API credentials loaded successfully.")
    return api_key, api_secret


# ---------------------------------------------------------------------------
# Client factory
# ---------------------------------------------------------------------------

def _create_client(api_key: str, api_secret: str) -> Client:
    """
    Construct a python-binance Client configured for either Live or Testnet Futures.
    Reads BINANCE_ENV after credentials have been loaded.
    """
    env = os.getenv("BINANCE_ENV", "testnet").lower()
    is_live = (env == "live")
    base_url = "https://fapi.binance.com" if is_live else "https://testnet.binancefuture.com"

    # We MUST pass testnet=True if not live, otherwise Client() will ping the live Spot API 
    # during initialization and fail if the key lacks Spot permissions.
    client = Client(api_key=api_key, api_secret=api_secret, testnet=not is_live)

    # Override endpoints to point at the selected Futures base URL
    client.FUTURES_URL = f"{base_url}/fapi"
    client.FUTURES_TESTNET_URL = f"{base_url}/fapi"

    logger.info("Binance Futures client created. Mode: %s, Base URL: %s", "LIVE" if is_live else "TESTNET", base_url)
    return client


# ---------------------------------------------------------------------------
# BinanceClient
# ---------------------------------------------------------------------------

class BinanceClient:
    """
    Thread-safe wrapper around the python-binance synchronous client.

    Encapsulates credential loading, client construction, and exception
    translation.  Consumers should interact only with the public methods;
    the underlying :class:`binance.client.Client` is intentionally private.

    Example:
        >>> bc = BinanceClient()
        >>> response = bc.place_futures_order(
        ...     symbol="BTCUSDT",
        ...     side="BUY",
        ...     order_type="MARKET",
        ...     quantity=Decimal("0.001"),
        ... )
    """

    def __init__(self) -> None:
        api_key, api_secret = _load_credentials()
        self._client = _create_client(api_key, api_secret)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def place_futures_order(
        self,
        *,
        symbol: str,
        side: str,
        order_type: str,
        quantity: Decimal,
        price: Decimal | None = None,
        stop_price: Decimal | None = None,
    ) -> dict[str, Any]:
        """
        Submit an order to Binance Futures Testnet.

        Args:
            symbol: Trading pair (e.g. 'BTCUSDT').
            side: 'BUY' or 'SELL'.
            order_type: 'MARKET', 'LIMIT', or 'STOP_LIMIT'.
            quantity: Order size in base asset.
            price: Limit/stop-limit price. Required for LIMIT & STOP_LIMIT.
            stop_price: Trigger price. Required for STOP_LIMIT.

        Returns:
            Raw Binance API response dict.

        Raises:
            BinanceAPIError: API returned an error code.
            NetworkError: Network-level failure (timeout, DNS, etc.).
        """
        binance_order_type = ORDER_TYPE_MAP.get(order_type)
        if binance_order_type is None:
            raise BinanceAPIError(f"Unsupported order type: {order_type}")

        params: dict[str, Any] = {
            "symbol": symbol,
            "side": side,
            "type": binance_order_type,
            "quantity": str(quantity),
        }

        if price is not None:
            params["price"] = str(price)
            params["timeInForce"] = Client.TIME_IN_FORCE_GTC

        if stop_price is not None:
            params["stopPrice"] = str(stop_price)

        logger.info(
            "Sending %s order | params: %s",
            order_type,
            {k: v for k, v in params.items() if k != "symbol" or True},
        )

        return self._execute_order(params)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _execute_order(self, params: dict[str, Any]) -> dict[str, Any]:
        """
        Execute the Futures order and translate exceptions.

        Args:
            params: Raw Binance API parameters dict.

        Returns:
            Raw API response dict on success.

        Raises:
            BinanceAPIError: For API-level errors.
            NetworkError: For transport-level errors.
        """
        try:
            response: dict[str, Any] = self._client.futures_create_order(**params)
            logger.info("Binance response: %s", response)
            return response

        except BinanceAPIException as exc:
            msg = exc.message or str(exc)
            logger.error(
                "BinanceAPIException [%s]: %s", exc.status_code, msg, exc_info=True
            )
            raise BinanceAPIError(message=msg, code=exc.status_code) from exc

        except BinanceRequestException as exc:
            msg = f"Binance request error: {exc}"
            logger.error(msg, exc_info=True)
            raise NetworkError(msg) from exc

        except requests.exceptions.Timeout as exc:
            msg = "Connection timed out while contacting Binance API."
            logger.error(msg, exc_info=True)
            raise NetworkError(msg) from exc

        except requests.exceptions.ConnectionError as exc:
            msg = "DNS/connection failure. Check your internet connection."
            logger.error(msg, exc_info=True)
            raise NetworkError(msg) from exc

        except requests.exceptions.RequestException as exc:
            msg = f"Unexpected network error: {exc}"
            logger.error(msg, exc_info=True)
            raise NetworkError(msg) from exc
