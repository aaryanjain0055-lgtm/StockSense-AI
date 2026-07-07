from datetime import datetime, timezone
import logging

import yfinance as yf


logger = logging.getLogger(__name__)


class NewsService:

    @staticmethod
    def format_timestamp(timestamp):

        if timestamp is None:
            return None

        try:
            return datetime.fromtimestamp(
                timestamp,
                tz=timezone.utc,
            ).isoformat()

        except (TypeError, ValueError, OSError):
            return None


    @staticmethod
    def empty_news_response(
        symbol: str,
        reason: str,
    ):
        """
        Return a schema-compatible degraded response when
        upstream news data is unavailable.
        """

        return {
            "symbol": symbol.upper(),
            "count": 0,
            "articles": [],
            "data_status": "DEGRADED",
            "data_message": reason,
        }


    @staticmethod
    def get_stock_news(
        symbol: str,
        limit: int = 10,
    ):

        normalized_symbol = symbol.strip().upper()

        try:
            ticker = yf.Ticker(normalized_symbol)

            raw_news = ticker.news

            if not raw_news:
                return {
                    "symbol": normalized_symbol,
                    "count": 0,
                    "articles": [],
                    "data_status": "AVAILABLE",
                    "data_message": None,
                }


            articles = []


            for item in raw_news:

                if not isinstance(item, dict):
                    continue


                # Newer yfinance versions may wrap article
                # information inside "content".

                content = item.get(
                    "content",
                    item,
                )

                if not isinstance(content, dict):
                    continue


                title = content.get(
                    "title",
                    "Untitled Article",
                )


                summary = (
                    content.get("summary")
                    or content.get("description")
                    or ""
                )


                # -----------------------------
                # PUBLISHER
                # -----------------------------

                provider = content.get(
                    "provider",
                    {},
                )

                if isinstance(provider, dict):
                    publisher = provider.get(
                        "displayName"
                    )
                else:
                    publisher = provider


                if not publisher:
                    publisher = (
                        content.get("publisher")
                        or "Unknown"
                    )


                # -----------------------------
                # URL
                # -----------------------------

                canonical_url = content.get(
                    "canonicalUrl",
                    {},
                )

                if isinstance(canonical_url, dict):
                    article_url = canonical_url.get(
                        "url"
                    )
                else:
                    article_url = canonical_url


                if not article_url:
                    article_url = (
                        content.get("link")
                        or content.get("url")
                    )


                # -----------------------------
                # PUBLISH TIME
                # -----------------------------

                published_at = (
                    content.get("pubDate")
                    or content.get(
                        "providerPublishTime"
                    )
                )


                if isinstance(
                    published_at,
                    (int, float),
                ):
                    published_at = (
                        NewsService.format_timestamp(
                            published_at
                        )
                    )


                # -----------------------------
                # THUMBNAIL
                # -----------------------------

                thumbnail_url = None

                thumbnail = content.get(
                    "thumbnail"
                )

                if isinstance(thumbnail, dict):

                    resolutions = thumbnail.get(
                        "resolutions",
                        [],
                    )

                    if resolutions:
                        thumbnail_url = (
                            resolutions[-1].get(
                                "url"
                            )
                        )


                articles.append(
                    {
                        "title": title,
                        "summary": summary,
                        "publisher": publisher,
                        "published_at": published_at,
                        "url": article_url,
                        "thumbnail": thumbnail_url,
                    }
                )


                if len(articles) >= limit:
                    break


            return {
                "symbol": normalized_symbol,
                "count": len(articles),
                "articles": articles,
                "data_status": "AVAILABLE",
                "data_message": None,
            }


        except Exception as error:

            error_message = str(error)

            logger.warning(
                "News unavailable for %s: %s",
                normalized_symbol,
                error_message,
            )

            if (
                "Too Many Requests" in error_message
                or "Rate limited" in error_message
                or "429" in error_message
            ):
                reason = (
                    "News provider is temporarily rate limited."
                )

            else:
                reason = (
                    "News data is temporarily unavailable."
                )

            return NewsService.empty_news_response(
                normalized_symbol,
                reason,
            )