import yfinance as yf


class MarketService:

    @staticmethod
    def get_quote(symbol: str):

        try:
            ticker = yf.Ticker(symbol)

            history = ticker.history(period="2d")

            if history.empty:
                raise ValueError("Invalid stock symbol")

            info = ticker.fast_info

            previous_close = (
                history["Close"].iloc[-2]
                if len(history) > 1
                else history["Close"].iloc[-1]
            )

            return {
                "symbol": symbol.upper(),
                "company_name": ticker.info.get("longName", symbol.upper()),
                "current_price": float(history["Close"].iloc[-1]),
                "previous_close": float(previous_close),
                "open_price": float(history["Open"].iloc[-1]),
                "day_high": float(history["High"].iloc[-1]),
                "day_low": float(history["Low"].iloc[-1]),
                "volume": int(history["Volume"].iloc[-1]),
                "currency": info.get("currency", "USD"),
            }

        except Exception as e:
            raise ValueError(str(e))
    @staticmethod
    def get_dashboard():

        indices = [
            "^NSEI",      # NIFTY 50
            "^BSESN",     # Sensex
            "^GSPC",      # S&P 500
            "^IXIC",      # Nasdaq
        ]

        watchlist = [
            "AAPL",
            "MSFT",
            "NVDA",
            "GOOGL",
            "TSLA",
        ]

        return {
            "indices": [
                MarketService.simple_quote(symbol)
                for symbol in indices
            ],
            "watchlist": [
                MarketService.simple_quote(symbol)
                for symbol in watchlist
            ],
        }

    @staticmethod
    def simple_quote(symbol: str):

        ticker = yf.Ticker(symbol)

        history = ticker.history(period="2d")

        latest = history.iloc[-1]
        previous = history.iloc[-2]

        change = (
            (latest.Close - previous.Close)
            / previous.Close
        ) * 100

        return {
            "symbol": symbol,
            "price": round(float(latest.Close), 2),
            "change_percent": round(float(change), 2),
        }