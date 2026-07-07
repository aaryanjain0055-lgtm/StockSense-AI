from copy import deepcopy
from datetime import datetime, timedelta, timezone
from threading import Lock
from typing import Any


class PredictionCacheService:
    """
    Thread-safe in-memory TTL cache for production predictions.

    This cache is suitable for the current single-process development
    and small production deployment setup.

    For multi-instance deployment, replace this implementation with
    a shared cache such as Redis.
    """

    _cache: dict[str, dict[str, Any]] = {}
    _lock = Lock()

    DEFAULT_TTL_SECONDS = 900  # 15 minutes


    @classmethod
    def get(
        cls,
        symbol: str,
    ) -> dict[str, Any] | None:

        cache_key = symbol.upper()

        with cls._lock:
            cached_item = cls._cache.get(cache_key)

            if cached_item is None:
                return None

            expires_at = cached_item["expires_at"]

            if datetime.now(timezone.utc) >= expires_at:
                del cls._cache[cache_key]
                return None

            return deepcopy(cached_item["data"])


    @classmethod
    def set(
        cls,
        symbol: str,
        data: dict[str, Any],
        ttl_seconds: int | None = None,
    ) -> None:

        cache_key = symbol.upper()

        ttl = (
            ttl_seconds
            if ttl_seconds is not None
            else cls.DEFAULT_TTL_SECONDS
        )

        expires_at = (
            datetime.now(timezone.utc)
            + timedelta(seconds=ttl)
        )

        with cls._lock:
            cls._cache[cache_key] = {
                "data": deepcopy(data),
                "expires_at": expires_at,
            }


    @classmethod
    def delete(
        cls,
        symbol: str,
    ) -> bool:

        cache_key = symbol.upper()

        with cls._lock:
            existed = cache_key in cls._cache

            cls._cache.pop(
                cache_key,
                None,
            )

            return existed


    @classmethod
    def clear(cls) -> int:

        with cls._lock:
            count = len(cls._cache)

            cls._cache.clear()

            return count


    @classmethod
    def stats(cls) -> dict[str, Any]:

        now = datetime.now(timezone.utc)

        with cls._lock:
            expired_keys = [
                key
                for key, item in cls._cache.items()
                if now >= item["expires_at"]
            ]

            for key in expired_keys:
                del cls._cache[key]

            return {
                "cached_symbols": len(cls._cache),
                "symbols": list(cls._cache.keys()),
                "ttl_seconds": cls.DEFAULT_TTL_SECONDS,
                "cache_type": "IN_MEMORY_TTL",
            }