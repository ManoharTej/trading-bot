# Deployment Guide

TradeFlow CLI is designed for headless deployment on Linux VPS instances (e.g., AWS EC2, DigitalOcean Droplets).

## Strategy
1. Clone the repository on the target server.
2. Configure `.env` with live keys (Ensure strict `chmod 600 .env` permissions).
3. Execute the bot via cron jobs or orchestrators like Airflow/Celery.

**Warning**: Do not expose the internal `api.py` FastAPI server to the public internet without implementing robust API Gateway authentication.
