"""
exceptions.py
=============
Custom exception hierarchy for the Binance Futures trading bot.

All application exceptions inherit from TradingBotError so callers
can catch the base class for broad handling or specific subclasses
for fine-grained control.
"""


class TradingBotError(Exception):
    """Base exception for all trading bot errors."""

    def __init__(self, message: str, details: str | None = None) -> None:
        super().__init__(message)
        self.message = message
        self.details = details

    def __str__(self) -> str:
        if self.details:
            return f"{self.message} | Details: {self.details}"
        return self.message


class ValidationError(TradingBotError):
    """
    Raised when user-supplied inputs fail validation checks.

    Examples:
        - Invalid order side (not BUY/SELL)
        - Missing price for LIMIT order
        - Non-positive quantity
    """
    pass


class BinanceAPIError(TradingBotError):
    """
    Raised when the Binance API returns an error response.

    Attributes:
        code: Binance error code (e.g. -2019 for insufficient margin)
        message: Human-readable error description from Binance
    """

    def __init__(self, message: str, code: int | None = None, details: str | None = None) -> None:
        super().__init__(message, details)
        self.code = code

    def __str__(self) -> str:
        if self.code is not None:
            return f"[Binance #{self.code}] {self.message}"
        return self.message


class NetworkError(TradingBotError):
    """
    Raised for network-level failures (timeout, DNS, connection refused).

    Examples:
        - requests.exceptions.Timeout
        - requests.exceptions.ConnectionError
    """
    pass


class ConfigurationError(TradingBotError):
    """
    Raised when environment/configuration is missing or invalid.

    Examples:
        - Missing BINANCE_API_KEY
        - Missing BINANCE_API_SECRET
    """
    pass
