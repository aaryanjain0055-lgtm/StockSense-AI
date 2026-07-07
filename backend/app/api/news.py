from fastapi import APIRouter, HTTPException, Query

from app.services.news_service import NewsService


router = APIRouter(
    prefix="/news",
    tags=["News Intelligence"],
)


@router.get("/{symbol}")
def get_stock_news(
    symbol: str,
    limit: int = Query(
        default=10,
        ge=1,
        le=25,
    ),
):
    try:
        return NewsService.get_stock_news(
            symbol=symbol,
            limit=limit,
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )