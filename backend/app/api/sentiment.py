from fastapi import APIRouter, HTTPException, Query

from app.services.sentiment_service import SentimentService


router = APIRouter(
    prefix="/sentiment",
    tags=["Sentiment Analysis"],
)


@router.get("/{symbol}")
def get_stock_sentiment(
    symbol: str,
    limit: int = Query(
        default=10,
        ge=1,
        le=25,
    ),
):
    try:
        return SentimentService.analyze_stock_news(
            symbol=symbol,
            limit=limit,
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )