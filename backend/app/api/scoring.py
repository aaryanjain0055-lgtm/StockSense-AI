from fastapi import (
    APIRouter,
    HTTPException,
    Query,
)

from app.services.cache_service import (
    CacheService,
)

from app.services.scoring_service import (
    ScoringService,
)


router = APIRouter(
    prefix="/analysis",
    tags=["Stock Intelligence"],
)


SCORE_CACHE_TTL = 300


@router.get("/score/{symbol}")
def get_stock_score(
    symbol: str,

    refresh: bool = Query(
        default=False,
        description=(
            "Force recalculation instead of "
            "using the cached score."
        ),
    ),
):

    try:

        normalized_symbol = (
            symbol
            .strip()
            .upper()
        )


        if not normalized_symbol:

            raise HTTPException(
                status_code=400,
                detail="Stock symbol is required.",
            )


        cache_key = (
            f"stock_score:{normalized_symbol}"
        )


        if not refresh:

            cached_result = (
                CacheService.get(
                    cache_key
                )
            )


            if cached_result is not None:

                return {
                    **cached_result,

                    "cache": {
                        "status": "HIT",

                        "ttl_seconds": (
                            SCORE_CACHE_TTL
                        ),
                    },
                }


        result = (
            ScoringService.get_stock_score(
                normalized_symbol
            )
        )


        CacheService.set(
            key=cache_key,
            value=result,
            ttl_seconds=SCORE_CACHE_TTL,
        )


        return {
            **result,

            "cache": {
                "status": "MISS",

                "ttl_seconds": (
                    SCORE_CACHE_TTL
                ),
            },
        }


    except HTTPException:
        raise


    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to calculate stock score: "
                f"{str(error)}"
            ),
        )


@router.delete("/score/{symbol}/cache")
def clear_stock_score_cache(
    symbol: str,
):

    normalized_symbol = (
        symbol
        .strip()
        .upper()
    )


    cache_key = (
        f"stock_score:{normalized_symbol}"
    )


    CacheService.delete(
        cache_key
    )


    return {
        "symbol": normalized_symbol,

        "message": (
            "Stock score cache cleared."
        ),
    }


@router.get("/cache/stats")
def get_cache_stats():

    return CacheService.stats()