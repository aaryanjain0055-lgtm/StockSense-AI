from fastapi import (
    APIRouter,
    Depends,
)

from app.api.auth import get_current_user
from app.db.session import test_connection
from app.models.user import User


router = APIRouter()


# ============================================================
# HOME
# ============================================================

@router.get("/")
async def home():
    return {
        "message": "Welcome to StockSense AI Backend",
        "status": "running",
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@router.get("/health")
async def health():
    return {
        "status": "healthy",
    }


# ============================================================
# DATABASE CHECK
# ============================================================

@router.get("/database")
async def database():
    test_connection()

    return {
        "database": "connected",
    }


# ============================================================
# AUTHENTICATED PROFILE
# ============================================================

@router.get("/profile")
async def profile(
    current_user: User = Depends(
        get_current_user
    ),
):
    return {
        "message": "Authenticated successfully",
        "user": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "role": current_user.role,
            "is_active": current_user.is_active,
        },
    }