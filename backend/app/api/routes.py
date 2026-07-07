from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.db.session import test_connection


router = APIRouter()


@router.get("/")
async def home():
    return {
        "message": "Welcome to StockSense AI Backend",
        "status": "running",
    }


@router.get("/health")
async def health():
    return {
        "status": "healthy",
    }


@router.get("/database")
async def database():
    test_connection()

    return {
        "database": "connected",
    }


@router.get("/profile")
async def profile(
    current_user=Depends(get_current_user),
):
    return {
        "message": "Authenticated successfully",
        "user": current_user,
    }