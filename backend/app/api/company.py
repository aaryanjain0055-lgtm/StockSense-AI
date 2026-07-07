from fastapi import APIRouter, HTTPException

from app.services.company_service import CompanyService


router = APIRouter(
    prefix="/company",
    tags=["Company Intelligence"],
)


@router.get("/{symbol}")
def get_company_intelligence(symbol: str):
    try:
        return CompanyService.get_company_intelligence(symbol)

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )