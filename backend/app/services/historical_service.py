import yfinance as yf


class HistoricalService:

    @staticmethod
    def get_history(symbol: str, period: str = "6mo"):

        ticker = yf.Ticker(symbol)

        history = ticker.history(period=period)

        if history.empty:
            return []

        candles = []

        for index, row in history.iterrows():
            candles.append(
                {
                    "date": index.strftime("%Y-%m-%d"),
                    "open": float(row.Open),
                    "high": float(row.High),
                    "low": float(row.Low),
                    "close": float(row.Close),
                    "volume": int(row.Volume),
                }
            )

        return candles