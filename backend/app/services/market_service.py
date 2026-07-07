import yfinance as yf

from app.data.stocks import STOCK_MASTER


class MarketService:

    @staticmethod
    def search(query: str):

        query = query.lower().strip()

        if not query:
            return []

        results = []

        for stock in STOCK_MASTER:

            if (
                query in stock["symbol"].lower()
                or query in stock["name"].lower()
            ):
                results.append(stock)

        return results[:10]

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
                "company_name": ticker.info.get(
                    "longName",
                    symbol.upper(),
                ),
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
            {
                "symbol": "^NSEI",
                "name": "NIFTY 50",
            },
            {
                "symbol": "^BSESN",
                "name": "SENSEX",
            },
            {
                "symbol": "^NSEBANK",
                "name": "BANK NIFTY",
            },
            {
                "symbol": "^INDIAVIX",
                "name": "INDIA VIX",
            },
        ]

        watchlist = [
            "RELIANCE.NS",
            "TCS.NS",
            "INFY.NS",
            "HDFCBANK.NS",
            "ICICIBANK.NS",
        ]

        return {
            "indices": [
                MarketService.simple_quote(
                    item["symbol"],
                    item["name"],
                )
                for item in indices
            ],
            "watchlist": [
                MarketService.simple_quote(symbol)
                for symbol in watchlist
            ],
        }

    @staticmethod
    def simple_quote(symbol: str, name: str | None = None):

        ticker = yf.Ticker(symbol)

        history = ticker.history(period="2d")

        if history.empty:
            return {
                "symbol": symbol,
                "name": name or symbol,
                "price": 0,
                "change": 0,
                "change_percent": 0,
            }

        latest = history.iloc[-1]

        previous = (
            history.iloc[-2]
            if len(history) > 1
            else latest
        )

        change = latest.Close - previous.Close

        change_percent = (
            change / previous.Close * 100
            if previous.Close
            else 0
        )

        return {
            "symbol": symbol,
            "name": ticker.info.get("longName", name or symbol),
            "price": round(float(latest.Close), 2),
            "change": round(float(change), 2),
            "change_percent": round(float(change_percent), 2),
        }
    @staticmethod
    def get_top_gainers():

        stocks = [
            "RELIANCE.NS",
            "TCS.NS",
            "INFY.NS",
            "HDFCBANK.NS",
            "ICICIBANK.NS",
            "SBIN.NS",
            "ITC.NS",
            "LT.NS",
            "BHARTIARTL.NS",
            "TATAMOTORS.NS",
        ]

        data = [
            MarketService.simple_quote(symbol)
            for symbol in stocks
        ]

        data.sort(
            key=lambda x: x["change_percent"],
            reverse=True,
        )

        return data[:5]
    @staticmethod
    def get_top_losers():

        stocks = [
            "RELIANCE.NS",
            "TCS.NS",
            "INFY.NS",
            "HDFCBANK.NS",
            "ICICIBANK.NS",
            "SBIN.NS",
            "ITC.NS",
            "LT.NS",
            "BHARTIARTL.NS",
            "TATAMOTORS.NS",
        ]

        data = [
            MarketService.simple_quote(symbol)
            for symbol in stocks
        ]

        data.sort(
            key=lambda x: x["change_percent"]
        )

        return data[:5]