from fastapi import APIRouter, HTTPException

from app.services.financial_service import FinancialService


router = APIRouter(
    prefix="/financial",
    tags=["Financial Analysis"],
)


@router.get("/{symbol}")
def get_financial_analysis(symbol: str):

    try:
        return FinancialService.get_financials(symbol)

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )