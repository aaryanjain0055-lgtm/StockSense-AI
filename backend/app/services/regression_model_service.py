import numpy as np

from scipy.stats import (
    pearsonr,
    spearmanr,
)

from sklearn.linear_model import Ridge

from sklearn.ensemble import (
    RandomForestRegressor,
    HistGradientBoostingRegressor,
)

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)

from app.services.regression_split_service import (
    RegressionSplitService,
)


class RegressionModelService:

    # ==================================================
    # SAFE ARRAY CONVERSION
    # ==================================================

    @staticmethod
    def to_numpy(values):

        return np.asarray(
            values,
            dtype=float,
        )


    # ==================================================
    # CONSTANT ARRAY CHECK
    # ==================================================

    @staticmethod
    def is_constant(values):

        array = RegressionModelService.to_numpy(
            values
        )

        if len(array) == 0:
            return True

        return bool(
            np.isclose(
                np.std(array),
                0.0,
                atol=1e-12,
            )
        )


    # ==================================================
    # SAFE PEARSON CORRELATION
    # ==================================================

    @staticmethod
    def safe_pearson(
        y_true,
        predictions,
    ):

        y_true_array = (
            RegressionModelService
            .to_numpy(
                y_true
            )
        )

        prediction_array = (
            RegressionModelService
            .to_numpy(
                predictions
            )
        )


        if len(y_true_array) < 2:
            return 0.0


        if len(prediction_array) < 2:
            return 0.0


        if (
            RegressionModelService
            .is_constant(
                y_true_array
            )
            or
            RegressionModelService
            .is_constant(
                prediction_array
            )
        ):
            return 0.0


        try:

            result = pearsonr(
                y_true_array,
                prediction_array,
            )


            statistic = float(
                result.statistic
            )


            if not np.isfinite(
                statistic
            ):
                return 0.0


            return round(
                statistic,
                4,
            )


        except Exception:

            return 0.0


    # ==================================================
    # SAFE SPEARMAN CORRELATION
    # ==================================================

    @staticmethod
    def safe_spearman(
        y_true,
        predictions,
    ):

        y_true_array = (
            RegressionModelService
            .to_numpy(
                y_true
            )
        )

        prediction_array = (
            RegressionModelService
            .to_numpy(
                predictions
            )
        )


        if len(y_true_array) < 2:
            return 0.0


        if len(prediction_array) < 2:
            return 0.0


        if (
            RegressionModelService
            .is_constant(
                y_true_array
            )
            or
            RegressionModelService
            .is_constant(
                prediction_array
            )
        ):
            return 0.0


        try:

            result = spearmanr(
                y_true_array,
                prediction_array,
            )


            statistic = float(
                result.statistic
            )


            if not np.isfinite(
                statistic
            ):
                return 0.0


            return round(
                statistic,
                4,
            )


        except Exception:

            return 0.0


    # ==================================================
    # DIRECTIONAL ACCURACY
    # ==================================================

    @staticmethod
    def directional_accuracy(
        y_true,
        predictions,
    ):

        actual = (
            RegressionModelService
            .to_numpy(
                y_true
            )
        )


        predicted = (
            RegressionModelService
            .to_numpy(
                predictions
            )
        )


        if len(actual) == 0:
            return 0.0


        actual_direction = (
            actual > 0
        ).astype(int)


        predicted_direction = (
            predicted > 0
        ).astype(int)


        accuracy = np.mean(
            actual_direction
            == predicted_direction
        )


        return round(
            float(accuracy),
            4,
        )


    # ==================================================
    # ACTIONABLE DIRECTIONAL ACCURACY
    # ==================================================

    @staticmethod
    def actionable_directional_accuracy(
        y_true,
        predictions,
        threshold: float = 0.02,
    ):

        actual = (
            RegressionModelService
            .to_numpy(
                y_true
            )
        )


        predicted = (
            RegressionModelService
            .to_numpy(
                predictions
            )
        )


        actionable_mask = (
            np.abs(actual)
            >= threshold
        )


        actionable_count = int(
            actionable_mask.sum()
        )


        if actionable_count == 0:

            return {
                "accuracy": 0.0,
                "count": 0,
            }


        actual_direction = (
            actual[actionable_mask]
            > 0
        ).astype(int)


        predicted_direction = (
            predicted[actionable_mask]
            > 0
        ).astype(int)


        accuracy = np.mean(
            actual_direction
            == predicted_direction
        )


        return {
            "accuracy": round(
                float(accuracy),
                4,
            ),

            "count": actionable_count,
        }


    # ==================================================
    # REGRESSION METRICS
    # ==================================================

    @staticmethod
    def calculate_metrics(
        y_true,
        predictions,
        actionable_threshold: float = 0.02,
    ):

        actual = (
            RegressionModelService
            .to_numpy(
                y_true
            )
        )


        predicted = (
            RegressionModelService
            .to_numpy(
                predictions
            )
        )


        mae = mean_absolute_error(
            actual,
            predicted,
        )


        rmse = np.sqrt(
            mean_squared_error(
                actual,
                predicted,
            )
        )


        r2 = r2_score(
            actual,
            predicted,
        )


        directional_accuracy = (
            RegressionModelService
            .directional_accuracy(
                actual,
                predicted,
            )
        )


        actionable_result = (
            RegressionModelService
            .actionable_directional_accuracy(
                actual,
                predicted,
                threshold=(
                    actionable_threshold
                ),
            )
        )


        pearson = (
            RegressionModelService
            .safe_pearson(
                actual,
                predicted,
            )
        )


        spearman = (
            RegressionModelService
            .safe_spearman(
                actual,
                predicted,
            )
        )


        prediction_summary = {

            "mean": round(
                float(
                    predicted.mean()
                ),
                6,
            ),

            "std": round(
                float(
                    predicted.std()
                ),
                6,
            ),

            "minimum": round(
                float(
                    predicted.min()
                ),
                6,
            ),

            "maximum": round(
                float(
                    predicted.max()
                ),
                6,
            ),

            "positive_prediction_rate": round(
                float(
                    (
                        predicted > 0
                    ).mean()
                ),
                4,
            ),

            "negative_prediction_rate": round(
                float(
                    (
                        predicted < 0
                    ).mean()
                ),
                4,
            ),
        }


        return {

            "mae": round(
                float(mae),
                6,
            ),

            "rmse": round(
                float(rmse),
                6,
            ),

            "r2": round(
                float(r2),
                4,
            ),

            "directional_accuracy": (
                directional_accuracy
            ),

            "actionable_directional_accuracy": (
                actionable_result[
                    "accuracy"
                ]
            ),

            "actionable_count": (
                actionable_result[
                    "count"
                ]
            ),

            "pearson_correlation": (
                pearson
            ),

            "spearman_correlation": (
                spearman
            ),

            "prediction_summary": (
                prediction_summary
            ),
        }


    # ==================================================
    # BASELINES
    # ==================================================

    @staticmethod
    def calculate_baselines(
        y_train,
        y_evaluation,
        actionable_threshold: float = 0.02,
    ):

        evaluation_count = len(
            y_evaluation
        )


        # ==============================================
        # ZERO RETURN BASELINE
        # ==============================================

        zero_predictions = np.zeros(
            evaluation_count,
            dtype=float,
        )


        zero_metrics = (
            RegressionModelService
            .calculate_metrics(
                y_evaluation,
                zero_predictions,
                actionable_threshold,
            )
        )


        # ==============================================
        # HISTORICAL MEAN BASELINE
        # ==============================================

        historical_mean = float(
            y_train.mean()
        )


        mean_predictions = np.full(
            evaluation_count,
            historical_mean,
            dtype=float,
        )


        mean_metrics = (
            RegressionModelService
            .calculate_metrics(
                y_evaluation,
                mean_predictions,
                actionable_threshold,
            )
        )


        return {

            "zero_return": {

                "prediction_value": 0.0,

                **zero_metrics,
            },


            "historical_mean": {

                "prediction_value": round(
                    historical_mean,
                    6,
                ),

                **mean_metrics,
            },
        }


    # ==================================================
    # CREATE MODELS
    # ==================================================

    @staticmethod
    def create_models():

        return {

            "Ridge Regression": Ridge(
                alpha=10.0,
            ),


            "Random Forest Regressor": (
                RandomForestRegressor(

                    n_estimators=500,

                    max_depth=8,

                    min_samples_split=10,

                    min_samples_leaf=5,

                    max_features="sqrt",

                    random_state=42,

                    n_jobs=-1,
                )
            ),


            "HistGradientBoosting Regressor": (
                HistGradientBoostingRegressor(

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
    # SELECT FEATURE FORMAT
    # ==================================================

    @staticmethod
    def select_features(
        split,
        model_name,
    ):

        if model_name == "Ridge Regression":

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
    # STABILITY SCORE
    # ==================================================

    @staticmethod
    def calculate_stability_score(
        validation_metrics,
        test_metrics,
    ):

        validation_spearman = (
            validation_metrics[
                "spearman_correlation"
            ]
        )


        test_spearman = (
            test_metrics[
                "spearman_correlation"
            ]
        )


        validation_direction = (
            validation_metrics[
                "directional_accuracy"
            ]
        )


        test_direction = (
            test_metrics[
                "directional_accuracy"
            ]
        )


        minimum_spearman = min(
            validation_spearman,
            test_spearman,
        )


        average_spearman = (
            validation_spearman
            + test_spearman
        ) / 2


        correlation_gap = abs(
            validation_spearman
            - test_spearman
        )


        minimum_directional_accuracy = min(
            validation_direction,
            test_direction,
        )


        direction_gap = abs(
            validation_direction
            - test_direction
        )


        score = (

            minimum_spearman
            * 0.35

            +

            average_spearman
            * 0.20

            +

            minimum_directional_accuracy
            * 0.30

            -

            correlation_gap
            * 0.10

            -

            direction_gap
            * 0.05
        )


        return {

            "minimum_spearman": round(
                float(
                    minimum_spearman
                ),
                4,
            ),

            "average_spearman": round(
                float(
                    average_spearman
                ),
                4,
            ),

            "correlation_gap": round(
                float(
                    correlation_gap
                ),
                4,
            ),

            "minimum_directional_accuracy": round(
                float(
                    minimum_directional_accuracy
                ),
                4,
            ),

            "direction_gap": round(
                float(
                    direction_gap
                ),
                4,
            ),

            "stability_score": round(
                float(score),
                4,
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
        actionable_threshold: float = 0.02,
    ):

        split = (
            RegressionSplitService
            .chronological_split(

                symbol=symbol,

                period=period,

                horizon=horizon,
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

        validation_baselines = (
            RegressionModelService
            .calculate_baselines(

                y_train,

                y_validation,

                actionable_threshold,
            )
        )


        test_baselines = (
            RegressionModelService
            .calculate_baselines(

                y_train,

                y_test,

                actionable_threshold,
            )
        )


        # ==============================================
        # MODELS
        # ==============================================

        models = (
            RegressionModelService
            .create_models()
        )


        results = []


        for model_name, model in (
            models.items()
        ):


            features = (
                RegressionModelService
                .select_features(

                    split,

                    model_name,
                )
            )


            # ==========================================
            # TRAIN
            # ==========================================

            model.fit(

                features[
                    "train"
                ],

                y_train,
            )


            # ==========================================
            # VALIDATION
            # ==========================================

            validation_predictions = (
                model.predict(

                    features[
                        "validation"
                    ]
                )
            )


            validation_metrics = (
                RegressionModelService
                .calculate_metrics(

                    y_validation,

                    validation_predictions,

                    actionable_threshold,
                )
            )


            # ==========================================
            # TEST
            # ==========================================

            test_predictions = (
                model.predict(

                    features[
                        "test"
                    ]
                )
            )


            test_metrics = (
                RegressionModelService
                .calculate_metrics(

                    y_test,

                    test_predictions,

                    actionable_threshold,
                )
            )


            # ==========================================
            # STABILITY
            # ==========================================

            stability = (
                RegressionModelService
                .calculate_stability_score(

                    validation_metrics,

                    test_metrics,
                )
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

                    **stability,
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


        for rank, result in enumerate(
            results,
            start=1,
        ):

            result[
                "rank"
            ] = rank


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

            "target": (
                "future_return"
            ),

            "split_summary": split[
                "split_summary"
            ],

            "validation_baselines": (
                validation_baselines
            ),

            "test_baselines": (
                test_baselines
            ),

            "best_model": (
                results[0][
                    "model"
                ]
            ),

            "model_rankings": (
                results
            ),
        }