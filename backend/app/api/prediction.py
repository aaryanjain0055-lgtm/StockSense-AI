from fastapi import APIRouter

from app.core.validators import (
    validate_stock_symbol,
)

from app.services.prediction_cache_service import (
    PredictionCacheService,
)

from app.services.production_prediction_service import (
    ProductionPredictionService,
)


router = APIRouter(
    prefix="/api/v1/prediction",
    tags=["Prediction"],
)


@router.get("/{symbol}")
async def get_prediction(
    symbol: str,
):
    validated_symbol = validate_stock_symbol(
        symbol
    )

    cached_result = PredictionCacheService.get(
        validated_symbol
    )

    if cached_result is not None:
        cached_result["cache"] = {
            "status": "HIT",
            "ttl_seconds": (
                PredictionCacheService
                .DEFAULT_TTL_SECONDS
            ),
        }

        return cached_result

    result = ProductionPredictionService.predict(
        symbol=validated_symbol
    )

    PredictionCacheService.set(
        symbol=validated_symbol,
        data=result,
    )

    result["cache"] = {
        "status": "MISS",
        "ttl_seconds": (
            PredictionCacheService
            .DEFAULT_TTL_SECONDS
        ),
    }

    return result


@router.delete("/{symbol}/cache")
async def invalidate_prediction_cache(
    symbol: str,
):
    validated_symbol = validate_stock_symbol(
        symbol
    )

    deleted = PredictionCacheService.delete(
        validated_symbol
    )

    return {
        "success": True,
        "symbol": validated_symbol,
        "cache_deleted": deleted,
    }


@router.get("/")
async def prediction_cache_stats():
    return {
        "success": True,
        "cache": PredictionCacheService.stats(),
    }