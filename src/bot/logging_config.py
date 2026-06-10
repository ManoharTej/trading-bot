"""
logging_config.py
=================
Centralized logging configuration for the Binance Futures trading bot.

Creates a rotating file logger that captures all levels plus a console
handler that surfaces WARNING+ to the terminal without cluttering CLI output.

Log format:
    YYYY-MM-DD HH:MM:SS | LEVEL    | module     | message

Usage:
    from bot.logging_config import get_logger
    logger = get_logger(__name__)
"""

import logging
import logging.handlers
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

LOG_DIR = Path(__file__).parent.parent / "logs"
LOG_FILE = LOG_DIR / "bot.log"

# Rotating log: 10 MB per file, keep 5 backups → max 50 MB on disk
MAX_BYTES = 10 * 1024 * 1024  # 10 MB
BACKUP_COUNT = 5

LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(module)-15s | %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------

def _ensure_log_dir() -> None:
    """Create the logs directory if it does not exist."""
    LOG_DIR.mkdir(parents=True, exist_ok=True)


def _build_file_handler() -> logging.handlers.RotatingFileHandler:
    """Return a rotating file handler that captures DEBUG+ messages."""
    handler = logging.handlers.RotatingFileHandler(
        filename=LOG_FILE,
        maxBytes=MAX_BYTES,
        backupCount=BACKUP_COUNT,
        encoding="utf-8",
    )
    handler.setLevel(logging.DEBUG)
    handler.setFormatter(logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT))
    return handler


def _build_console_handler() -> logging.StreamHandler:
    """Return a console (stderr) handler that surfaces WARNING+ only."""
    handler = logging.StreamHandler(stream=sys.stderr)
    handler.setLevel(logging.WARNING)
    handler.setFormatter(logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT))
    return handler


def setup_logging() -> None:
    """
    Configure root logger for the trading bot application.

    Must be called once at application startup (e.g. inside the CLI entry
    point) before any module-level loggers are used.
    """
    _ensure_log_dir()

    root_logger = logging.getLogger("trading_bot")
    if root_logger.handlers:
        # Guard against duplicate handler registration in interactive sessions
        return

    root_logger.setLevel(logging.DEBUG)
    root_logger.addHandler(_build_file_handler())
    root_logger.addHandler(_build_console_handler())

    root_logger.info("Logging initialised — file: %s", LOG_FILE)


def get_logger(name: str) -> logging.Logger:
    """
    Return a child logger under the 'trading_bot' namespace.

    Args:
        name: Typically ``__name__`` of the calling module.

    Returns:
        A configured :class:`logging.Logger` instance.

    Example:
        >>> logger = get_logger(__name__)
        >>> logger.info("Order submitted")
    """
    return logging.getLogger(f"trading_bot.{name}")
