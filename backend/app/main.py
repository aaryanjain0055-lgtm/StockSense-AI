from app.db.init_db import init_db
from app.api.historical import router as historical_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.api.market import router as market_router
from app.core.config import settings
from app.api.auth import router as auth_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI Powered Stock Market Prediction System",
)
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    router,
    prefix="/api/v1",
    tags=["General"],
)

app.include_router(auth_router)
app.include_router(
    market_router
)
app.include_router(historical_router)