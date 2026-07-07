from fastapi import APIRouter, HTTPException

from app.services.technical_service import TechnicalService


router = APIRouter(
    prefix="/technical",
    tags=["Technical Analysis"],
)


@router.get("/{symbol}")
def get_technical_analysis(symbol: str):

    try:
        return TechnicalService.get_analysis(symbol)

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )