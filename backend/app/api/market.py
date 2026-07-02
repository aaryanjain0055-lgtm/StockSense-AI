from fastapi import APIRouter, HTTPException

from app.services.market_service import MarketService

router = APIRouter(
    prefix="/market",
    tags=["Market"],
)


@router.get("/quote/{symbol}")
def get_quote(symbol: str):

    try:
        return MarketService.get_quote(symbol)

    except Exception as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

@router.get("/dashboard")
def get_dashboard():
    return MarketService.get_dashboard()

    