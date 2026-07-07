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
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
)

from app.services.prediction_split_service import (
    PredictionSplitService,
)


class TwoStageModelService:

    # ==================================================
    # BINARY METRICS
    # ==================================================

    @staticmethod
    def binary_metrics(
        y_true,
        predictions,
        probabilities=None,
    ):

        result = {
            "accuracy": round(
                float(
                    accuracy_score(
                        y_true,
                        predictions,
                    )
                ),
                4,
            ),

            "balanced_accuracy": round(
                float(
                    balanced_accuracy_score(
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


        if (
            probabilities is not None
            and len(
                np.unique(
                    y_true
                )
            ) == 2
        ):

            result["roc_auc"] = round(
                float(
                    roc_auc_score(
                        y_true,
                        probabilities,
                    )
                ),
                4,
            )

        else:

            result["roc_auc"] = None


        return result


    # ==================================================
    # CREATE MODEL SET
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
    # SELECT FEATURES
    # ==================================================

    @staticmethod
    def select_features(
        split,
        model_name,
    ):

        if (
            model_name
            == "Logistic Regression"
        ):

            return {
                "train": split[
                    "X_train"
                ],

                "validation": split[
                    "X_validation"
                ],

                "test": split[
                    "X_test"
                ],
            }


        return {
            "train": split[
                "X_train_raw"
            ],

            "validation": split[
                "X_validation_raw"
            ],

            "test": split[
                "X_test_raw"
            ],
        }


    # ==================================================
    # TRAIN STAGE
    # ==================================================

    @staticmethod
    def evaluate_model_set(
        split,
        y_train,
        y_validation,
        y_test,
    ):

        results = []


        models = (
            TwoStageModelService
            .create_models()
        )


        for model_name, model in (
            models.items()
        ):

            features = (
                TwoStageModelService
                .select_features(
                    split,
                    model_name,
                )
            )


            model.fit(
                features["train"],
                y_train,
            )


            validation_predictions = (
                model.predict(
                    features[
                        "validation"
                    ]
                )
            )


            validation_probabilities = (
                model.predict_proba(
                    features[
                        "validation"
                    ]
                )[:, 1]
            )


            test_predictions = (
                model.predict(
                    features[
                        "test"
                    ]
                )
            )


            test_probabilities = (
                model.predict_proba(
                    features[
                        "test"
                    ]
                )[:, 1]
            )


            validation_metrics = (
                TwoStageModelService
                .binary_metrics(
                    y_validation,
                    validation_predictions,
                    validation_probabilities,
                )
            )


            test_metrics = (
                TwoStageModelService
                .binary_metrics(
                    y_test,
                    test_predictions,
                    test_probabilities,
                )
            )


            minimum_auc = min(
                validation_metrics[
                    "roc_auc"
                ],
                test_metrics[
                    "roc_auc"
                ],
            )


            average_auc = (
                validation_metrics[
                    "roc_auc"
                ]
                +
                test_metrics[
                    "roc_auc"
                ]
            ) / 2


            auc_gap = abs(
                validation_metrics[
                    "roc_auc"
                ]
                -
                test_metrics[
                    "roc_auc"
                ]
            )


            minimum_balanced_accuracy = min(
                validation_metrics[
                    "balanced_accuracy"
                ],
                test_metrics[
                    "balanced_accuracy"
                ],
            )


            score = (
                minimum_auc * 0.40
                +
                average_auc * 0.25
                +
                minimum_balanced_accuracy
                * 0.25
                -
                auc_gap * 0.10
            )


            results.append(
                {
                    "model": model_name,

                    "validation_metrics": (
                        validation_metrics
                    ),

                    "test_metrics": (
                        test_metrics
                    ),

                    "minimum_auc": round(
                        float(
                            minimum_auc
                        ),
                        4,
                    ),

                    "average_auc": round(
                        float(
                            average_auc
                        ),
                        4,
                    ),

                    "auc_gap": round(
                        float(
                            auc_gap
                        ),
                        4,
                    ),

                    "stage_score": round(
                        float(score),
                        4,
                    ),
                }
            )


        results.sort(
            key=lambda item: (
                item[
                    "stage_score"
                ]
            ),
            reverse=True,
        )


        for rank, item in enumerate(
            results,
            start=1,
        ):

            item["rank"] = rank


        return results


    # ==================================================
    # COMPLETE TWO-STAGE EXPERIMENT
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


        original_y_train = split[
            "y_train"
        ]


        original_y_validation = split[
            "y_validation"
        ]


        original_y_test = split[
            "y_test"
        ]


        # ==================================================
        # STAGE 1 TARGET
        #
        # 0 = NEUTRAL
        # 1 = ACTIONABLE
        #
        # Original:
        # 0 DOWN     -> ACTIONABLE
        # 1 NEUTRAL  -> NEUTRAL
        # 2 UP       -> ACTIONABLE
        # ==================================================

        stage1_y_train = (
            original_y_train
            != 1
        ).astype(int)


        stage1_y_validation = (
            original_y_validation
            != 1
        ).astype(int)


        stage1_y_test = (
            original_y_test
            != 1
        ).astype(int)


        stage1_results = (
            TwoStageModelService
            .evaluate_model_set(
                split=split,
                y_train=stage1_y_train,
                y_validation=(
                    stage1_y_validation
                ),
                y_test=stage1_y_test,
            )
        )


        # ==================================================
        # STAGE 2
        #
        # Use only ACTIONABLE rows.
        #
        # Original:
        # 0 DOWN -> 0
        # 2 UP   -> 1
        # ==================================================

        train_actionable_mask = (
            original_y_train
            != 1
        )


        validation_actionable_mask = (
            original_y_validation
            != 1
        )


        test_actionable_mask = (
            original_y_test
            != 1
        )


        stage2_split = {}


        for key in [
            "X_train",
            "X_validation",
            "X_test",
            "X_train_raw",
            "X_validation_raw",
            "X_test_raw",
        ]:

            if "train" in key:

                stage2_split[key] = (
                    split[key].loc[
                        train_actionable_mask
                    ]
                )


            elif "validation" in key:

                stage2_split[key] = (
                    split[key].loc[
                        validation_actionable_mask
                    ]
                )


            elif "test" in key:

                stage2_split[key] = (
                    split[key].loc[
                        test_actionable_mask
                    ]
                )


        stage2_y_train = (
            original_y_train.loc[
                train_actionable_mask
            ]
            == 2
        ).astype(int)


        stage2_y_validation = (
            original_y_validation.loc[
                validation_actionable_mask
            ]
            == 2
        ).astype(int)


        stage2_y_test = (
            original_y_test.loc[
                test_actionable_mask
            ]
            == 2
        ).astype(int)


        stage2_results = (
            TwoStageModelService
            .evaluate_model_set(
                split=stage2_split,
                y_train=stage2_y_train,
                y_validation=(
                    stage2_y_validation
                ),
                y_test=stage2_y_test,
            )
        )


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

            "architecture": {
                "stage_1": (
                    "NEUTRAL vs ACTIONABLE"
                ),

                "stage_2": (
                    "DOWN vs UP"
                ),
            },

            "stage_1": {
                "best_model": (
                    stage1_results[
                        0
                    ]["model"]
                ),

                "rankings": (
                    stage1_results
                ),
            },

            "stage_2": {
                "best_model": (
                    stage2_results[
                        0
                    ]["model"]
                ),

                "rankings": (
                    stage2_results
                ),

                "train_actionable_rows": int(
                    train_actionable_mask.sum()
                ),

                "validation_actionable_rows": int(
                    validation_actionable_mask.sum()
                ),

                "test_actionable_rows": int(
                    test_actionable_mask.sum()
                ),
            },
        }