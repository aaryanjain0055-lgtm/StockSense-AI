import numpy as np

from sklearn.ensemble import (
    HistGradientBoostingClassifier,
)

from sklearn.metrics import (
    accuracy_score,
    precision_score,
)

from sklearn.preprocessing import (
    StandardScaler,
)

from app.services.prediction_data_service import (
    PredictionDataService,
)


class ConfidenceThresholdService:

    # ==================================================
    # MODEL
    # ==================================================

    @staticmethod
    def create_model():

        return HistGradientBoostingClassifier(
            learning_rate=0.05,
            max_iter=300,
            max_leaf_nodes=15,
            min_samples_leaf=20,
            l2_regularization=1.0,
            random_state=42,
        )


    # ==================================================
    # CREATE SIGNALS
    # ==================================================

    @staticmethod
    def create_signals(
        probabilities,
        lower_threshold,
        upper_threshold,
    ):

        signals = np.full(
            len(probabilities),
            -1,
            dtype=int,
        )


        signals[
            probabilities
            <= lower_threshold
        ] = 0


        signals[
            probabilities
            >= upper_threshold
        ] = 1


        return signals


    # ==================================================
    # EVALUATE SIGNALS
    # ==================================================

    @staticmethod
    def evaluate_signals(
        y_true,
        signals,
    ):

        signal_mask = (
            signals != -1
        )


        signal_count = int(
            signal_mask.sum()
        )


        total_count = int(
            len(signals)
        )


        no_signal_count = (
            total_count
            - signal_count
        )


        coverage = (
            signal_count
            / total_count
            if total_count > 0
            else 0.0
        )


        if signal_count == 0:

            return {
                "total_predictions": (
                    total_count
                ),

                "signal_count": 0,

                "no_signal_count": (
                    no_signal_count
                ),

                "coverage": 0.0,

                "signal_accuracy": None,

                "up_signal_count": 0,

                "down_signal_count": 0,

                "up_precision": None,

                "down_precision": None,
            }


        filtered_y = np.asarray(
            y_true
        )[signal_mask]


        filtered_signals = signals[
            signal_mask
        ]


        signal_accuracy = (
            accuracy_score(
                filtered_y,
                filtered_signals,
            )
        )


        up_mask = (
            filtered_signals == 1
        )


        down_mask = (
            filtered_signals == 0
        )


        up_signal_count = int(
            up_mask.sum()
        )


        down_signal_count = int(
            down_mask.sum()
        )


        # ==============================================
        # UP PRECISION
        # ==============================================

        if up_signal_count > 0:

            up_precision = float(
                (
                    filtered_y[
                        up_mask
                    ]
                    == 1
                ).mean()
            )

        else:

            up_precision = None


        # ==============================================
        # DOWN PRECISION
        # ==============================================

        if down_signal_count > 0:

            down_precision = float(
                (
                    filtered_y[
                        down_mask
                    ]
                    == 0
                ).mean()
            )

        else:

            down_precision = None


        return {
            "total_predictions": (
                total_count
            ),

            "signal_count": (
                signal_count
            ),

            "no_signal_count": (
                no_signal_count
            ),

            "coverage": round(
                float(coverage),
                4,
            ),

            "signal_accuracy": round(
                float(
                    signal_accuracy
                ),
                4,
            ),

            "up_signal_count": (
                up_signal_count
            ),

            "down_signal_count": (
                down_signal_count
            ),

            "up_precision": (
                round(
                    up_precision,
                    4,
                )
                if up_precision
                is not None
                else None
            ),

            "down_precision": (
                round(
                    down_precision,
                    4,
                )
                if down_precision
                is not None
                else None
            ),
        }


    # ==================================================
    # RUN EXPERIMENT
    # ==================================================

    @staticmethod
    def experiment(
        symbol: str,
        period: str = "5y",
        horizon: int = 5,
        threshold: float = 0.02,
        initial_train_ratio: float = 0.50,
        test_window_size: int = 60,
        step_size: int = 60,
    ):

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


        # ==============================================
        # CONFIDENCE BANDS TO TEST
        # ==============================================

        confidence_bands = [
            (0.45, 0.55),
            (0.40, 0.60),
            (0.35, 0.65),
            (0.30, 0.70),
        ]


        aggregated = {
            band: {
                "correct": 0,
                "signals": 0,
                "total": 0,
                "up_correct": 0,
                "up_signals": 0,
                "down_correct": 0,
                "down_signals": 0,
                "fold_results": [],
            }

            for band in confidence_bands
        }


        train_end = (
            initial_train_size
        )


        fold_number = 1


        while (
            train_end
            + test_window_size
            <= total_rows
        ):

            train_data = data.iloc[
                :train_end
            ].copy()


            test_data = data.iloc[
                train_end:
                train_end
                + test_window_size
            ].copy()


            # ==========================================
            # PURGE HORIZON BOUNDARY
            # ==========================================

            purged_train_data = (
                train_data.iloc[
                    :-horizon
                ].copy()
            )


            X_train = (
                purged_train_data[
                    feature_columns
                ]
            )


            y_train = (
                purged_train_data[
                    "target_direction"
                ]
                .astype(int)
            )


            X_test = (
                test_data[
                    feature_columns
                ]
            )


            y_test = (
                test_data[
                    "target_direction"
                ]
                .astype(int)
            )


            if y_train.nunique() < 2:

                train_end += step_size

                fold_number += 1

                continue


            # ==========================================
            # SCALE
            # ==========================================

            scaler = StandardScaler()


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


            # ==========================================
            # TRAIN
            # ==========================================

            model = (
                ConfidenceThresholdService
                .create_model()
            )


            model.fit(
                X_train_scaled,
                y_train,
            )


            probabilities = (
                model.predict_proba(
                    X_test_scaled
                )[:, 1]
            )


            # ==========================================
            # TEST EACH CONFIDENCE BAND
            # ==========================================

            for band in confidence_bands:

                lower, upper = band


                signals = (
                    ConfidenceThresholdService
                    .create_signals(
                        probabilities,
                        lower,
                        upper,
                    )
                )


                metrics = (
                    ConfidenceThresholdService
                    .evaluate_signals(
                        y_test,
                        signals,
                    )
                )


                store = aggregated[
                    band
                ]


                signal_mask = (
                    signals != -1
                )


                y_array = np.asarray(
                    y_test
                )


                if signal_mask.sum() > 0:

                    store["correct"] += int(
                        (
                            y_array[
                                signal_mask
                            ]
                            ==
                            signals[
                                signal_mask
                            ]
                        ).sum()
                    )


                store["signals"] += (
                    metrics[
                        "signal_count"
                    ]
                )


                store["total"] += (
                    metrics[
                        "total_predictions"
                    ]
                )


                up_mask = (
                    signals == 1
                )


                down_mask = (
                    signals == 0
                )


                store["up_signals"] += int(
                    up_mask.sum()
                )


                store["down_signals"] += int(
                    down_mask.sum()
                )


                if up_mask.sum() > 0:

                    store["up_correct"] += int(
                        (
                            y_array[
                                up_mask
                            ]
                            == 1
                        ).sum()
                    )


                if down_mask.sum() > 0:

                    store[
                        "down_correct"
                    ] += int(
                        (
                            y_array[
                                down_mask
                            ]
                            == 0
                        ).sum()
                    )


                store[
                    "fold_results"
                ].append(
                    {
                        "fold": (
                            fold_number
                        ),

                        "lower_threshold": (
                            lower
                        ),

                        "upper_threshold": (
                            upper
                        ),

                        **metrics,
                    }
                )


            train_end += (
                step_size
            )


            fold_number += 1


        # ==============================================
        # AGGREGATE FINAL RESULTS
        # ==============================================

        results = []


        for band, values in (
            aggregated.items()
        ):

            lower, upper = band


            signals = values[
                "signals"
            ]


            total = values[
                "total"
            ]


            signal_accuracy = (
                values["correct"]
                / signals
                if signals > 0
                else None
            )


            coverage = (
                signals / total
                if total > 0
                else 0.0
            )


            up_precision = (
                values["up_correct"]
                / values["up_signals"]
                if values["up_signals"] > 0
                else None
            )


            down_precision = (
                values["down_correct"]
                / values["down_signals"]
                if values[
                    "down_signals"
                ] > 0
                else None
            )


            # ------------------------------------------
            # Conservative utility score
            #
            # Accuracy matters most, but tiny coverage
            # should not automatically win.
            # ------------------------------------------

            utility_score = (
                (
                    signal_accuracy
                    * 0.75
                )
                +
                (
                    coverage
                    * 0.25
                )
                if signal_accuracy
                is not None
                else 0.0
            )


            results.append(
                {
                    "lower_threshold": (
                        lower
                    ),

                    "upper_threshold": (
                        upper
                    ),

                    "signal_count": (
                        signals
                    ),

                    "total_predictions": (
                        total
                    ),

                    "coverage": round(
                        float(coverage),
                        4,
                    ),

                    "signal_accuracy": (
                        round(
                            float(
                                signal_accuracy
                            ),
                            4,
                        )
                        if signal_accuracy
                        is not None
                        else None
                    ),

                    "up_signal_count": (
                        values[
                            "up_signals"
                        ]
                    ),

                    "down_signal_count": (
                        values[
                            "down_signals"
                        ]
                    ),

                    "up_precision": (
                        round(
                            float(
                                up_precision
                            ),
                            4,
                        )
                        if up_precision
                        is not None
                        else None
                    ),

                    "down_precision": (
                        round(
                            float(
                                down_precision
                            ),
                            4,
                        )
                        if down_precision
                        is not None
                        else None
                    ),

                    "utility_score": round(
                        float(
                            utility_score
                        ),
                        4,
                    ),

                    "fold_results": (
                        values[
                            "fold_results"
                        ]
                    ),
                }
            )


        results.sort(
            key=lambda item: (
                item[
                    "utility_score"
                ]
            ),
            reverse=True,
        )


        return {
            "symbol": (
                symbol.upper()
            ),

            "model": (
                "HistGradientBoosting"
            ),

            "prediction_horizon_days": (
                horizon
            ),

            "target_threshold": (
                threshold
            ),

            "best_confidence_band": (
                results[0]
                if results
                else None
            ),

            "ranked_confidence_bands": (
                results
            ),
        }