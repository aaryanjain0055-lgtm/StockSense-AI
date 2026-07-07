import numpy as np

from sklearn.linear_model import (
    LogisticRegression,
)

from sklearn.ensemble import (
    RandomForestClassifier,
    HistGradientBoostingClassifier,
)

from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    precision_recall_fscore_support,
    f1_score,
    confusion_matrix,
    classification_report,
)

from app.services.prediction_split_service import (
    PredictionSplitService,
)


class MulticlassModelService:

    # ==================================================
    # CLASS INFORMATION
    # ==================================================

    CLASS_LABELS = {
        0: "DOWN",
        1: "NEUTRAL",
        2: "UP",
    }


    # ==================================================
    # CALCULATE METRICS
    # ==================================================

    @staticmethod
    def calculate_metrics(
        y_true,
        predictions,
    ):

        accuracy = accuracy_score(
            y_true,
            predictions,
        )


        balanced_accuracy = (
            balanced_accuracy_score(
                y_true,
                predictions,
            )
        )


        macro_f1 = f1_score(
            y_true,
            predictions,
            average="macro",
            zero_division=0,
        )


        weighted_f1 = f1_score(
            y_true,
            predictions,
            average="weighted",
            zero_division=0,
        )


        precision, recall, f1, support = (
            precision_recall_fscore_support(
                y_true,
                predictions,
                labels=[0, 1, 2],
                zero_division=0,
            )
        )


        per_class = {}


        for index, class_id in enumerate(
            [0, 1, 2]
        ):

            class_name = (
                MulticlassModelService
                .CLASS_LABELS[
                    class_id
                ]
            )


            per_class[
                class_name
            ] = {
                "precision": round(
                    float(
                        precision[index]
                    ),
                    4,
                ),

                "recall": round(
                    float(
                        recall[index]
                    ),
                    4,
                ),

                "f1_score": round(
                    float(
                        f1[index]
                    ),
                    4,
                ),

                "support": int(
                    support[index]
                ),
            }


        matrix = confusion_matrix(
            y_true,
            predictions,
            labels=[0, 1, 2],
        )


        prediction_counts = {
            "DOWN": int(
                (
                    np.asarray(
                        predictions
                    )
                    == 0
                ).sum()
            ),

            "NEUTRAL": int(
                (
                    np.asarray(
                        predictions
                    )
                    == 1
                ).sum()
            ),

            "UP": int(
                (
                    np.asarray(
                        predictions
                    )
                    == 2
                ).sum()
            ),
        }


        return {
            "accuracy": round(
                float(accuracy),
                4,
            ),

            "balanced_accuracy": round(
                float(
                    balanced_accuracy
                ),
                4,
            ),

            "macro_f1": round(
                float(macro_f1),
                4,
            ),

            "weighted_f1": round(
                float(weighted_f1),
                4,
            ),

            "per_class": (
                per_class
            ),

            "prediction_counts": (
                prediction_counts
            ),

            "confusion_matrix": (
                matrix.tolist()
            ),
        }


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


        predictions = np.full(
            len(y_evaluation),
            majority_class,
        )


        metrics = (
            MulticlassModelService
            .calculate_metrics(
                y_evaluation,
                predictions,
            )
        )


        return {
            "majority_class": (
                majority_class
            ),

            "majority_label": (
                MulticlassModelService
                .CLASS_LABELS[
                    majority_class
                ]
            ),

            **metrics,
        }


    # ==================================================
    # CREATE MODELS
    # ==================================================

    @staticmethod
    def create_models():

        return {

            "Logistic Regression": (
                LogisticRegression(
                    max_iter=3000,
                    class_weight="balanced",
                    random_state=42,
                )
            ),


            "Random Forest": (
                RandomForestClassifier(
                    n_estimators=500,

                    max_depth=8,

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
    # TRAIN AND COMPARE
    # ==================================================

    @staticmethod
    def compare(
        symbol: str,
        period: str = "5y",
        horizon: int = 5,
        threshold: float = 0.02,
    ):

        # ==============================================
        # SPLIT DATA
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
        # BASELINES
        # ==============================================

        validation_baseline = (
            MulticlassModelService
            .majority_baseline(
                y_train,
                y_validation,
            )
        )


        test_baseline = (
            MulticlassModelService
            .majority_baseline(
                y_train,
                y_test,
            )
        )


        # ==============================================
        # MODELS
        # ==============================================

        models = (
            MulticlassModelService
            .create_models()
        )


        results = []


        for model_name, model in (
            models.items()
        ):

            # ==========================================
            # SELECT INPUT FORMAT
            #
            # Logistic Regression benefits from scaled
            # features.
            #
            # Tree models use raw feature values.
            # ==========================================

            if (
                model_name
                == "Logistic Regression"
            ):

                X_train = split[
                    "X_train"
                ]

                X_validation = split[
                    "X_validation"
                ]

                X_test = split[
                    "X_test"
                ]

            else:

                X_train = split[
                    "X_train_raw"
                ]

                X_validation = split[
                    "X_validation_raw"
                ]

                X_test = split[
                    "X_test_raw"
                ]


            # ==========================================
            # TRAIN
            # ==========================================

            model.fit(
                X_train,
                y_train,
            )


            # ==========================================
            # VALIDATION
            # ==========================================

            validation_predictions = (
                model.predict(
                    X_validation
                )
            )


            validation_metrics = (
                MulticlassModelService
                .calculate_metrics(
                    y_validation,
                    validation_predictions,
                )
            )


            # ==========================================
            # TEST
            # ==========================================

            test_predictions = (
                model.predict(
                    X_test
                )
            )


            test_metrics = (
                MulticlassModelService
                .calculate_metrics(
                    y_test,
                    test_predictions,
                )
            )


            # ==========================================
            # GENERALIZATION GAPS
            # ==========================================

            macro_f1_gap = abs(
                validation_metrics[
                    "macro_f1"
                ]
                -
                test_metrics[
                    "macro_f1"
                ]
            )


            balanced_accuracy_gap = abs(
                validation_metrics[
                    "balanced_accuracy"
                ]
                -
                test_metrics[
                    "balanced_accuracy"
                ]
            )


            # ==========================================
            # CONSERVATIVE MODEL SCORE
            #
            # Reward:
            # - strong minimum macro F1
            # - strong minimum balanced accuracy
            #
            # Penalize:
            # - unstable validation/test behavior
            # ==========================================

            minimum_macro_f1 = min(
                validation_metrics[
                    "macro_f1"
                ],
                test_metrics[
                    "macro_f1"
                ],
            )


            minimum_balanced_accuracy = min(
                validation_metrics[
                    "balanced_accuracy"
                ],
                test_metrics[
                    "balanced_accuracy"
                ],
            )


            average_macro_f1 = (
                validation_metrics[
                    "macro_f1"
                ]
                +
                test_metrics[
                    "macro_f1"
                ]
            ) / 2


            stability_score = (
                (
                    minimum_macro_f1
                    * 0.40
                )
                +
                (
                    minimum_balanced_accuracy
                    * 0.30
                )
                +
                (
                    average_macro_f1
                    * 0.20
                )
                -
                (
                    macro_f1_gap
                    * 0.05
                )
                -
                (
                    balanced_accuracy_gap
                    * 0.05
                )
            )


            results.append(
                {
                    "model": (
                        model_name
                    ),

                    "validation_metrics": (
                        validation_metrics
                    ),

                    "test_metrics": (
                        test_metrics
                    ),

                    "macro_f1_gap": round(
                        float(
                            macro_f1_gap
                        ),
                        4,
                    ),

                    "balanced_accuracy_gap": round(
                        float(
                            balanced_accuracy_gap
                        ),
                        4,
                    ),

                    "minimum_macro_f1": round(
                        float(
                            minimum_macro_f1
                        ),
                        4,
                    ),

                    "minimum_balanced_accuracy": round(
                        float(
                            minimum_balanced_accuracy
                        ),
                        4,
                    ),

                    "stability_score": round(
                        float(
                            stability_score
                        ),
                        4,
                    ),
                }
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


        for rank, item in enumerate(
            results,
            start=1,
        ):

            item["rank"] = rank


        # ==============================================
        # RETURN
        # ==============================================

        return {
            "symbol": (
                symbol.upper()
            ),

            "prediction_horizon_days": (
                horizon
            ),

            "target_threshold": (
                threshold
            ),

            "target_type": (
                "MULTICLASS"
            ),

            "class_labels": (
                MulticlassModelService
                .CLASS_LABELS
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

            "best_model": (
                results[0]["model"]
            ),

            "model_rankings": (
                results
            ),
        }