from fastapi import APIRouter

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

    try:
        test_connection()

        return {
            "database": "connected"
        }

    except Exception as e:

        return {
            "database": "failed",
            "error": str(e)
        }