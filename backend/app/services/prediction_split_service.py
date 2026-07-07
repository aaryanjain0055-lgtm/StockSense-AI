import pandas as pd

from sklearn.preprocessing import StandardScaler

from app.services.prediction_data_service import (
    PredictionDataService,
)


class PredictionSplitService:

    # ==================================================
    # CLASS DISTRIBUTION
    # ==================================================

    @staticmethod
    def get_class_distribution(
        target: pd.Series,
    ):

        total = len(target)

        down_count = int(
            (target == 0).sum()
        )

        neutral_count = int(
            (target == 1).sum()
        )

        up_count = int(
            (target == 2).sum()
        )

        return {
            "down": down_count,

            "neutral": neutral_count,

            "up": up_count,

            "down_rate": round(
                down_count / total,
                4,
            )
            if total > 0
            else 0.0,

            "neutral_rate": round(
                neutral_count / total,
                4,
            )
            if total > 0
            else 0.0,

            "up_rate": round(
                up_count / total,
                4,
            )
            if total > 0
            else 0.0,
        }


    # ==================================================
    # CHRONOLOGICAL SPLIT
    # ==================================================

    @staticmethod
    def chronological_split(
        symbol: str,
        period: str = "5y",
        horizon: int = 5,
        threshold: float = 0.02,
        train_ratio: float = 0.70,
        validation_ratio: float = 0.15,
    ):

        # ==============================================
        # VALIDATE INPUTS
        # ==============================================

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


        if horizon <= 0:

            raise ValueError(
                "horizon must be greater than 0."
            )


        if threshold < 0:

            raise ValueError(
                "threshold cannot be negative."
            )


        # ==============================================
        # BUILD COMPLETE DATASET
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


        total_rows_before_purge = len(
            data
        )


        if total_rows_before_purge < 100:

            raise ValueError(
                "Dataset is too small for reliable "
                "train/validation/test splitting."
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


        # ==============================================
        # SAVE PRE-PURGE COUNTS
        # ==============================================

        original_train_rows = len(
            train_data
        )

        original_validation_rows = len(
            validation_data
        )


        # ==============================================
        # PURGE TARGET OVERLAP
        #
        # Target at time t uses price at:
        #
        # t + horizon
        #
        # Therefore, the last horizon rows of training
        # must not use prices belonging to validation.
        #
        # Same logic applies between validation and test.
        # ==============================================

        if len(train_data) <= horizon:

            raise ValueError(
                "Training split is too small "
                "for the selected horizon."
            )


        if len(validation_data) <= horizon:

            raise ValueError(
                "Validation split is too small "
                "for the selected horizon."
            )


        train_data = train_data.iloc[
            :-horizon
        ].copy()


        validation_data = validation_data.iloc[
            :-horizon
        ].copy()


        # ==============================================
        # VERIFY SPLITS
        # ==============================================

        if train_data.empty:

            raise ValueError(
                "Training split is empty."
            )


        if validation_data.empty:

            raise ValueError(
                "Validation split is empty."
            )


        if test_data.empty:

            raise ValueError(
                "Test split is empty."
            )


        # ==============================================
        # FEATURES
        # ==============================================

        X_train = train_data[
            feature_columns
        ].copy()


        X_validation = validation_data[
            feature_columns
        ].copy()


        X_test = test_data[
            feature_columns
        ].copy()


        # ==============================================
        # MULTICLASS TARGETS
        #
        # 0 = DOWN
        # 1 = NEUTRAL
        # 2 = UP
        # ==============================================

        y_train = train_data[
            "target_class"
        ].astype(int)


        y_validation = validation_data[
            "target_class"
        ].astype(int)


        y_test = test_data[
            "target_class"
        ].astype(int)


        # ==============================================
        # VERIFY CLASS AVAILABILITY
        # ==============================================

        train_classes = sorted(
            y_train.unique().tolist()
        )


        if len(train_classes) < 2:

            raise ValueError(
                "Training data contains fewer than "
                "two target classes."
            )


        # ==============================================
        # STANDARD SCALING
        #
        # Fit only on training data.
        # Validation and test use training statistics.
        # ==============================================

        scaler = StandardScaler()


        X_train_scaled_array = (
            scaler.fit_transform(
                X_train
            )
        )


        X_validation_scaled_array = (
            scaler.transform(
                X_validation
            )
        )


        X_test_scaled_array = (
            scaler.transform(
                X_test
            )
        )


        # ==============================================
        # CONVERT ARRAYS BACK TO DATAFRAMES
        # ==============================================

        X_train_scaled = pd.DataFrame(
            X_train_scaled_array,
            index=X_train.index,
            columns=feature_columns,
        )


        X_validation_scaled = pd.DataFrame(
            X_validation_scaled_array,
            index=X_validation.index,
            columns=feature_columns,
        )


        X_test_scaled = pd.DataFrame(
            X_test_scaled_array,
            index=X_test.index,
            columns=feature_columns,
        )


        # ==============================================
        # CLASS DISTRIBUTIONS
        # ==============================================

        train_distribution = (
            PredictionSplitService
            .get_class_distribution(
                y_train
            )
        )


        validation_distribution = (
            PredictionSplitService
            .get_class_distribution(
                y_validation
            )
        )


        test_distribution = (
            PredictionSplitService
            .get_class_distribution(
                y_test
            )
        )


        # ==============================================
        # MAJORITY CLASS BASELINES
        # ==============================================

        train_majority_class = int(
            y_train
            .value_counts()
            .idxmax()
        )


        validation_majority_class = int(
            y_validation
            .value_counts()
            .idxmax()
        )


        test_majority_class = int(
            y_test
            .value_counts()
            .idxmax()
        )


        validation_majority_accuracy = round(
            float(
                (
                    y_validation
                    == validation_majority_class
                ).mean()
            ),
            4,
        )


        test_majority_accuracy = round(
            float(
                (
                    y_test
                    == test_majority_class
                ).mean()
            ),
            4,
        )


        # ==============================================
        # CLASS LABEL MAP
        # ==============================================

        class_labels = {
            0: "DOWN",
            1: "NEUTRAL",
            2: "UP",
        }


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

            "target_threshold": (
                threshold
            ),

            "target_type": (
                "MULTICLASS"
            ),

            "class_labels": (
                class_labels
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
            #
            # Useful later for tree models because
            # scaling is not required by those models.
            # ==========================================

            "X_train_raw": (
                X_train
            ),

            "X_validation_raw": (
                X_validation
            ),

            "X_test_raw": (
                X_test
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
            # SPLIT SUMMARY
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

                "train_rows": len(
                    X_train_scaled
                ),

                "validation_rows": len(
                    X_validation_scaled
                ),

                "test_rows": len(
                    X_test_scaled
                ),

                # ======================================
                # DATE RANGES
                # ======================================

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

                # ======================================
                # CLASS DISTRIBUTIONS
                # ======================================

                "train_distribution": (
                    train_distribution
                ),

                "validation_distribution": (
                    validation_distribution
                ),

                "test_distribution": (
                    test_distribution
                ),

                # ======================================
                # MAJORITY BASELINES
                # ======================================

                "train_majority_class": (
                    train_majority_class
                ),

                "validation_majority_class": (
                    validation_majority_class
                ),

                "test_majority_class": (
                    test_majority_class
                ),

                "validation_majority_accuracy": (
                    validation_majority_accuracy
                ),

                "test_majority_accuracy": (
                    test_majority_accuracy
                ),
            },
        }