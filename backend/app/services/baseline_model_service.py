from sklearn.linear_model import LogisticRegression

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
)

from app.services.prediction_split_service import (
    PredictionSplitService,
)


class BaselineModelService:

    # ==================================================
    # METRICS
    # ==================================================

    @staticmethod
    def calculate_metrics(
        y_true,
        predictions,
        probabilities,
    ):

        metrics = {
            "accuracy": round(
                float(
                    accuracy_score(
                        y_true,
                        predictions,
                    )
                ),
                4,
            ),

            "precision": round(
                float(
                    precision_score(
                        y_true,
                        predictions,
                        zero_division=0,
                    )
                ),
                4,
            ),

            "recall": round(
                float(
                    recall_score(
                        y_true,
                        predictions,
                        zero_division=0,
                    )
                ),
                4,
            ),

            "f1_score": round(
                float(
                    f1_score(
                        y_true,
                        predictions,
                        zero_division=0,
                    )
                ),
                4,
            ),

            "confusion_matrix": (
                confusion_matrix(
                    y_true,
                    predictions,
                    labels=[0, 1],
                )
                .tolist()
            ),
        }


        # ROC-AUC requires both target classes.

        if len(set(y_true.tolist())) == 2:

            metrics["roc_auc"] = round(
                float(
                    roc_auc_score(
                        y_true,
                        probabilities,
                    )
                ),
                4,
            )

        else:

            metrics["roc_auc"] = None


        return metrics


    # ==================================================
    # MAJORITY BASELINE
    # ==================================================

    @staticmethod
    def majority_baseline(
        y_train,
        y_evaluation,
    ):

        majority_class = int(
            y_train
            .value_counts()
            .idxmax()
        )


        predictions = [
            majority_class
            for _ in range(
                len(y_evaluation)
            )
        ]


        accuracy = accuracy_score(
            y_evaluation,
            predictions,
        )


        return {
            "majority_class": (
                majority_class
            ),

            "accuracy": round(
                float(accuracy),
                4,
            ),

            "evaluation_rows": int(
                len(y_evaluation)
            ),
        }


    # ==================================================
    # PROBABILITY DIAGNOSTICS
    # ==================================================

    @staticmethod
    def probability_diagnostics(
        probabilities,
    ):

        return {
            "minimum_probability": round(
                float(
                    probabilities.min()
                ),
                4,
            ),

            "maximum_probability": round(
                float(
                    probabilities.max()
                ),
                4,
            ),

            "mean_probability": round(
                float(
                    probabilities.mean()
                ),
                4,
            ),

            "below_40_percent": int(
                (
                    probabilities < 0.40
                ).sum()
            ),

            "between_40_and_60_percent": int(
                (
                    (
                        probabilities >= 0.40
                    )
                    &
                    (
                        probabilities <= 0.60
                    )
                ).sum()
            ),

            "above_60_percent": int(
                (
                    probabilities > 0.60
                ).sum()
            ),
        }


    # ==================================================
    # PREDICTION DISTRIBUTION
    # ==================================================

    @staticmethod
    def prediction_distribution(
        predictions,
    ):

        total = len(predictions)


        predicted_down = int(
            (
                predictions == 0
            ).sum()
        )


        predicted_up = int(
            (
                predictions == 1
            ).sum()
        )


        return {
            "predicted_down": (
                predicted_down
            ),

            "predicted_up": (
                predicted_up
            ),

            "predicted_down_rate": round(
                (
                    predicted_down
                    / total
                )
                if total > 0
                else 0.0,
                4,
            ),

            "predicted_up_rate": round(
                (
                    predicted_up
                    / total
                )
                if total > 0
                else 0.0,
                4,
            ),
        }


    # ==================================================
    # MODEL STATUS
    # ==================================================

    @staticmethod
    def determine_model_status(
        test_accuracy: float,
        baseline_accuracy: float,
        test_roc_auc,
    ):

        if test_roc_auc is None:

            return (
                "INSUFFICIENT EVALUATION DATA"
            )


        accuracy_improvement = (
            test_accuracy
            - baseline_accuracy
        )


        if (
            accuracy_improvement > 0
            and test_roc_auc >= 0.55
        ):

            return (
                "PROMISING BASELINE"
            )


        if (
            accuracy_improvement > 0
            and test_roc_auc >= 0.50
        ):

            return (
                "WEAK POSITIVE SIGNAL"
            )


        if test_roc_auc < 0.50:

            return (
                "NO RELIABLE PREDICTIVE SIGNAL"
            )


        return (
            "DOES NOT BEAT BASELINE"
        )


    # ==================================================
    # TRAIN LOGISTIC REGRESSION
    # ==================================================

    @staticmethod
    def train(
        symbol: str,
        period: str = "5y",
        horizon: int = 5,
        threshold: float = 0.01,
    ):

        # ==============================================
        # GET LEAKAGE-SAFE SPLIT
        # ==============================================

        split = (
            PredictionSplitService
            .chronological_split(
                symbol=symbol,
                period=period,
                horizon=horizon,
                threshold=threshold,
            )
        )


        X_train = split[
            "X_train"
        ]


        X_validation = split[
            "X_validation"
        ]


        X_test = split[
            "X_test"
        ]


        y_train = split[
            "y_train"
        ]


        y_validation = split[
            "y_validation"
        ]


        y_test = split[
            "y_test"
        ]


        # ==============================================
        # CREATE MODEL
        # ==============================================

        model = LogisticRegression(
            max_iter=2000,
            random_state=42,
        )


        # ==============================================
        # TRAIN
        # ==============================================

        model.fit(
            X_train,
            y_train,
        )


        # ==============================================
        # VALIDATION PREDICTIONS
        # ==============================================

        validation_predictions = (
            model.predict(
                X_validation
            )
        )


        validation_probabilities = (
            model.predict_proba(
                X_validation
            )[:, 1]
        )


        # ==============================================
        # TEST PREDICTIONS
        # ==============================================

        test_predictions = (
            model.predict(
                X_test
            )
        )


        test_probabilities = (
            model.predict_proba(
                X_test
            )[:, 1]
        )


        # ==============================================
        # VALIDATION METRICS
        # ==============================================

        validation_metrics = (
            BaselineModelService
            .calculate_metrics(
                y_validation,
                validation_predictions,
                validation_probabilities,
            )
        )


        # ==============================================
        # TEST METRICS
        # ==============================================

        test_metrics = (
            BaselineModelService
            .calculate_metrics(
                y_test,
                test_predictions,
                test_probabilities,
            )
        )


        # ==============================================
        # VALIDATION BASELINE
        # ==============================================

        validation_baseline = (
            BaselineModelService
            .majority_baseline(
                y_train,
                y_validation,
            )
        )


        # ==============================================
        # TEST BASELINE
        # ==============================================

        test_baseline = (
            BaselineModelService
            .majority_baseline(
                y_train,
                y_test,
            )
        )


        # ==============================================
        # IMPROVEMENTS
        # ==============================================

        validation_improvement = (
            validation_metrics[
                "accuracy"
            ]
            -
            validation_baseline[
                "accuracy"
            ]
        )


        test_improvement = (
            test_metrics[
                "accuracy"
            ]
            -
            test_baseline[
                "accuracy"
            ]
        )


        # ==============================================
        # FEATURE COEFFICIENTS
        # ==============================================

        feature_columns = split[
            "feature_columns"
        ]


        coefficients = []


        for feature, coefficient in zip(
            feature_columns,
            model.coef_[0],
        ):

            coefficient_value = float(
                coefficient
            )


            coefficients.append(
                {
                    "feature": feature,

                    "coefficient": round(
                        coefficient_value,
                        6,
                    ),

                    "direction": (
                        "UP"
                        if coefficient_value > 0
                        else "DOWN"
                    ),

                    "absolute_importance": round(
                        abs(
                            coefficient_value
                        ),
                        6,
                    ),
                }
            )


        coefficients.sort(
            key=lambda item: (
                item[
                    "absolute_importance"
                ]
            ),
            reverse=True,
        )


        # ==============================================
        # PROBABILITY DIAGNOSTICS
        # ==============================================

        validation_probability_diagnostics = (
            BaselineModelService
            .probability_diagnostics(
                validation_probabilities
            )
        )


        test_probability_diagnostics = (
            BaselineModelService
            .probability_diagnostics(
                test_probabilities
            )
        )


        # ==============================================
        # PREDICTION DISTRIBUTIONS
        # ==============================================

        validation_prediction_distribution = (
            BaselineModelService
            .prediction_distribution(
                validation_predictions
            )
        )


        test_prediction_distribution = (
            BaselineModelService
            .prediction_distribution(
                test_predictions
            )
        )


        # ==============================================
        # MODEL STATUS
        # ==============================================

        model_status = (
            BaselineModelService
            .determine_model_status(
                test_accuracy=(
                    test_metrics[
                        "accuracy"
                    ]
                ),

                baseline_accuracy=(
                    test_baseline[
                        "accuracy"
                    ]
                ),

                test_roc_auc=(
                    test_metrics[
                        "roc_auc"
                    ]
                ),
            )
        )


        # ==============================================
        # RETURN RESULT
        # ==============================================

        return {
            "symbol": (
                symbol.upper()
            ),

            "model": (
                "Logistic Regression"
            ),

            "period": period,

            "prediction_horizon_days": (
                horizon
            ),

            "target_threshold": (
                threshold
            ),

            "model_status": (
                model_status
            ),

            "split_summary": split[
                "split_summary"
            ],

            "validation_baseline": (
                validation_baseline
            ),

            "test_baseline": (
                test_baseline
            ),

            "validation_metrics": (
                validation_metrics
            ),

            "test_metrics": (
                test_metrics
            ),

            "validation_accuracy_improvement": round(
                float(
                    validation_improvement
                ),
                4,
            ),

            "test_accuracy_improvement": round(
                float(
                    test_improvement
                ),
                4,
            ),

            "beats_validation_baseline": (
                validation_improvement > 0
            ),

            "beats_test_baseline": (
                test_improvement > 0
            ),

            "validation_probability_diagnostics": (
                validation_probability_diagnostics
            ),

            "test_probability_diagnostics": (
                test_probability_diagnostics
            ),

            "validation_prediction_distribution": (
                validation_prediction_distribution
            ),

            "test_prediction_distribution": (
                test_prediction_distribution
            ),

            "top_feature_coefficients": (
                coefficients[:10]
            ),

            "model_object": model,

            "scaler": split[
                "scaler"
            ],
        }