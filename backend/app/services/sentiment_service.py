import re

from app.services.news_service import NewsService


class SentimentService:

    POSITIVE_WORDS = {
        "gain": 1,
        "gains": 1,
        "growth": 2,
        "grow": 1,
        "grew": 1,
        "rise": 1,
        "rises": 1,
        "rising": 1,
        "surge": 2,
        "surges": 2,
        "jump": 2,
        "jumps": 2,
        "strong": 1,
        "stronger": 2,
        "profit": 1,
        "profits": 1,
        "profitable": 2,
        "beat": 2,
        "beats": 2,
        "upgrade": 2,
        "upgraded": 2,
        "bullish": 2,
        "outperform": 2,
        "expansion": 1,
        "expand": 1,
        "partnership": 1,
        "deal": 1,
        "record": 2,
        "recovery": 1,
        "positive": 2,
        "buy": 2,
        "innovation": 1,
        "opportunity": 1,
        "opportunities": 1,
        "higher": 1,
        "improve": 1,
        "improved": 1,
        "improvement": 1,
        "listing": 1,
        "investment": 1,
        "investments": 1,
        "launch": 1,
        "launched": 1,
        "approval": 2,
        "approved": 2,
    }


    NEGATIVE_WORDS = {
        "loss": -2,
        "losses": -2,
        "decline": -1,
        "declines": -1,
        "drop": -1,
        "drops": -1,
        "fall": -1,
        "falls": -1,
        "falling": -1,
        "plunge": -2,
        "plunges": -2,
        "weak": -1,
        "weaker": -2,
        "miss": -2,
        "misses": -2,
        "downgrade": -2,
        "downgraded": -2,
        "bearish": -2,
        "underperform": -2,
        "risk": -1,
        "risks": -1,
        "lawsuit": -2,
        "fraud": -3,
        "investigation": -2,
        "penalty": -2,
        "debt": -1,
        "negative": -2,
        "sell": -2,
        "crisis": -3,
        "concern": -1,
        "concerns": -1,
        "warning": -2,
        "cut": -1,
        "cuts": -1,
        "lower": -1,
        "slowdown": -2,
        "probe": -2,
        "default": -3,
        "fine": -2,
        "fined": -2,
    }


    @staticmethod
    def tokenize(text: str):

        return re.findall(
            r"\b[a-zA-Z]+\b",
            text.lower(),
        )


    @staticmethod
    def normalize_score(raw_score: int):

        if raw_score == 0:
            return 0.0

        normalized = raw_score / (
            abs(raw_score) + 3
        )

        return round(
            max(-1.0, min(normalized, 1.0)),
            3,
        )


    @staticmethod
    def analyze_text(text: str):

        words = SentimentService.tokenize(text)

        raw_score = 0

        positive_matches = []
        negative_matches = []


        for word in words:

            if word in SentimentService.POSITIVE_WORDS:

                weight = (
                    SentimentService
                    .POSITIVE_WORDS[word]
                )

                raw_score += weight

                positive_matches.append(word)


            if word in SentimentService.NEGATIVE_WORDS:

                weight = (
                    SentimentService
                    .NEGATIVE_WORDS[word]
                )

                raw_score += weight

                negative_matches.append(word)


        normalized_score = (
            SentimentService.normalize_score(
                raw_score
            )
        )


        if normalized_score >= 0.25:
            label = "POSITIVE"

        elif normalized_score <= -0.25:
            label = "NEGATIVE"

        else:
            label = "NEUTRAL"


        keyword_count = (
            len(positive_matches)
            + len(negative_matches)
        )


        confidence = min(
            keyword_count / 5,
            1.0,
        )


        return {
            "label": label,

            "raw_score": raw_score,

            "normalized_score": (
                normalized_score
            ),

            "confidence": round(
                confidence,
                2,
            ),

            "positive_keywords": list(
                dict.fromkeys(
                    positive_matches
                )
            ),

            "negative_keywords": list(
                dict.fromkeys(
                    negative_matches
                )
            ),
        }


    @staticmethod
    def analyze_stock_news(
        symbol: str,
        limit: int = 10,
    ):

        news_data = NewsService.get_stock_news(
            symbol=symbol,
            limit=limit,
        )


        analyzed_articles = []

        normalized_scores = []

        positive_count = 0
        negative_count = 0
        neutral_count = 0


        for article in news_data["articles"]:

            combined_text = (
                f"{article.get('title', '')} "
                f"{article.get('summary', '')}"
            )


            sentiment = (
                SentimentService.analyze_text(
                    combined_text
                )
            )


            normalized_scores.append(
                sentiment["normalized_score"]
            )


            if sentiment["label"] == "POSITIVE":
                positive_count += 1

            elif sentiment["label"] == "NEGATIVE":
                negative_count += 1

            else:
                neutral_count += 1


            analyzed_articles.append(
                {
                    **article,
                    "sentiment": sentiment,
                }
            )


        article_count = len(
            analyzed_articles
        )


        if normalized_scores:

            average_normalized_score = (
                sum(normalized_scores)
                / len(normalized_scores)
            )

        else:

            average_normalized_score = 0.0


        average_normalized_score = round(
            average_normalized_score,
            3,
        )


        if average_normalized_score >= 0.15:
            overall_sentiment = "POSITIVE"

        elif average_normalized_score <= -0.15:
            overall_sentiment = "NEGATIVE"

        else:
            overall_sentiment = "NEUTRAL"


        total_classified = (
            positive_count
            + negative_count
            + neutral_count
        )


        if total_classified > 0:

            positive_percent = round(
                positive_count
                / total_classified
                * 100,
                2,
            )

            neutral_percent = round(
                neutral_count
                / total_classified
                * 100,
                2,
            )

            negative_percent = round(
                negative_count
                / total_classified
                * 100,
                2,
            )

        else:

            positive_percent = 0
            neutral_percent = 0
            negative_percent = 0


        return {
            "symbol": symbol.upper(),

            "article_count": article_count,

            "overall_sentiment": (
                overall_sentiment
            ),

            "average_score": (
                average_normalized_score
            ),

            "distribution": {
                "positive": positive_count,
                "negative": negative_count,
                "neutral": neutral_count,
            },

            "distribution_percent": {
                "positive": positive_percent,
                "negative": negative_percent,
                "neutral": neutral_percent,
            },

            "articles": analyzed_articles,
        }