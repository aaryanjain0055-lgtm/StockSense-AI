import pandas as pd

from sklearn.preprocessing import StandardScaler

from app.services.prediction_data_service import (
    PredictionDataService,
)


class RegressionSplitService:

    # ==================================================
    # TARGET SUMMARY
    # ==================================================

    @staticmethod
    def target_summary(
        target: pd.Series,
    ):

        return {
            "count": int(
                len(target)
            ),

            "mean": round(
                float(target.mean()),
                6,
            ),

            "median": round(
                float(target.median()),
                6,
            ),

            "std": round(
                float(target.std()),
                6,
            ),

            "minimum": round(
                float(target.min()),
                6,
            ),

            "maximum": round(
                float(target.max()),
                6,
            ),

            "positive_rate": round(
                float(
                    (target > 0).mean()
                ),
                4,
            ),

            "negative_rate": round(
                float(
                    (target < 0).mean()
                ),
                4,
            ),

            "above_2_percent_rate": round(
                float(
                    (target > 0.02).mean()
                ),
                4,
            ),

            "below_minus_2_percent_rate": round(
                float(
                    (target < -0.02).mean()
                ),
                4,
            ),
        }


    # ==================================================
    # CHRONOLOGICAL REGRESSION SPLIT
    # ==================================================

    @staticmethod
    def chronological_split(
        symbol: str,
        period: str = "5y",
        horizon: int = 5,
        train_ratio: float = 0.70,
        validation_ratio: float = 0.15,
    ):

        # ==============================================
        # VALIDATE INPUTS
        # ==============================================

        if horizon <= 0:

            raise ValueError(
                "horizon must be greater than 0."
            )


        if train_ratio <= 0:

            raise ValueError(
                "train_ratio must be greater than 0."
            )


        if validation_ratio <= 0:

            raise ValueError(
                "validation_ratio must be greater than 0."
            )


        if (
            train_ratio
            + validation_ratio
            >= 1
        ):

            raise ValueError(
                "train_ratio + validation_ratio "
                "must be less than 1."
            )


        # ==============================================
        # BUILD DATASET
        #
        # Threshold is irrelevant for regression target.
        # future_return is continuous.
        # ==============================================

        result = (
            PredictionDataService
            .build_dataset(
                symbol=symbol,
                period=period,
                horizon=horizon,
                threshold=0.02,
            )
        )


        data = result[
            "data"
        ].copy()


        feature_columns = result[
            "feature_columns"
        ]


        total_rows_before_purge = len(
            data
        )


        if total_rows_before_purge < 100:

            raise ValueError(
                "Dataset is too small for reliable "
                "regression splitting."
            )


        # ==============================================
        # SPLIT BOUNDARIES
        # ==============================================

        train_end = int(
            total_rows_before_purge
            * train_ratio
        )


        validation_end = int(
            total_rows_before_purge
            * (
                train_ratio
                + validation_ratio
            )
        )


        # ==============================================
        # INITIAL CHRONOLOGICAL SPLIT
        # ==============================================

        train_data = data.iloc[
            :train_end
        ].copy()


        validation_data = data.iloc[
            train_end:
            validation_end
        ].copy()


        test_data = data.iloc[
            validation_end:
        ].copy()


        original_train_rows = len(
            train_data
        )


        original_validation_rows = len(
            validation_data
        )


        # ==============================================
        # PURGE HORIZON OVERLAP
        #
        # A target at time t uses price at t+horizon.
        #
        # Remove final horizon observations from train
        # and validation so target windows do not cross
        # into the next evaluation period.
        # ==============================================

        if len(train_data) <= horizon:

            raise ValueError(
                "Training split is too small "
                "for selected horizon."
            )


        if len(validation_data) <= horizon:

            raise ValueError(
                "Validation split is too small "
                "for selected horizon."
            )


        train_data = train_data.iloc[
            :-horizon
        ].copy()


        validation_data = validation_data.iloc[
            :-horizon
        ].copy()


        # ==============================================
        # FEATURES
        # ==============================================

        X_train_raw = train_data[
            feature_columns
        ].copy()


        X_validation_raw = validation_data[
            feature_columns
        ].copy()


        X_test_raw = test_data[
            feature_columns
        ].copy()


        # ==============================================
        # CONTINUOUS REGRESSION TARGET
        # ==============================================

        y_train = train_data[
            "future_return"
        ].astype(float)


        y_validation = validation_data[
            "future_return"
        ].astype(float)


        y_test = test_data[
            "future_return"
        ].astype(float)


        # ==============================================
        # SCALE FEATURES
        #
        # Fit only on training period.
        # ==============================================

        scaler = StandardScaler()


        X_train_scaled_array = (
            scaler.fit_transform(
                X_train_raw
            )
        )


        X_validation_scaled_array = (
            scaler.transform(
                X_validation_raw
            )
        )


        X_test_scaled_array = (
            scaler.transform(
                X_test_raw
            )
        )


        # ==============================================
        # RESTORE DATAFRAME STRUCTURE
        # ==============================================

        X_train_scaled = pd.DataFrame(
            X_train_scaled_array,
            index=X_train_raw.index,
            columns=feature_columns,
        )


        X_validation_scaled = pd.DataFrame(
            X_validation_scaled_array,
            index=X_validation_raw.index,
            columns=feature_columns,
        )


        X_test_scaled = pd.DataFrame(
            X_test_scaled_array,
            index=X_test_raw.index,
            columns=feature_columns,
        )


        # ==============================================
        # TARGET SUMMARIES
        # ==============================================

        train_target_summary = (
            RegressionSplitService
            .target_summary(
                y_train
            )
        )


        validation_target_summary = (
            RegressionSplitService
            .target_summary(
                y_validation
            )
        )


        test_target_summary = (
            RegressionSplitService
            .target_summary(
                y_test
            )
        )


        # ==============================================
        # RETURN
        # ==============================================

        return {
            "symbol": result[
                "symbol"
            ],

            "period": period,

            "prediction_horizon_days": (
                horizon
            ),

            "target_name": (
                "future_return"
            ),

            "target_type": (
                "REGRESSION"
            ),

            "feature_columns": (
                feature_columns
            ),

            "scaler": scaler,

            # ==========================================
            # SCALED FEATURES
            # ==========================================

            "X_train": (
                X_train_scaled
            ),

            "X_validation": (
                X_validation_scaled
            ),

            "X_test": (
                X_test_scaled
            ),

            # ==========================================
            # RAW FEATURES
            # ==========================================

            "X_train_raw": (
                X_train_raw
            ),

            "X_validation_raw": (
                X_validation_raw
            ),

            "X_test_raw": (
                X_test_raw
            ),

            # ==========================================
            # TARGETS
            # ==========================================

            "y_train": y_train,

            "y_validation": (
                y_validation
            ),

            "y_test": y_test,

            # ==========================================
            # SUMMARY
            # ==========================================

            "split_summary": {

                "total_rows_before_purge": (
                    total_rows_before_purge
                ),

                "total_rows_after_purge": (
                    len(X_train_scaled)
                    + len(X_validation_scaled)
                    + len(X_test_scaled)
                ),

                "original_train_rows": (
                    original_train_rows
                ),

                "original_validation_rows": (
                    original_validation_rows
                ),

                "purged_train_rows": (
                    original_train_rows
                    - len(train_data)
                ),

                "purged_validation_rows": (
                    original_validation_rows
                    - len(validation_data)
                ),

                "train_rows": int(
                    len(X_train_scaled)
                ),

                "validation_rows": int(
                    len(X_validation_scaled)
                ),

                "test_rows": int(
                    len(X_test_scaled)
                ),

                "train_start": str(
                    train_data.index.min()
                ),

                "train_end": str(
                    train_data.index.max()
                ),

                "validation_start": str(
                    validation_data.index.min()
                ),

                "validation_end": str(
                    validation_data.index.max()
                ),

                "test_start": str(
                    test_data.index.min()
                ),

                "test_end": str(
                    test_data.index.max()
                ),

                "train_target": (
                    train_target_summary
                ),

                "validation_target": (
                    validation_target_summary
                ),

                "test_target": (
                    test_target_summary
                ),
            },
        }