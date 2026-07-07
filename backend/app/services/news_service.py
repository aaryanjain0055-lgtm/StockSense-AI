from datetime import datetime, timezone

import yfinance as yf


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
    def get_stock_news(
        symbol: str,
        limit: int = 10,
    ):

        try:
            ticker = yf.Ticker(symbol)

            raw_news = ticker.news

            if not raw_news:
                return {
                    "symbol": symbol.upper(),
                    "count": 0,
                    "articles": [],
                }


            articles = []


            for item in raw_news:

                # Newer yfinance versions may wrap
                # article information inside "content".

                content = item.get(
                    "content",
                    item,
                )


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
                    {}
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
                    {}
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
                        []
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
                "symbol": symbol.upper(),
                "count": len(articles),
                "articles": articles,
            }


        except Exception as e:

            raise ValueError(
                f"Unable to fetch news for "
                f"{symbol}: {str(e)}"
            )