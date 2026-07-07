import numpy as np
import pandas as pd

from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import HistGradientBoostingRegressor

from app.services.prediction_data_service import (
    PredictionDataService,
)

from app.services.regression_model_service import (
    RegressionModelService,
)


class RegressionWalkForwardService:

    # ==================================================
    # WALK-FORWARD VALIDATION
    # ==================================================

    @staticmethod
    def validate(
        symbol: str,
        period: str = "5y",
        horizon: int = 5,
        initial_train_rows: int = 500,
        test_rows: int = 100,
        step_rows: int = 100,
        actionable_threshold: float = 0.02,
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
                threshold=actionable_threshold,
            )
        )

        data = result[
            "data"
        ].copy()

        feature_columns = result[
            "feature_columns"
        ]

        total_rows = len(data)

        # ==============================================
        # VALIDATION
        # ==============================================

        if initial_train_rows <= horizon:

            raise ValueError(
                "initial_train_rows must be "
                "greater than horizon."
            )

        if test_rows <= 0:

            raise ValueError(
                "test_rows must be greater than 0."
            )

        if step_rows <= 0:

            raise ValueError(
                "step_rows must be greater than 0."
            )

        if (
            initial_train_rows
            + horizon
            + test_rows
            > total_rows
        ):

            raise ValueError(
                "Dataset is too small for the "
                "requested walk-forward configuration."
            )

        # ==============================================
        # STORAGE
        # ==============================================

        folds = []

        all_actual = []

        all_predictions = []

        fold_number = 1

        train_end = initial_train_rows

        # ==============================================
        # EXPANDING WINDOW LOOP
        # ==============================================

        while True:

            test_start = (
                train_end
                + horizon
            )

            test_end = min(
                test_start + test_rows,
                total_rows,
            )

            if test_start >= total_rows:
                break

            if (
                test_end
                - test_start
                < 20
            ):
                break

            # ==========================================
            # EXPANDING TRAIN WINDOW
            # ==========================================

            train_data = data.iloc[
                :train_end
            ].copy()

            test_data = data.iloc[
                test_start:test_end
            ].copy()

            # ==========================================
            # FEATURES
            # ==========================================

            X_train_raw = train_data[
                feature_columns
            ].copy()

            X_test_raw = test_data[
                feature_columns
            ].copy()

            y_train = train_data[
                "future_return"
            ].astype(float)

            y_test = test_data[
                "future_return"
            ].astype(float)

            # ==========================================
            # MODEL
            # ==========================================

            model = (
                HistGradientBoostingRegressor(
                    learning_rate=0.05,
                    max_iter=300,
                    max_leaf_nodes=15,
                    min_samples_leaf=20,
                    l2_regularization=1.0,
                    random_state=42,
                )
            )

            model.fit(
                X_train_raw,
                y_train,
            )

            predictions = model.predict(
                X_test_raw
            )

            # ==========================================
            # MODEL METRICS
            # ==========================================

            metrics = (
                RegressionModelService
                .calculate_metrics(
                    y_test,
                    predictions,
                    actionable_threshold,
                )
            )

            # ==========================================
            # HISTORICAL MEAN BASELINE
            # ==========================================

            historical_mean = float(
                y_train.mean()
            )

            baseline_predictions = np.full(
                len(y_test),
                historical_mean,
                dtype=float,
            )

            baseline_metrics = (
                RegressionModelService
                .calculate_metrics(
                    y_test,
                    baseline_predictions,
                    actionable_threshold,
                )
            )

            # ==========================================
            # IMPROVEMENTS
            # ==========================================

            mae_improvement = (
                baseline_metrics["mae"]
                - metrics["mae"]
            )

            directional_improvement = (
                metrics[
                    "directional_accuracy"
                ]
                -
                baseline_metrics[
                    "directional_accuracy"
                ]
            )

            # ==========================================
            # STORE GLOBAL PREDICTIONS
            # ==========================================

            all_actual.extend(
                y_test.tolist()
            )

            all_predictions.extend(
                predictions.tolist()
            )

            # ==========================================
            # STORE FOLD
            # ==========================================

            folds.append(
                {
                    "fold": fold_number,

                    "train_rows": int(
                        len(train_data)
                    ),

                    "test_rows": int(
                        len(test_data)
                    ),

                    "train_start": str(
                        train_data.index.min()
                    ),

                    "train_end": str(
                        train_data.index.max()
                    ),

                    "test_start": str(
                        test_data.index.min()
                    ),

                    "test_end": str(
                        test_data.index.max()
                    ),

                    "train_target_mean": round(
                        float(
                            y_train.mean()
                        ),
                        6,
                    ),

                    "test_target_mean": round(
                        float(
                            y_test.mean()
                        ),
                        6,
                    ),

                    "baseline": {
                        "mae": baseline_metrics[
                            "mae"
                        ],

                        "rmse": baseline_metrics[
                            "rmse"
                        ],

                        "directional_accuracy":
                            baseline_metrics[
                                "directional_accuracy"
                            ],
                    },

                    "metrics": metrics,

                    "mae_improvement": round(
                        float(
                            mae_improvement
                        ),
                        6,
                    ),

                    "directional_improvement": round(
                        float(
                            directional_improvement
                        ),
                        4,
                    ),

                    "beats_baseline_mae": bool(
                        mae_improvement > 0
                    ),

                    "beats_baseline_direction": bool(
                        directional_improvement > 0
                    ),
                }
            )

            fold_number += 1

            train_end += step_rows

        # ==============================================
        # REQUIRE FOLDS
        # ==============================================

        if len(folds) == 0:

            raise ValueError(
                "No walk-forward folds were created."
            )

        # ==============================================
        # AGGREGATE METRICS
        # ==============================================

        aggregate_metrics = (
            RegressionModelService
            .calculate_metrics(
                all_actual,
                all_predictions,
                actionable_threshold,
            )
        )

        fold_mae = [
            fold["metrics"]["mae"]
            for fold in folds
        ]

        fold_rmse = [
            fold["metrics"]["rmse"]
            for fold in folds
        ]

        fold_direction = [
            fold[
                "metrics"
            ][
                "directional_accuracy"
            ]
            for fold in folds
        ]

        fold_spearman = [
            fold[
                "metrics"
            ][
                "spearman_correlation"
            ]
            for fold in folds
        ]

        folds_beating_mae = sum(
            1
            for fold in folds
            if fold[
                "beats_baseline_mae"
            ]
        )

        folds_beating_direction = sum(
            1
            for fold in folds
            if fold[
                "beats_baseline_direction"
            ]
        )

        positive_spearman_folds = sum(
            1
            for value in fold_spearman
            if value > 0
        )

        # ==============================================
        # RELIABILITY STATUS
        # ==============================================

        fold_count = len(folds)

        mae_success_rate = (
            folds_beating_mae
            / fold_count
        )

        direction_success_rate = (
            folds_beating_direction
            / fold_count
        )

        spearman_success_rate = (
            positive_spearman_folds
            / fold_count
        )

        aggregate_spearman = (
            aggregate_metrics[
                "spearman_correlation"
            ]
        )

        aggregate_direction = (
            aggregate_metrics[
                "directional_accuracy"
            ]
        )

        if (
            mae_success_rate >= 0.70
            and
            direction_success_rate >= 0.60
            and
            spearman_success_rate >= 0.60
            and
            aggregate_spearman >= 0.10
            and
            aggregate_direction >= 0.55
        ):

            reliability_status = (
                "RELIABLE EXPERIMENTAL SIGNAL"
            )

        elif (
            spearman_success_rate >= 0.50
            and
            aggregate_spearman > 0
            and
            aggregate_direction >= 0.50
        ):

            reliability_status = (
                "WEAK EXPERIMENTAL SIGNAL"
            )

        else:

            reliability_status = (
                "NO STABLE PREDICTIVE SIGNAL"
            )

        # ==============================================
        # SUMMARY
        # ==============================================

        summary = {
            "fold_count": fold_count,

            "average_mae": round(
                float(
                    np.mean(fold_mae)
                ),
                6,
            ),

            "mae_std": round(
                float(
                    np.std(fold_mae)
                ),
                6,
            ),

            "average_rmse": round(
                float(
                    np.mean(fold_rmse)
                ),
                6,
            ),

            "rmse_std": round(
                float(
                    np.std(fold_rmse)
                ),
                6,
            ),

            "average_directional_accuracy": round(
                float(
                    np.mean(
                        fold_direction
                    )
                ),
                4,
            ),

            "directional_accuracy_std": round(
                float(
                    np.std(
                        fold_direction
                    )
                ),
                4,
            ),

            "average_spearman": round(
                float(
                    np.mean(
                        fold_spearman
                    )
                ),
                4,
            ),

            "spearman_std": round(
                float(
                    np.std(
                        fold_spearman
                    )
                ),
                4,
            ),

            "folds_beating_baseline_mae": (
                folds_beating_mae
            ),

            "folds_beating_baseline_direction": (
                folds_beating_direction
            ),

            "positive_spearman_folds": (
                positive_spearman_folds
            ),

            "mae_success_rate": round(
                float(
                    mae_success_rate
                ),
                4,
            ),

            "direction_success_rate": round(
                float(
                    direction_success_rate
                ),
                4,
            ),

            "spearman_success_rate": round(
                float(
                    spearman_success_rate
                ),
                4,
            ),

            "aggregate_metrics": (
                aggregate_metrics
            ),

            "reliability_status": (
                reliability_status
            ),
        }

        # ==============================================
        # RETURN
        # ==============================================

        return {
            "symbol": symbol.upper(),

            "model": (
                "HistGradientBoosting Regressor"
            ),

            "prediction_horizon_days": (
                horizon
            ),

            "validation_method": (
                "EXPANDING WINDOW WALK FORWARD"
            ),

            "summary": summary,

            "folds": folds,
        }