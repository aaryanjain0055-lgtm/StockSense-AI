from app.services.technical_service import TechnicalService
from app.services.financial_service import FinancialService
from app.services.company_service import CompanyService
from app.services.sentiment_service import SentimentService


class ScoringService:

    WEIGHTS = {
        "technical": 0.30,
        "fundamental": 0.30,
        "analyst": 0.20,
        "sentiment": 0.20,
    }


    @staticmethod
    def clamp(
        value,
        minimum=0.0,
        maximum=100.0,
    ):
        return max(
            minimum,
            min(
                float(value),
                maximum,
            ),
        )


    # ==================================================
    # TECHNICAL SCORE
    # ==================================================

    @staticmethod
    def technical_score(data):

        score = 50.0
        reasons = []

        # ==================================================
        # RSI
        # ==================================================

        rsi_data = data.get("rsi", {})

        rsi = rsi_data.get("value")

        rsi_signal = str(
            rsi_data.get("signal", "")
        ).upper()


        if rsi is not None:

            if 50 <= rsi <= 70:

                score += 15

                reasons.append(
                    f"RSI is {rsi}, showing healthy bullish momentum."
                )


            elif 40 <= rsi < 50:

                score += 5

                reasons.append(
                    f"RSI is {rsi}, indicating neutral momentum."
                )


            elif 30 <= rsi < 40:

                score -= 5

                reasons.append(
                    f"RSI is {rsi}, showing weak momentum."
                )


            elif rsi > 75:

                score -= 10

                reasons.append(
                    f"RSI is {rsi}, indicating potentially "
                    "overbought conditions."
                )


            elif rsi < 30:

                score -= 10

                reasons.append(
                    f"RSI is {rsi}, indicating oversold "
                    "or strong downside conditions."
                )


        # ==================================================
        # MACD
        # ==================================================

        macd_data = data.get(
            "macd",
            {},
        )


        macd_value = macd_data.get(
            "value"
        )


        signal_line = macd_data.get(
            "signal_line"
        )


        histogram = macd_data.get(
            "histogram"
        )


        macd_signal = str(
            macd_data.get(
                "signal",
                "",
            )
        ).upper()


        if macd_signal == "BUY":

            score += 15

            reasons.append(
                "MACD indicates a bullish BUY signal."
            )


        elif macd_signal == "SELL":

            score -= 15

            reasons.append(
                "MACD indicates a bearish SELL signal."
            )


        elif (
            macd_value is not None
            and signal_line is not None
        ):

            if macd_value > signal_line:

                score += 10

                reasons.append(
                    "MACD is above the signal line."
                )


            else:

                score -= 10

                reasons.append(
                    "MACD is below the signal line."
                )


        # ==================================================
        # MOVING AVERAGES
        # ==================================================

        moving_averages = data.get(
            "moving_averages",
            {},
        )


        current_price = data.get(
            "current_price"
        )


        ema20 = moving_averages.get(
            "ema20"
        )


        ema50 = moving_averages.get(
            "ema50"
        )


        if (
            current_price is not None
            and ema20 is not None
        ):

            if current_price > ema20:

                score += 5

                reasons.append(
                    "Current price is above the 20-day EMA."
                )


            else:

                score -= 5

                reasons.append(
                    "Current price is below the 20-day EMA."
                )


        if (
            current_price is not None
            and ema50 is not None
        ):

            if current_price > ema50:

                score += 5

                reasons.append(
                    "Current price is above the 50-day EMA."
                )


            else:

                score -= 5

                reasons.append(
                    "Current price is below the 50-day EMA."
                )


        # ==================================================
        # VOLUME
        # ==================================================

        volume_data = data.get(
            "volume",
            {},
        )


        relative_volume = volume_data.get(
            "relative_volume"
        )


        if relative_volume is not None:

            if relative_volume >= 1.5:

                score += 10

                reasons.append(
                    "Trading volume is significantly above average."
                )


            elif relative_volume >= 1.0:

                score += 5

                reasons.append(
                    "Trading volume is above its recent average."
                )


            elif relative_volume < 0.5:

                reasons.append(
                    "Trading volume is currently below average."
                )


        # ==================================================
        # TREND
        # ==================================================

        trend = str(
            data.get(
                "trend",
                "",
            )
        ).upper()


        if trend == "STRONG UPTREND":

            score += 20

            reasons.append(
                "Price structure indicates a strong uptrend."
            )


        elif trend == "UPTREND":

            score += 10

            reasons.append(
                "Price structure indicates an uptrend."
            )


        elif trend == "STRONG DOWNTREND":

            score -= 20

            reasons.append(
                "Price structure indicates a strong downtrend."
            )


        elif trend == "DOWNTREND":

            score -= 10

            reasons.append(
                "Price structure indicates a downtrend."
            )


        # ==================================================
        # RESULT
        # ==================================================

        return {
            "score": round(
                ScoringService.clamp(
                    score
                ),
                2,
            ),

            "reasons": reasons,

            "details": {
                "rsi": rsi,
                "rsi_signal": rsi_signal,

                "macd": macd_value,
                "macd_signal_line": signal_line,
                "macd_histogram": histogram,
                "macd_signal": macd_signal,

                "ema20": ema20,
                "ema50": ema50,

                "relative_volume": relative_volume,

                "trend": trend,
            },
        }


    # ==================================================
    # FUNDAMENTAL SCORE
    # ==================================================

    @staticmethod
    def fundamental_score(data):

        score = 50.0
        reasons = []


        profitability = data.get(
            "profitability",
            {},
        )


        valuation = data.get(
            "valuation",
            {},
        )


        balance_sheet = data.get(
            "balance_sheet",
            {},
        )


        # -----------------------------
        # ROE
        # -----------------------------

        roe = profitability.get(
            "roe"
        )


        if roe is not None:

            if roe >= 20:

                score += 20

                reasons.append(
                    "ROE indicates strong capital efficiency."
                )


            elif roe >= 15:

                score += 15

                reasons.append(
                    "ROE indicates good profitability."
                )


            elif roe >= 10:

                score += 5

                reasons.append(
                    "ROE is moderate."
                )


            elif roe < 5:

                score -= 10

                reasons.append(
                    "ROE is relatively weak."
                )


        # -----------------------------
        # OPERATING MARGIN
        # -----------------------------

        operating_margin = (
            profitability.get(
                "operating_margin"
            )
        )


        if operating_margin is not None:

            if operating_margin >= 20:

                score += 15

                reasons.append(
                    "Operating margin is strong."
                )


            elif operating_margin >= 10:

                score += 7

                reasons.append(
                    "Operating margin is healthy."
                )


            elif operating_margin < 5:

                score -= 8

                reasons.append(
                    "Operating margin is relatively low."
                )


        # -----------------------------
        # PE RATIO
        # -----------------------------

        pe_ratio = valuation.get(
            "pe_ratio"
        )


        if pe_ratio is not None:

            if 10 <= pe_ratio <= 30:

                score += 10

                reasons.append(
                    "P/E ratio is within a moderate "
                    "valuation range."
                )


            elif pe_ratio > 60:

                score -= 10

                reasons.append(
                    "P/E ratio suggests a high "
                    "valuation premium."
                )


        # -----------------------------
        # DEBT TO EQUITY
        # -----------------------------

        debt_to_equity = (
            balance_sheet.get(
                "debt_to_equity"
            )
        )


        if debt_to_equity is not None:

            if debt_to_equity < 50:

                score += 10

                reasons.append(
                    "Debt profile appears relatively controlled."
                )


            elif debt_to_equity > 150:

                score -= 10

                reasons.append(
                    "Debt-to-equity level is relatively high."
                )


        return {
            "score": round(
                ScoringService.clamp(
                    score
                ),
                2,
            ),

            "reasons": reasons,
        }


    # ==================================================
    # ANALYST SCORE
    # ==================================================

    @staticmethod
    def analyst_score(data):

        score = 50.0
        reasons = []


        analyst_view = data.get(
            "analyst_view",
            {},
        )


        upside = analyst_view.get(
            "analyst_upside_percent"
        )


        recommendation = str(
            analyst_view.get(
                "recommendation_key"
            )
            or ""
        ).lower()


        # -----------------------------
        # TARGET UPSIDE
        # -----------------------------

        if upside is not None:

            if upside >= 20:

                score += 25

                reasons.append(
                    "Mean analyst target implies significant upside."
                )


            elif upside >= 10:

                score += 15

                reasons.append(
                    "Mean analyst target implies moderate upside."
                )


            elif upside > 0:

                score += 5

                reasons.append(
                    "Mean analyst target implies limited upside."
                )


            elif upside <= -10:

                score -= 20

                reasons.append(
                    "Mean analyst target implies material downside."
                )


            else:

                score -= 5

                reasons.append(
                    "Mean analyst target is below the current price."
                )


        # -----------------------------
        # ANALYST RECOMMENDATION
        # -----------------------------

        if "strong_buy" in recommendation:

            score += 20

            reasons.append(
                "Analyst consensus is strong buy."
            )


        elif "buy" in recommendation:

            score += 12

            reasons.append(
                "Analyst consensus is buy."
            )


        elif "sell" in recommendation:

            score -= 15

            reasons.append(
                "Analyst consensus is sell."
            )


        return {
            "score": round(
                ScoringService.clamp(
                    score
                ),
                2,
            ),

            "reasons": reasons,
        }


    # ==================================================
    # SENTIMENT SCORE
    # ==================================================

    @staticmethod
    def sentiment_score(data):

        normalized_score = data.get(
            "average_score",
            0.0,
        )


        score = (
            (normalized_score + 1)
            / 2
        ) * 100


        reasons = [
            (
                "News sentiment is "
                f"{data.get('overall_sentiment', 'NEUTRAL').lower()} "
                f"across "
                f"{data.get('article_count', 0)} "
                f"analyzed articles."
            )
        ]


        return {
            "score": round(
                ScoringService.clamp(
                    score
                ),
                2,
            ),

            "reasons": reasons,
        }


    # ==================================================
    # CLASSIFICATION
    # ==================================================

    @staticmethod
    def classification(score):

        if score >= 80:
            return "STRONG"

        if score >= 65:
            return "POSITIVE"

        if score >= 45:
            return "NEUTRAL"

        if score >= 30:
            return "WEAK"

        return "HIGH RISK"


    # ==================================================
    # COMPLETE STOCK SCORE
    # ==================================================

    @staticmethod
    def get_stock_score(symbol: str):


        # -----------------------------
        # FETCH TECHNICAL DATA
        # -----------------------------

        technical_data = (
            TechnicalService.get_analysis(
                symbol
            )
        )


        # -----------------------------
        # FETCH FINANCIAL DATA
        # -----------------------------

        financial_data = (
            FinancialService.get_financials(
                symbol
            )
        )


        # -----------------------------
        # FETCH COMPANY DATA
        # -----------------------------

        company_data = (
            CompanyService.get_company_intelligence(
                symbol
            )
        )


        # -----------------------------
        # FETCH SENTIMENT DATA
        # -----------------------------

        sentiment_data = (
            SentimentService.analyze_stock_news(
                symbol=symbol,
                limit=10,
            )
        )


        # -----------------------------
        # CALCULATE FACTOR SCORES
        # -----------------------------

        technical = (
            ScoringService.technical_score(
                technical_data
            )
        )


        fundamental = (
            ScoringService.fundamental_score(
                financial_data
            )
        )


        analyst = (
            ScoringService.analyst_score(
                company_data
            )
        )


        sentiment = (
            ScoringService.sentiment_score(
                sentiment_data
            )
        )


        # -----------------------------
        # STORE FACTOR RESULTS
        # -----------------------------

        factor_scores = {
            "technical": technical,
            "fundamental": fundamental,
            "analyst": analyst,
            "sentiment": sentiment,
        }


        # -----------------------------
        # WEIGHTED CONTRIBUTIONS
        # -----------------------------

        weighted_contributions = {}

        final_score = 0.0


        for factor, result in factor_scores.items():

            contribution = (
                result["score"]
                * ScoringService.WEIGHTS[factor]
            )


            weighted_contributions[
                factor
            ] = round(
                contribution,
                2,
            )


            final_score += contribution


        # -----------------------------
        # FINAL SCORE
        # -----------------------------

        final_score = round(
            ScoringService.clamp(
                final_score
            ),
            2,
        )


        # -----------------------------
        # RESPONSE
        # -----------------------------

        return {
            "symbol": symbol.upper(),

            "score": final_score,

            "classification": (
                ScoringService.classification(
                    final_score
                )
            ),

            "weights": (
                ScoringService.WEIGHTS
            ),

            "factor_scores": (
                factor_scores
            ),

            "weighted_contributions": (
                weighted_contributions
            ),

            "methodology": (
                "Explainable weighted multi-factor score. "
                "This is an analytical score, not a guaranteed "
                "forecast or investment recommendation."
            ),
        }