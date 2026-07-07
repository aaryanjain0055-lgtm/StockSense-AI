import numpy as np
import pandas as pd
import yfinance as yf


class PredictionDataService:

    # ==================================================
    # DOWNLOAD HISTORICAL DATA
    # ==================================================

    @staticmethod
    def download_history(
        symbol: str,
        period: str = "5y",
    ) -> pd.DataFrame:

        ticker = yf.Ticker(symbol)

        data = ticker.history(
            period=period,
            auto_adjust=False,
        )

        if data.empty:
            raise ValueError(
                f"No historical data found for {symbol}"
            )

        data = data.copy()

        required_columns = [
            "Open",
            "High",
            "Low",
            "Close",
            "Volume",
        ]

        missing_columns = [
            column
            for column in required_columns
            if column not in data.columns
        ]

        if missing_columns:
            raise ValueError(
                "Historical data is missing columns: "
                + ", ".join(missing_columns)
            )

        data = data.sort_index()

        return data


    # ==================================================
    # RSI
    # ==================================================

    @staticmethod
    def calculate_rsi(
        close: pd.Series,
        period: int = 14,
    ) -> pd.Series:

        delta = close.diff()

        gain = delta.clip(
            lower=0
        )

        loss = (
            -delta.clip(
                upper=0
            )
        )

        average_gain = gain.ewm(
            alpha=1 / period,
            min_periods=period,
            adjust=False,
        ).mean()

        average_loss = loss.ewm(
            alpha=1 / period,
            min_periods=period,
            adjust=False,
        ).mean()

        rs = (
            average_gain
            / average_loss.replace(
                0,
                np.nan,
            )
        )

        rsi = (
            100
            - (
                100
                / (1 + rs)
            )
        )

        return rsi


    # ==================================================
    # ATR
    # ==================================================

    @staticmethod
    def calculate_atr(
        data: pd.DataFrame,
        period: int = 14,
    ) -> pd.Series:

        previous_close = (
            data["Close"].shift(1)
        )

        high_low = (
            data["High"]
            - data["Low"]
        )

        high_previous_close = (
            data["High"]
            - previous_close
        ).abs()

        low_previous_close = (
            data["Low"]
            - previous_close
        ).abs()

        true_range = pd.concat(
            [
                high_low,
                high_previous_close,
                low_previous_close,
            ],
            axis=1,
        ).max(axis=1)

        atr = true_range.ewm(
            alpha=1 / period,
            min_periods=period,
            adjust=False,
        ).mean()

        return atr


    # ==================================================
    # FEATURE ENGINEERING
    # ==================================================

    @staticmethod
    def engineer_features(
        data: pd.DataFrame,
    ) -> pd.DataFrame:

        df = data.copy()

        # ==============================================
        # RETURNS
        # ==============================================

        df["return_1d"] = (
            df["Close"].pct_change(1)
        )

        df["return_5d"] = (
            df["Close"].pct_change(5)
        )

        df["return_10d"] = (
            df["Close"].pct_change(10)
        )

        df["return_20d"] = (
            df["Close"].pct_change(20)
        )


        # ==============================================
        # LOG RETURN
        # ==============================================

        df["log_return"] = np.log(
            df["Close"]
            / df["Close"].shift(1)
        )


        # ==============================================
        # VOLATILITY
        # ==============================================

        df["volatility_5d"] = (
            df["return_1d"]
            .rolling(5)
            .std()
        )

        df["volatility_10d"] = (
            df["return_1d"]
            .rolling(10)
            .std()
        )

        df["volatility_20d"] = (
            df["return_1d"]
            .rolling(20)
            .std()
        )


        # ==============================================
        # RSI
        # ==============================================

        df["rsi_14"] = (
            PredictionDataService
            .calculate_rsi(
                df["Close"],
                14,
            )
        )


        # ==============================================
        # EMA
        # ==============================================

        df["ema_10"] = (
            df["Close"]
            .ewm(
                span=10,
                adjust=False,
            )
            .mean()
        )

        df["ema_20"] = (
            df["Close"]
            .ewm(
                span=20,
                adjust=False,
            )
            .mean()
        )

        df["ema_50"] = (
            df["Close"]
            .ewm(
                span=50,
                adjust=False,
            )
            .mean()
        )


        # ==============================================
        # PRICE / EMA RATIOS
        # ==============================================

        df["price_ema10_ratio"] = (
            df["Close"]
            / df["ema_10"]
            - 1
        )

        df["price_ema20_ratio"] = (
            df["Close"]
            / df["ema_20"]
            - 1
        )

        df["price_ema50_ratio"] = (
            df["Close"]
            / df["ema_50"]
            - 1
        )


        # ==============================================
        # MACD
        # ==============================================

        ema12 = (
            df["Close"]
            .ewm(
                span=12,
                adjust=False,
            )
            .mean()
        )

        ema26 = (
            df["Close"]
            .ewm(
                span=26,
                adjust=False,
            )
            .mean()
        )

        df["macd"] = (
            ema12
            - ema26
        )

        df["macd_signal"] = (
            df["macd"]
            .ewm(
                span=9,
                adjust=False,
            )
            .mean()
        )

        df["macd_histogram"] = (
            df["macd"]
            - df["macd_signal"]
        )


        # ==============================================
        # NORMALIZED MACD
        #
        # Absolute MACD depends on stock price scale.
        # These normalized versions are more portable.
        # ==============================================

        df["macd_percent"] = (
            df["macd"]
            / df["Close"]
        )

        df["macd_signal_percent"] = (
            df["macd_signal"]
            / df["Close"]
        )

        df["macd_histogram_percent"] = (
            df["macd_histogram"]
            / df["Close"]
        )


        # ==============================================
        # BOLLINGER BANDS
        # ==============================================

        rolling_mean_20 = (
            df["Close"]
            .rolling(20)
            .mean()
        )

        rolling_std_20 = (
            df["Close"]
            .rolling(20)
            .std()
        )

        df["bollinger_upper"] = (
            rolling_mean_20
            + 2 * rolling_std_20
        )

        df["bollinger_lower"] = (
            rolling_mean_20
            - 2 * rolling_std_20
        )

        bollinger_width = (
            df["bollinger_upper"]
            - df["bollinger_lower"]
        )

        df["bollinger_position"] = (
            (
                df["Close"]
                - df["bollinger_lower"]
            )
            /
            bollinger_width.replace(
                0,
                np.nan,
            )
        )

        df["bollinger_width_percent"] = (
            bollinger_width
            / rolling_mean_20
        )


        # ==============================================
        # ATR
        # ==============================================

        df["atr_14"] = (
            PredictionDataService
            .calculate_atr(
                df,
                14,
            )
        )

        df["atr_percent"] = (
            df["atr_14"]
            / df["Close"]
        )


        # ==============================================
        # VOLUME FEATURES
        # ==============================================

        df["volume_ma_20"] = (
            df["Volume"]
            .rolling(20)
            .mean()
        )

        df["relative_volume"] = (
            df["Volume"]
            / df["volume_ma_20"]
        )

        df["volume_change_1d"] = (
            df["Volume"]
            .pct_change()
        )


        # ==============================================
        # PRICE RANGE FEATURES
        # ==============================================

        df["daily_range"] = (
            (
                df["High"]
                - df["Low"]
            )
            / df["Close"]
        )

        df["open_close_change"] = (
            (
                df["Close"]
                - df["Open"]
            )
            / df["Open"]
        )


        # ==============================================
        # LAG FEATURES
        #
        # Historical information only.
        # ==============================================

        for lag in [
            1,
            2,
            3,
            5,
            10,
        ]:

            df[
                f"return_lag_{lag}"
            ] = (
                df["return_1d"]
                .shift(lag)
            )


        # ==============================================
        # CALENDAR FEATURES
        # ==============================================

        df["day_of_week"] = (
            df.index.dayofweek
        )

        df["month"] = (
            df.index.month
        )


        return df


    # ==================================================
    # CREATE TARGETS
    # ==================================================

    @staticmethod
    def create_targets(
        data: pd.DataFrame,
        horizon: int = 5,
        threshold: float = 0.02,
    ) -> pd.DataFrame:

        if horizon <= 0:
            raise ValueError(
                "horizon must be greater than 0."
            )

        if threshold < 0:
            raise ValueError(
                "threshold cannot be negative."
            )


        df = data.copy()


        # ==============================================
        # FUTURE RETURN
        #
        # Used only for target creation.
        # Never included in feature columns.
        # ==============================================

        df["future_return"] = (
            df["Close"]
            .shift(-horizon)
            / df["Close"]
            - 1
        )


        # ==============================================
        # THREE-CLASS TARGET
        #
        # 0 = DOWN
        # 1 = NEUTRAL
        # 2 = UP
        #
        # IMPORTANT:
        # Neutral observations are preserved.
        # ==============================================

        df["target_class"] = np.select(
            [
                df["future_return"]
                < -threshold,

                df["future_return"]
                > threshold,
            ],
            [
                0,
                2,
            ],
            default=1,
        )


        # ==============================================
        # RAW SIGNAL
        #
        # Kept for interpretability:
        # -1 = DOWN
        #  0 = NEUTRAL
        #  1 = UP
        # ==============================================

        df["target_signal"] = np.select(
            [
                df["future_return"]
                < -threshold,

                df["future_return"]
                > threshold,
            ],
            [
                -1,
                1,
            ],
            default=0,
        )


        # ==============================================
        # BINARY DIRECTION TARGET
        #
        # This is provided only for controlled binary
        # experiments.
        #
        # Neutral rows remain NaN instead of being
        # silently converted to DOWN.
        # ==============================================

        df["target_direction"] = np.where(
            df["target_signal"] == 1,
            1.0,
            np.where(
                df["target_signal"] == -1,
                0.0,
                np.nan,
            ),
        )


        # Remove only rows without known future outcome.

        df = df[
            df["future_return"].notna()
        ].copy()


        df["target_class"] = (
            df["target_class"]
            .astype(int)
        )

        df["target_signal"] = (
            df["target_signal"]
            .astype(int)
        )


        return df


    # ==================================================
    # FEATURE COLUMNS
    # ==================================================

    @staticmethod
    def get_feature_columns():

        return [
            "return_1d",
            "return_5d",
            "return_10d",
            "return_20d",

            "log_return",

            "volatility_5d",
            "volatility_10d",
            "volatility_20d",

            "rsi_14",

            "price_ema10_ratio",
            "price_ema20_ratio",
            "price_ema50_ratio",

            "macd_percent",
            "macd_signal_percent",
            "macd_histogram_percent",

            "bollinger_position",
            "bollinger_width_percent",

            "atr_percent",

            "relative_volume",
            "volume_change_1d",

            "daily_range",
            "open_close_change",

            "return_lag_1",
            "return_lag_2",
            "return_lag_3",
            "return_lag_5",
            "return_lag_10",

            "day_of_week",
            "month",
        ]


    # ==================================================
    # BUILD COMPLETE DATASET
    # ==================================================

    @staticmethod
    def build_dataset(
        symbol: str,
        period: str = "5y",
        horizon: int = 5,
        threshold: float = 0.02,
    ):

        raw_data = (
            PredictionDataService
            .download_history(
                symbol=symbol,
                period=period,
            )
        )


        feature_data = (
            PredictionDataService
            .engineer_features(
                raw_data
            )
        )


        dataset = (
            PredictionDataService
            .create_targets(
                feature_data,
                horizon=horizon,
                threshold=threshold,
            )
        )


        feature_columns = (
            PredictionDataService
            .get_feature_columns()
        )


        model_data = dataset[
            feature_columns
            + [
                "future_return",
                "target_signal",
                "target_class",
                "target_direction",
            ]
        ].copy()


        # ==============================================
        # CLEAN FEATURE VALUES
        # ==============================================

        model_data[
            feature_columns
        ] = (
            model_data[
                feature_columns
            ]
            .replace(
                [np.inf, -np.inf],
                np.nan,
            )
        )


        # Drop rows only when feature values are invalid.
        #
        # Do NOT drop neutral rows because
        # target_direction is NaN for neutral examples.

        model_data = model_data.dropna(
            subset=feature_columns
            + [
                "future_return",
                "target_class",
            ]
        )


        if model_data.empty:
            raise ValueError(
                "Dataset became empty after feature engineering."
            )


        # ==============================================
        # CLASS COUNTS
        # ==============================================

        class_counts = (
            model_data[
                "target_class"
            ]
            .value_counts()
            .to_dict()
        )


        down_count = int(
            class_counts.get(
                0,
                0,
            )
        )

        neutral_count = int(
            class_counts.get(
                1,
                0,
            )
        )

        up_count = int(
            class_counts.get(
                2,
                0,
            )
        )


        return {
            "symbol": (
                symbol.upper()
            ),

            "period": period,

            "prediction_horizon_days": (
                horizon
            ),

            "target_threshold": (
                threshold
            ),

            "row_count": int(
                len(model_data)
            ),

            "feature_count": int(
                len(feature_columns)
            ),

            "feature_columns": (
                feature_columns
            ),

            "class_distribution": {
                "down": down_count,
                "neutral": neutral_count,
                "up": up_count,
            },

            "down_targets": (
                down_count
            ),

            "neutral_targets": (
                neutral_count
            ),

            "up_targets": (
                up_count
            ),

            "data": model_data,
        }