from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as general_router
from app.api.auth import router as auth_router
from app.api.market import router as market_router
from app.api.historical import router as historical_router
from app.api.prediction import router as prediction_router

from app.api import technical
from app.api import financial
from app.api import company
from app.api import news
from app.api import sentiment
from app.api import scoring

from app.core.config import settings
from app.db.init_db import init_db
from app.core.logging_config import configure_logging


configure_logging()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI Powered Stock Market Prediction System",
)


# ============================================================
# DATABASE INITIALIZATION
# ============================================================

init_db()


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# GENERAL ROUTES
# ============================================================

app.include_router(
    general_router,
    prefix="/api/v1",
    tags=["General"],
)


# ============================================================
# AUTHENTICATION
# ============================================================

app.include_router(auth_router)


# ============================================================
# MARKET DATA
# ============================================================

app.include_router(market_router)

app.include_router(historical_router)

app.include_router(technical.router)

app.include_router(financial.router)

app.include_router(company.router)

app.include_router(news.router)

app.include_router(sentiment.router)

app.include_router(scoring.router)


# ============================================================
# PRODUCTION PREDICTION
# ============================================================

app.include_router(prediction_router)