from datetime import datetime, timezone

from app.services.scoring_service import ScoringService


class ProductionPredictionService:

    # ==================================================
    # CONFIGURATION
    # ==================================================

    MODEL_STATUS = "EXPERIMENTAL"

    REGRESSION_STATUS = (
        "NO STABLE PREDICTIVE SIGNAL"
    )

    CLASSIFICATION_STATUS = (
        "EXPERIMENTAL SIGNAL ONLY"
    )

    # ==================================================
    # SCORE -> SIGNAL
    # ==================================================

    @staticmethod
    def score_to_signal(
        score: float,
    ):

        if score >= 75:
            return "STRONG POSITIVE"

        if score >= 65:
            return "POSITIVE"

        if score >= 55:
            return "SLIGHTLY POSITIVE"

        if score >= 45:
            return "NEUTRAL"

        if score >= 35:
            return "SLIGHTLY NEGATIVE"

        if score >= 25:
            return "NEGATIVE"

        return "STRONG NEGATIVE"


    # ==================================================
    # SCORE -> CONFIDENCE
    # ==================================================

    @staticmethod
    def score_confidence(
        score: float,
    ):

        distance_from_neutral = abs(
            score - 50
        )

        if distance_from_neutral >= 25:
            return "HIGH"

        if distance_from_neutral >= 15:
            return "MODERATE"

        return "LOW"


    # ==================================================
    # FACTOR AGREEMENT
    # ==================================================

    @staticmethod
    def factor_agreement(
        factor_scores: dict,
    ):

        scores = []

        for factor_name in [
            "technical",
            "fundamental",
            "analyst",
            "sentiment",
        ]:

            factor = factor_scores.get(
                factor_name,
                {},
            )

            score = factor.get(
                "score"
            )

            if score is not None:
                scores.append(
                    float(score)
                )

        if not scores:

            return {
                "status": "UNKNOWN",
                "positive_factors": 0,
                "negative_factors": 0,
                "neutral_factors": 0,
            }

        positive = sum(
            1
            for score in scores
            if score >= 60
        )

        negative = sum(
            1
            for score in scores
            if score <= 40
        )

        neutral = (
            len(scores)
            - positive
            - negative
        )

        if positive >= 3:
            status = "BROAD POSITIVE AGREEMENT"

        elif negative >= 3:
            status = "BROAD NEGATIVE AGREEMENT"

        elif (
            positive >= 2
            and negative >= 1
        ):
            status = "MIXED WITH POSITIVE BIAS"

        elif (
            negative >= 2
            and positive >= 1
        ):
            status = "MIXED WITH NEGATIVE BIAS"

        else:
            status = "MIXED OR NEUTRAL"

        return {
            "status": status,

            "positive_factors": positive,

            "negative_factors": negative,

            "neutral_factors": neutral,

            "total_factors": len(scores),
        }


    # ==================================================
    # RISK FLAGS
    # ==================================================

    @staticmethod
    def build_risk_flags(
        scoring_result: dict,
    ):

        flags = []

        factor_scores = scoring_result.get(
            "factor_scores",
            {},
        )

        technical = factor_scores.get(
            "technical",
            {},
        )

        technical_score = technical.get(
            "score",
            50,
        )

        technical_details = technical.get(
            "details",
            {},
        )

        trend = technical_details.get(
            "trend"
        )

        relative_volume = technical_details.get(
            "relative_volume"
        )

        rsi = technical_details.get(
            "rsi"
        )

        if technical_score < 45:

            flags.append(
                {
                    "level": "WARNING",
                    "category": "TECHNICAL",
                    "message": (
                        "Technical conditions are "
                        "currently weak."
                    ),
                }
            )

        if trend in [
            "DOWNTREND",
            "STRONG DOWNTREND",
        ]:

            flags.append(
                {
                    "level": "WARNING",
                    "category": "TREND",
                    "message": (
                        f"Price structure is currently "
                        f"classified as {trend}."
                    ),
                }
            )

        if (
            relative_volume is not None
            and relative_volume < 0.5
        ):

            flags.append(
                {
                    "level": "INFO",
                    "category": "VOLUME",
                    "message": (
                        "Current trading volume is "
                        "significantly below its "
                        "recent average."
                    ),
                }
            )

        if (
            rsi is not None
            and rsi >= 70
        ):

            flags.append(
                {
                    "level": "WARNING",
                    "category": "MOMENTUM",
                    "message": (
                        "RSI is in an overbought region."
                    ),
                }
            )

        if (
            rsi is not None
            and rsi <= 30
        ):

            flags.append(
                {
                    "level": "WARNING",
                    "category": "MOMENTUM",
                    "message": (
                        "RSI is in an oversold region."
                    ),
                }
            )

        # ML reliability warning

        flags.append(
            {
                "level": "IMPORTANT",
                "category": "MODEL_RELIABILITY",
                "message": (
                    "Historical ML experiments did not "
                    "show sufficiently stable predictive "
                    "performance for confident return "
                    "forecasting."
                ),
            }
        )

        return flags


    # ==================================================
    # BUILD EXPLANATION
    # ==================================================

    @staticmethod
    def build_explanation(
        scoring_result: dict,
    ):

        factor_scores = scoring_result.get(
            "factor_scores",
            {},
        )

        explanation = []

        for factor_name in [
            "technical",
            "fundamental",
            "analyst",
            "sentiment",
        ]:

            factor = factor_scores.get(
                factor_name,
                {},
            )

            explanation.append(
                {
                    "factor": (
                        factor_name.upper()
                    ),

                    "score": factor.get(
                        "score"
                    ),

                    "reasons": factor.get(
                        "reasons",
                        [],
                    ),
                }
            )

        return explanation


    # ==================================================
    # PRODUCTION PREDICTION
    # ==================================================

    @staticmethod
    def predict(
        symbol: str,
    ):

        # ==============================================
        # EXPLAINABLE MULTI-FACTOR SCORE
        # ==============================================

        scoring_result = (
            ScoringService
            .get_stock_score(
                symbol
            )
        )

        score = float(
            scoring_result["score"]
        )

        classification = (
            scoring_result[
                "classification"
            ]
        )

        # ==============================================
        # SIGNAL
        # ==============================================

        signal = (
            ProductionPredictionService
            .score_to_signal(
                score
            )
        )

        confidence = (
            ProductionPredictionService
            .score_confidence(
                score
            )
        )

        # ==============================================
        # FACTOR AGREEMENT
        # ==============================================

        agreement = (
            ProductionPredictionService
            .factor_agreement(
                scoring_result.get(
                    "factor_scores",
                    {},
                )
            )
        )

        # ==============================================
        # RISK FLAGS
        # ==============================================

        risk_flags = (
            ProductionPredictionService
            .build_risk_flags(
                scoring_result
            )
        )

        # ==============================================
        # EXPLANATION
        # ==============================================

        explanation = (
            ProductionPredictionService
            .build_explanation(
                scoring_result
            )
        )

        # ==============================================
        # FINAL RESPONSE
        # ==============================================

        return {
            "symbol": symbol.upper(),

            "generated_at": (
                datetime.now(
                    timezone.utc
                ).isoformat()
            ),

            "production_signal": {
                "score": round(
                    score,
                    2,
                ),

                "classification": (
                    classification
                ),

                "signal": signal,

                "confidence": confidence,

                "factor_agreement": (
                    agreement["status"]
                ),
            },

            "factor_agreement": (
                agreement
            ),

            "factor_scores": (
                scoring_result.get(
                    "factor_scores",
                    {},
                )
            ),

            "weighted_contributions": (
                scoring_result.get(
                    "weighted_contributions",
                    {},
                )
            ),

            "explanation": explanation,

            "risk_flags": risk_flags,

            "model_governance": {
                "production_mode": (
                    "EXPLAINABLE MULTI-FACTOR ANALYSIS"
                ),

                "classification_model": {
                    "status": (
                        ProductionPredictionService
                        .CLASSIFICATION_STATUS
                    ),

                    "used_for_final_signal": False,
                },

                "regression_model": {
                    "status": (
                        ProductionPredictionService
                        .REGRESSION_STATUS
                    ),

                    "used_for_final_signal": False,
                },

                "reason": (
                    "ML experiments are retained for "
                    "research and benchmarking but are "
                    "not allowed to override the "
                    "explainable production score."
                ),
            },

            "methodology": (
                scoring_result.get(
                    "methodology"
                )
            ),

            "disclaimer": (
                "This output is an analytical research "
                "signal based on technical, fundamental, "
                "analyst, and news sentiment factors. "
                "It is not a guaranteed forecast or "
                "investment recommendation."
            ),
        }