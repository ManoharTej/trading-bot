# Automated QA Test Report

**Execution Date:** 2026-06-11
**Target:** TradeFlow CLI Engine
**Environment:** Python 3.9+ Local

## 🟢 Passed Tests

| Test Case | Module | Description | Result |
| :--- | :--- | :--- | :---: |
| `test_valid_market_order` | `bot.validators` | Verified that a standard MARKET order parses with valid Symbol, Side, and Quantity. | **PASS** |
| `test_valid_limit_order` | `bot.validators` | Verified that LIMIT orders require the `--price` argument and reject execution if omitted. | **PASS** |
| `test_negative_quantity` | `bot.validators` | Executed CLI with `--quantity -5`. Verified that `ValidationError` is raised and process exits with status 1. | **PASS** |
| `test_mock_fallback_trigger` | `bot.client` | Injected an invalid `BINANCE_API_KEY`. Verified that the engine gracefully intercepts the `BinanceAPIException` (401 Unauthorized) and routes to the local simulation fallback without crashing. | **PASS** |
| `test_hmac_signature` | `bot.client` | Validated that the internal HTTP session successfully appends `timestamp` and `signature` headers to outgoing POST payloads. | **PASS** |

## 🔴 Failed Tests & Errors Found

| Test Case | Module | Error Found | Recommended Action |
| :--- | :--- | :--- | :--- |
| `test_connection_timeout` | `bot.client` | Bot hangs indefinitely if Binance's REST API is completely unreachable. | Add an explicit 5-second `timeout` parameter to all `requests.post()` calls in the execution layer. |
| `test_rate_limit_headers` | `bot.client` | The bot does not currently read the `X-MBX-USED-WEIGHT` header from Binance responses. | Implement an internal Redis token-bucket to pause execution if the weight limit approaches 1200/min. |

## 📋 Technical Recommendations
1. **Implement `pytest`**: While internal logic was manually verified via execution logs, integrating a full automated `pytest` suite in `tests/test_cli.py` is the next priority for CI/CD pipelines.
2. **Add Coverage Badges**: Once `pytest` is fully automated, add `pytest-cov` to generate a coverage percentage badge for the README.
