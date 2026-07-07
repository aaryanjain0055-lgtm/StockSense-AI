import numpy as np

from sklearn.ensemble import (
    HistGradientBoostingClassifier,
)

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
)

from sklearn.preprocessing import (
    StandardScaler,
)

from app.services.prediction_data_service import (
    PredictionDataService,
)


class WalkForwardService:

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


        if len(np.unique(y_true)) == 2:

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
    # CREATE MODEL
    # ==================================================

    @staticmethod
    def create_model():

        return (
            HistGradientBoostingClassifier(
                learning_rate=0.05,

                max_iter=300,

                max_leaf_nodes=15,

                min_samples_leaf=20,

                l2_regularization=1.0,

                random_state=42,
            )
        )


    # ==================================================
    # WALK-FORWARD VALIDATION
    # ==================================================

    @staticmethod
    def validate(
        symbol: str,

        period: str = "5y",

        horizon: int = 5,

        threshold: float = 0.02,

        initial_train_ratio: float = 0.50,

        test_window_size: int = 60,

        step_size: int = 60,
    ):

        # ==============================================
        # BUILD DATASET
        # ==============================================

        result = (
            PredictionDataService
            .build_dataset(
                symbol=symbol,
                period=period,
                horizon=horizon,
                threshold=threshold,
            )
        )


        data = result[
            "data"
        ].copy()


        feature_columns = result[
            "feature_columns"
        ]


        total_rows = len(
            data
        )


        initial_train_size = int(
            total_rows
            * initial_train_ratio
        )


        if initial_train_size <= horizon:

            raise ValueError(
                "Initial training window is too small."
            )


        if test_window_size <= 0:

            raise ValueError(
                "test_window_size must be greater than 0."
            )


        if step_size <= 0:

            raise ValueError(
                "step_size must be greater than 0."
            )


        # ==============================================
        # WALK-FORWARD WINDOWS
        # ==============================================

        fold_results = []


        train_end = (
            initial_train_size
        )


        fold_number = 1


        while (
            train_end
            + test_window_size
            <= total_rows
        ):

            # ------------------------------------------
            # EXPANDING TRAINING WINDOW
            # ------------------------------------------

            train_data = data.iloc[
                :train_end
            ].copy()


            test_data = data.iloc[
                train_end:
                train_end + test_window_size
            ].copy()


            # ------------------------------------------
            # PURGE TRAIN BOUNDARY
            #
            # Remove final training rows whose target
            # horizon could overlap the test period.
            # ------------------------------------------

            purged_train_data = (
                train_data.iloc[
                    :-horizon
                ].copy()
            )


            if purged_train_data.empty:

                raise ValueError(
                    "Training data became empty "
                    "after boundary purge."
                )


            # ------------------------------------------
            # FEATURES
            # ------------------------------------------

            X_train = (
                purged_train_data[
                    feature_columns
                ]
                .copy()
            )


            X_test = (
                test_data[
                    feature_columns
                ]
                .copy()
            )


            # ------------------------------------------
            # TARGETS
            # ------------------------------------------

            y_train = (
                purged_train_data[
                    "target_direction"
                ]
                .astype(int)
            )


            y_test = (
                test_data[
                    "target_direction"
                ]
                .astype(int)
            )


            # ------------------------------------------
            # CHECK TRAINING CLASSES
            # ------------------------------------------

            if y_train.nunique() < 2:

                train_end += (
                    step_size
                )

                fold_number += 1

                continue


            # ------------------------------------------
            # SCALE PER FOLD
            #
            # Fit scaler only on that fold's
            # historical training period.
            # ------------------------------------------

            scaler = (
                StandardScaler()
            )


            X_train_scaled = (
                scaler.fit_transform(
                    X_train
                )
            )


            X_test_scaled = (
                scaler.transform(
                    X_test
                )
            )


            # ------------------------------------------
            # TRAIN NEW MODEL FOR THIS FOLD
            # ------------------------------------------

            model = (
                WalkForwardService
                .create_model()
            )


            model.fit(
                X_train_scaled,
                y_train,
            )


            # ------------------------------------------
            # PREDICTIONS
            # ------------------------------------------

            predictions = (
                model.predict(
                    X_test_scaled
                )
            )


            probabilities = (
                model.predict_proba(
                    X_test_scaled
                )[:, 1]
            )


            # ------------------------------------------
            # METRICS
            # ------------------------------------------

            metrics = (
                WalkForwardService
                .calculate_metrics(
                    y_test,
                    predictions,
                    probabilities,
                )
            )


            # ------------------------------------------
            # BASELINE
            # ------------------------------------------

            majority_class = int(
                y_train
                .value_counts()
                .idxmax()
            )


            baseline_predictions = (
                np.full(
                    len(y_test),
                    majority_class,
                )
            )


            baseline_accuracy = round(
                float(
                    accuracy_score(
                        y_test,
                        baseline_predictions,
                    )
                ),
                4,
            )


            accuracy_improvement = round(
                metrics["accuracy"]
                - baseline_accuracy,
                4,
            )


            # ------------------------------------------
            # STORE FOLD
            # ------------------------------------------

            fold_results.append(
                {
                    "fold": fold_number,

                    "train_rows": int(
                        len(X_train)
                    ),

                    "test_rows": int(
                        len(X_test)
                    ),

                    "train_start": str(
                        purged_train_data
                        .index
                        .min()
                    ),

                    "train_end": str(
                        purged_train_data
                        .index
                        .max()
                    ),

                    "test_start": str(
                        test_data
                        .index
                        .min()
                    ),

                    "test_end": str(
                        test_data
                        .index
                        .max()
                    ),

                    "test_positive_rate": round(
                        float(
                            y_test.mean()
                        ),
                        4,
                    ),

                    "baseline_accuracy": (
                        baseline_accuracy
                    ),

                    "accuracy_improvement": (
                        accuracy_improvement
                    ),

                    "metrics": metrics,
                }
            )


            # ------------------------------------------
            # MOVE FORWARD
            # ------------------------------------------

            train_end += (
                step_size
            )


            fold_number += 1


        # ==============================================
        # VALIDATE FOLDS
        # ==============================================

        if not fold_results:

            raise ValueError(
                "No walk-forward folds were created."
            )


        # ==============================================
        # AGGREGATE RESULTS
        # ==============================================

        accuracies = [
            fold["metrics"]["accuracy"]
            for fold in fold_results
        ]


        auc_values = [
            fold["metrics"]["roc_auc"]
            for fold in fold_results
            if fold["metrics"]["roc_auc"]
            is not None
        ]


        improvements = [
            fold["accuracy_improvement"]
            for fold in fold_results
        ]


        positive_accuracy_folds = sum(
            1
            for value in improvements
            if value > 0
        )


        non_negative_accuracy_folds = sum(
            1
            for value in improvements
            if value >= 0
        )


        auc_above_random_folds = sum(
            1
            for value in auc_values
            if value > 0.50
        )


        average_accuracy = round(
            float(
                np.mean(
                    accuracies
                )
            ),
            4,
        )


        accuracy_std = round(
            float(
                np.std(
                    accuracies
                )
            ),
            4,
        )


        average_auc = (
            round(
                float(
                    np.mean(
                        auc_values
                    )
                ),
                4,
            )
            if auc_values
            else None
        )


        auc_std = (
            round(
                float(
                    np.std(
                        auc_values
                    )
                ),
                4,
            )
            if auc_values
            else None
        )


        average_improvement = round(
            float(
                np.mean(
                    improvements
                )
            ),
            4,
        )


        # ==============================================
        # RELIABILITY STATUS
        # ==============================================

        fold_count = len(
            fold_results
        )


        positive_fold_rate = (
            positive_accuracy_folds
            / fold_count
        )


        auc_success_rate = (
            auc_above_random_folds
            / len(auc_values)
            if auc_values
            else 0.0
        )


        if (
            average_auc is not None
            and average_auc >= 0.55
            and positive_fold_rate >= 0.60
            and auc_success_rate >= 0.60
        ):

            reliability_status = (
                "PROMISING ACROSS REGIMES"
            )


        elif (
            average_auc is not None
            and average_auc >= 0.50
            and positive_fold_rate >= 0.50
        ):

            reliability_status = (
                "WEAK BUT REPEATABLE SIGNAL"
            )


        else:

            reliability_status = (
                "UNSTABLE OR INSUFFICIENT SIGNAL"
            )


        # ==============================================
        # RETURN
        # ==============================================

        return {
            "symbol": (
                symbol.upper()
            ),

            "model": (
                "HistGradientBoosting"
            ),

            "period": period,

            "prediction_horizon_days": (
                horizon
            ),

            "target_threshold": (
                threshold
            ),

            "walk_forward_config": {
                "initial_train_ratio": (
                    initial_train_ratio
                ),

                "test_window_size": (
                    test_window_size
                ),

                "step_size": (
                    step_size
                ),

                "expanding_window": True,

                "purge_horizon_rows": (
                    horizon
                ),
            },

            "summary": {
                "fold_count": (
                    fold_count
                ),

                "average_accuracy": (
                    average_accuracy
                ),

                "accuracy_std": (
                    accuracy_std
                ),

                "average_auc": (
                    average_auc
                ),

                "auc_std": (
                    auc_std
                ),

                "average_accuracy_improvement": (
                    average_improvement
                ),

                "folds_beating_baseline": (
                    positive_accuracy_folds
                ),

                "folds_matching_or_beating_baseline": (
                    non_negative_accuracy_folds
                ),

                "folds_auc_above_0_5": (
                    auc_above_random_folds
                ),

                "positive_fold_rate": round(
                    positive_fold_rate,
                    4,
                ),

                "auc_success_rate": round(
                    auc_success_rate,
                    4,
                ),

                "reliability_status": (
                    reliability_status
                ),
            },

            "folds": (
                fold_results
            ),
        }