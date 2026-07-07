from sklearn.ensemble import (
    RandomForestClassifier,
    HistGradientBoostingClassifier,
)

from sklearn.linear_model import (
    LogisticRegression,
)

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


class ModelComparisonService:

    # ==================================================
    # METRICS
    # ==================================================

    @staticmethod
    def calculate_metrics(
        y_true,
        predictions,
        probabilities,
    ):

        return {
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

            "roc_auc": round(
                float(
                    roc_auc_score(
                        y_true,
                        probabilities,
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


    # ==================================================
    # CREATE MODELS
    # ==================================================

    @staticmethod
    def create_models():

        return {
            "Logistic Regression": (
                LogisticRegression(
                    max_iter=2000,
                    random_state=42,
                )
            ),

            "Random Forest": (
                RandomForestClassifier(
                    n_estimators=500,

                    max_depth=6,

                    min_samples_split=10,

                    min_samples_leaf=5,

                    max_features="sqrt",

                    class_weight="balanced",

                    random_state=42,

                    n_jobs=-1,
                )
            ),

            "HistGradientBoosting": (
                HistGradientBoostingClassifier(
                    learning_rate=0.05,

                    max_iter=300,

                    max_leaf_nodes=15,

                    min_samples_leaf=20,

                    l2_regularization=1.0,

                    random_state=42,
                )
            ),
        }


    # ==================================================
    # EVALUATE ONE MODEL
    # ==================================================

    @staticmethod
    def evaluate_model(
        name,
        model,
        X_train,
        y_train,
        X_validation,
        y_validation,
        X_test,
        y_test,
    ):

        model.fit(
            X_train,
            y_train,
        )


        # ----------------------------------------------
        # VALIDATION
        # ----------------------------------------------

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


        validation_metrics = (
            ModelComparisonService
            .calculate_metrics(
                y_validation,
                validation_predictions,
                validation_probabilities,
            )
        )


        # ----------------------------------------------
        # TEST
        # ----------------------------------------------

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


        test_metrics = (
            ModelComparisonService
            .calculate_metrics(
                y_test,
                test_predictions,
                test_probabilities,
            )
        )


        # ----------------------------------------------
        # STABILITY
        # ----------------------------------------------

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


        auc_gap = abs(
            validation_auc
            - test_auc
        )


        minimum_auc = min(
            validation_auc,
            test_auc,
        )


        average_auc = (
            validation_auc
            + test_auc
        ) / 2


        # Conservative model score.
        #
        # The weaker period matters most.

        stability_score = (
            minimum_auc * 0.60
            + average_auc * 0.30
            - auc_gap * 0.10
        )


        return {
            "model": name,

            "validation_metrics": (
                validation_metrics
            ),

            "test_metrics": (
                test_metrics
            ),

            "auc_gap": round(
                float(auc_gap),
                4,
            ),

            "minimum_auc": round(
                float(minimum_auc),
                4,
            ),

            "average_auc": round(
                float(average_auc),
                4,
            ),

            "stability_score": round(
                float(stability_score),
                4,
            ),

            "model_object": model,
        }


    # ==================================================
    # COMPARE MODELS
    # ==================================================

    @staticmethod
    def compare(
        symbol: str,
        period: str = "5y",
        horizon: int = 5,
        threshold: float = 0.02,
    ):

        split = (
            PredictionSplitService
            .chronological_split(
                symbol=symbol,
                period=period,
                horizon=horizon,
                threshold=threshold,
            )
        )


        models = (
            ModelComparisonService
            .create_models()
        )


        results = []


        for name, model in models.items():

            result = (
                ModelComparisonService
                .evaluate_model(
                    name=name,

                    model=model,

                    X_train=split[
                        "X_train"
                    ],

                    y_train=split[
                        "y_train"
                    ],

                    X_validation=split[
                        "X_validation"
                    ],

                    y_validation=split[
                        "y_validation"
                    ],

                    X_test=split[
                        "X_test"
                    ],

                    y_test=split[
                        "y_test"
                    ],
                )
            )


            results.append(
                result
            )


        # ==============================================
        # RANK MODELS
        # ==============================================

        results.sort(
            key=lambda item: (
                item[
                    "stability_score"
                ]
            ),
            reverse=True,
        )


        # ==============================================
        # CLEAN RESULT FOR SERIALIZATION
        # ==============================================

        ranked_results = []


        for index, result in enumerate(
            results,
            start=1,
        ):

            ranked_results.append(
                {
                    "rank": index,

                    "model": result[
                        "model"
                    ],

                    "validation_metrics": (
                        result[
                            "validation_metrics"
                        ]
                    ),

                    "test_metrics": (
                        result[
                            "test_metrics"
                        ]
                    ),

                    "auc_gap": result[
                        "auc_gap"
                    ],

                    "minimum_auc": result[
                        "minimum_auc"
                    ],

                    "average_auc": result[
                        "average_auc"
                    ],

                    "stability_score": (
                        result[
                            "stability_score"
                        ]
                    ),
                }
            )


        best_result = results[0]


        return {
            "symbol": symbol.upper(),

            "period": period,

            "prediction_horizon_days": (
                horizon
            ),

            "target_threshold": (
                threshold
            ),

            "best_model": (
                best_result[
                    "model"
                ]
            ),

            "best_stability_score": (
                best_result[
                    "stability_score"
                ]
            ),

            "split_summary": split[
                "split_summary"
            ],

            "ranked_models": (
                ranked_results
            ),

            "best_model_object": (
                best_result[
                    "model_object"
                ]
            ),

            "scaler": split[
                "scaler"
            ],

            "feature_columns": split[
                "feature_columns"
            ],
        }