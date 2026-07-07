import time
from threading import Lock
from typing import Any


class CacheService:

    _cache: dict[str, dict[str, Any]] = {}

    _lock = Lock()


    @classmethod
    def get(cls, key: str):

        with cls._lock:

            item = cls._cache.get(key)

            if item is None:
                return None


            expires_at = item["expires_at"]


            if time.time() >= expires_at:

                del cls._cache[key]

                return None


            return item["value"]


    @classmethod
    def set(
        cls,
        key: str,
        value: Any,
        ttl_seconds: int = 300,
    ):

        with cls._lock:

            cls._cache[key] = {
                "value": value,

                "expires_at": (
                    time.time()
                    + ttl_seconds
                ),
            }


    @classmethod
    def delete(cls, key: str):

        with cls._lock:

            if key in cls._cache:
                del cls._cache[key]


    @classmethod
    def clear(cls):

        with cls._lock:

            cls._cache.clear()


    @classmethod
    def stats(cls):

        with cls._lock:

            current_time = time.time()

            active_items = 0

            expired_items = 0


            for item in cls._cache.values():

                if current_time < item["expires_at"]:
                    active_items += 1

                else:
                    expired_items += 1


            return {
                "total_items": len(
                    cls._cache
                ),

                "active_items": active_items,

                "expired_items": expired_items,
            }