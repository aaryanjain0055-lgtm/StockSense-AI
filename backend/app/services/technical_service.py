import numpy as np
import pandas as pd
import yfinance as yf


class TechnicalService:

    @staticmethod
    def calculate_rsi(
        close: pd.Series,
        period: int = 14,
    ) -> pd.Series:

        delta = close.diff()

        gain = delta.clip(lower=0)
        loss = -delta.clip(upper=0)

        average_gain = gain.ewm(
            alpha=1 / period,
            adjust=False,
            min_periods=period,
        ).mean()

        average_loss = loss.ewm(
            alpha=1 / period,
            adjust=False,
            min_periods=period,
        ).mean()

        rs = average_gain / average_loss.replace(0, np.nan)

        rsi = 100 - (100 / (1 + rs))

        return rsi


    @staticmethod
    def get_rsi_signal(rsi: float) -> str:

        if rsi >= 70:
            return "OVERBOUGHT"

        if rsi <= 30:
            return "OVERSOLD"

        if rsi >= 55:
            return "BULLISH"

        if rsi <= 45:
            return "BEARISH"

        return "NEUTRAL"


    @staticmethod
    def get_macd_signal(
        macd: float,
        signal_line: float,
    ) -> str:

        if macd > signal_line:
            return "BUY"

        if macd < signal_line:
            return "SELL"

        return "NEUTRAL"


    @staticmethod
    def get_trend(
        close: float,
        ema20: float,
        ema50: float,
    ) -> str:

        if close > ema20 > ema50:
            return "STRONG UPTREND"

        if close > ema50:
            return "BULLISH"

        if close < ema20 < ema50:
            return "STRONG DOWNTREND"

        if close < ema50:
            return "BEARISH"

        return "SIDEWAYS"


    @staticmethod
    def get_analysis(symbol: str):

        ticker = yf.Ticker(symbol)

        history = ticker.history(
            period="1y",
            interval="1d",
        )

        if history.empty:
            raise ValueError(
                f"No historical data found for {symbol}"
            )

        if len(history) < 50:
            raise ValueError(
                f"Not enough historical data for {symbol}"
            )

        data = history.copy()

        close = data["Close"]


        # -----------------------------
        # RSI 14
        # -----------------------------

        data["RSI_14"] = TechnicalService.calculate_rsi(
            close,
            14,
        )


        # -----------------------------
        # EMA
        # -----------------------------

        data["EMA_20"] = close.ewm(
            span=20,
            adjust=False,
        ).mean()

        data["EMA_50"] = close.ewm(
            span=50,
            adjust=False,
        ).mean()


        # -----------------------------
        # SMA
        # -----------------------------

        data["SMA_20"] = close.rolling(
            window=20,
        ).mean()

        data["SMA_50"] = close.rolling(
            window=50,
        ).mean()


        # -----------------------------
        # MACD
        # -----------------------------

        ema12 = close.ewm(
            span=12,
            adjust=False,
        ).mean()

        ema26 = close.ewm(
            span=26,
            adjust=False,
        ).mean()

        data["MACD"] = ema12 - ema26

        data["MACD_SIGNAL"] = data["MACD"].ewm(
            span=9,
            adjust=False,
        ).mean()

        data["MACD_HISTOGRAM"] = (
            data["MACD"]
            - data["MACD_SIGNAL"]
        )


        # -----------------------------
        # Bollinger Bands
        # -----------------------------

        rolling_mean = close.rolling(
            window=20,
        ).mean()

        rolling_std = close.rolling(
            window=20,
        ).std()

        data["BB_UPPER"] = (
            rolling_mean
            + (2 * rolling_std)
        )

        data["BB_MIDDLE"] = rolling_mean

        data["BB_LOWER"] = (
            rolling_mean
            - (2 * rolling_std)
        )


        # -----------------------------
        # ATR 14
        # -----------------------------

        previous_close = close.shift(1)

        true_range = pd.concat(
            [
                data["High"] - data["Low"],
                (data["High"] - previous_close).abs(),
                (data["Low"] - previous_close).abs(),
            ],
            axis=1,
        ).max(axis=1)

        data["ATR_14"] = true_range.rolling(
            window=14,
        ).mean()


        # -----------------------------
        # Support and Resistance
        # -----------------------------

        recent_data = data.tail(20)

        support = float(
            recent_data["Low"].min()
        )

        resistance = float(
            recent_data["High"].max()
        )


        # -----------------------------
        # Volume Analysis
        # -----------------------------

        current_volume = int(
            data["Volume"].iloc[-1]
        )

        average_volume = float(
            data["Volume"]
            .tail(20)
            .mean()
        )

        relative_volume = (
            current_volume / average_volume
            if average_volume > 0
            else 0
        )


        # -----------------------------
        # Latest Values
        # -----------------------------

        latest = data.iloc[-1]

        current_price = float(
            latest["Close"]
        )

        rsi = float(
            latest["RSI_14"]
        )

        macd = float(
            latest["MACD"]
        )

        macd_signal = float(
            latest["MACD_SIGNAL"]
        )

        ema20 = float(
            latest["EMA_20"]
        )

        ema50 = float(
            latest["EMA_50"]
        )


        return {
            "symbol": symbol.upper(),

            "current_price": round(
                current_price,
                2,
            ),

            "rsi": {
                "value": round(rsi, 2),
                "signal": TechnicalService.get_rsi_signal(
                    rsi
                ),
            },

            "macd": {
                "value": round(macd, 2),
                "signal_line": round(
                    macd_signal,
                    2,
                ),
                "histogram": round(
                    float(
                        latest["MACD_HISTOGRAM"]
                    ),
                    2,
                ),
                "signal": TechnicalService.get_macd_signal(
                    macd,
                    macd_signal,
                ),
            },

            "moving_averages": {
                "ema20": round(
                    ema20,
                    2,
                ),
                "ema50": round(
                    ema50,
                    2,
                ),
                "sma20": round(
                    float(latest["SMA_20"]),
                    2,
                ),
                "sma50": round(
                    float(latest["SMA_50"]),
                    2,
                ),
            },

            "bollinger_bands": {
                "upper": round(
                    float(latest["BB_UPPER"]),
                    2,
                ),
                "middle": round(
                    float(latest["BB_MIDDLE"]),
                    2,
                ),
                "lower": round(
                    float(latest["BB_LOWER"]),
                    2,
                ),
            },

            "atr": round(
                float(latest["ATR_14"]),
                2,
            ),

            "support": round(
                support,
                2,
            ),

            "resistance": round(
                resistance,
                2,
            ),

            "volume": {
                "current": current_volume,
                "average_20d": round(
                    average_volume,
                    2,
                ),
                "relative_volume": round(
                    relative_volume,
                    2,
                ),
            },

            "trend": TechnicalService.get_trend(
                current_price,
                ema20,
                ema50,
            ),
        }