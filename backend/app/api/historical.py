from fastapi import APIRouter

from app.services.historical_service import HistoricalService

router = APIRouter(
    prefix="/historical",
    tags=["Historical Data"],
)


@router.get("/{symbol}")
def history(
    symbol: str,
    period: str = "6mo",
):
    return HistoricalService.get_history(symbol, period)