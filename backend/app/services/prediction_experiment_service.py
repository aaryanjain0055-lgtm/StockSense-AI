from app.services.baseline_model_service import (
    BaselineModelService,
)


class PredictionExperimentService:

    @staticmethod
    def run_experiments(
        symbol: str,
        period: str = "5y",
    ):

        horizons = [
            3,
            5,
            10,
            15,
            20,
        ]


        thresholds = [
            0.005,
            0.01,
            0.015,
            0.02,
        ]


        results = []


        for horizon in horizons:

            for threshold in thresholds:

                try:

                    result = (
                        BaselineModelService
                        .train(
                            symbol=symbol,
                            period=period,
                            horizon=horizon,
                            threshold=threshold,
                        )
                    )


                    validation_metrics = result[
                        "validation_metrics"
                    ]


                    test_metrics = result[
                        "test_metrics"
                    ]


                    validation_auc = (
                        validation_metrics[
                            "roc_auc"
                        ]
                    )


                    test_auc = (
                        test_metrics[
                            "roc_auc"
                        ]
                    )


                    validation_accuracy = (
                        validation_metrics[
                            "accuracy"
                        ]
                    )


                    test_accuracy = (
                        test_metrics[
                            "accuracy"
                        ]
                    )


                    # Stability gap:
                    # smaller is better.

                    auc_gap = abs(
                        test_auc
                        - validation_auc
                    )


                    accuracy_gap = abs(
                        test_accuracy
                        - validation_accuracy
                    )


                    # Conservative score.
                    #
                    # We reward the weaker of validation
                    # and test performance rather than
                    # rewarding one lucky period.

                    minimum_auc = min(
                        validation_auc,
                        test_auc,
                    )


                    average_auc = (
                        validation_auc
                        + test_auc
                    ) / 2


                    stability_score = (
                        minimum_auc * 0.60
                        + average_auc * 0.30
                        - auc_gap * 0.10
                    )


                    results.append(
                        {
                            "horizon": horizon,

                            "threshold": threshold,

                            "validation_accuracy": (
                                validation_accuracy
                            ),

                            "validation_auc": (
                                validation_auc
                            ),

                            "test_accuracy": (
                                test_accuracy
                            ),

                            "test_auc": (
                                test_auc
                            ),

                            "validation_improvement": (
                                result[
                                    "validation_accuracy_improvement"
                                ]
                            ),

                            "test_improvement": (
                                result[
                                    "test_accuracy_improvement"
                                ]
                            ),

                            "auc_gap": round(
                                auc_gap,
                                4,
                            ),

                            "accuracy_gap": round(
                                accuracy_gap,
                                4,
                            ),

                            "stability_score": round(
                                stability_score,
                                4,
                            ),

                            "validation_rows": (
                                result[
                                    "split_summary"
                                ][
                                    "validation_rows"
                                ]
                            ),

                            "test_rows": (
                                result[
                                    "split_summary"
                                ][
                                    "test_rows"
                                ]
                            ),

                            "status": (
                                result[
                                    "model_status"
                                ]
                            ),
                        }
                    )


                except Exception as error:

                    results.append(
                        {
                            "horizon": horizon,

                            "threshold": threshold,

                            "error": str(error),
                        }
                    )


        successful_results = [
            item
            for item in results
            if "error" not in item
        ]


        successful_results.sort(
            key=lambda item: (
                item["stability_score"]
            ),
            reverse=True,
        )


        best_configuration = (
            successful_results[0]
            if successful_results
            else None
        )


        return {
            "symbol": symbol.upper(),

            "period": period,

            "experiment_count": len(
                results
            ),

            "successful_experiments": len(
                successful_results
            ),

            "best_configuration": (
                best_configuration
            ),

            "ranked_results": (
                successful_results
            ),

            "failed_results": [
                item
                for item in results
                if "error" in item
            ],
        }