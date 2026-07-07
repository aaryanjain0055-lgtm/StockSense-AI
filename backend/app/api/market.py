from fastapi import APIRouter, HTTPException

from app.services.market_service import MarketService

router = APIRouter(
    prefix="/market",
    tags=["Market"],
)


# ----------------------------------
# SINGLE STOCK QUOTE
# ----------------------------------
@router.get("/quote/{symbol}")
def get_quote(symbol: str):

    try:
        return MarketService.get_quote(symbol)

    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


# ----------------------------------
# DASHBOARD
# ----------------------------------
@router.get("/dashboard")
def get_dashboard():
    return MarketService.get_dashboard()
@router.get("/search")
def search(query: str):
    return MarketService.search(query)


# ----------------------------------
# TOP GAINERS
# ----------------------------------
@router.get("/top-gainers")
def get_top_gainers():
    return MarketService.get_top_gainers()


# ----------------------------------
# TOP LOSERS
# ----------------------------------
@router.get("/top-losers")
def get_top_losers():
    return MarketService.get_top_losers()