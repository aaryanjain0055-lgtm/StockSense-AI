import logging

import yfinance as yf

from app.services.stock_loader import STOCK_MASTER


logger = logging.getLogger(__name__)


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
    def get_stock_name(
        symbol: str,
        fallback: str | None = None,
    ):
        """
        Resolve names from the local stock master without making
        another external provider request.
        """

        normalized_symbol = symbol.upper()

        for stock in STOCK_MASTER:

            if stock["symbol"].upper() == normalized_symbol:
                return stock["name"]

        return fallback or normalized_symbol


    @staticmethod
    def empty_quote(symbol: str):
        """
        Schema-compatible degraded quote response.
        """

        normalized_symbol = symbol.upper()

        return {
            "symbol": normalized_symbol,
            "company_name": MarketService.get_stock_name(
                normalized_symbol,
                normalized_symbol,
            ),
            "current_price": 0.0,
            "previous_close": 0.0,
            "open_price": 0.0,
            "day_high": 0.0,
            "day_low": 0.0,
            "volume": 0,
            "currency": (
                "INR"
                if normalized_symbol.endswith(".NS")
                or normalized_symbol.endswith(".BO")
                or normalized_symbol.startswith("^NSE")
                or normalized_symbol == "^BSESN"
                or normalized_symbol == "^INDIAVIX"
                else "USD"
            ),
            "data_status": "DEGRADED",
            "data_message":
                "Market quote is temporarily unavailable.",
        }


    @staticmethod
    def get_quote(symbol: str):

        normalized_symbol = symbol.strip().upper()

        try:

            ticker = yf.Ticker(normalized_symbol)

            history = ticker.history(period="2d")

            if history.empty:

                logger.warning(
                    "No quote history returned for %s",
                    normalized_symbol,
                )

                return MarketService.empty_quote(
                    normalized_symbol
                )


            latest = history.iloc[-1]

            previous_close = (
                history["Close"].iloc[-2]
                if len(history) > 1
                else latest["Close"]
            )


            return {
                "symbol": normalized_symbol,

                "company_name":
                    MarketService.get_stock_name(
                        normalized_symbol,
                        normalized_symbol,
                    ),

                "current_price":
                    round(float(latest["Close"]), 2),

                "previous_close":
                    round(float(previous_close), 2),

                "open_price":
                    round(float(latest["Open"]), 2),

                "day_high":
                    round(float(latest["High"]), 2),

                "day_low":
                    round(float(latest["Low"]), 2),

                "volume":
                    int(latest["Volume"]),

                "currency": (
                    "INR"
                    if normalized_symbol.endswith(".NS")
                    or normalized_symbol.endswith(".BO")
                    or normalized_symbol.startswith("^NSE")
                    or normalized_symbol == "^BSESN"
                    or normalized_symbol == "^INDIAVIX"
                    else "USD"
                ),

                "data_status": "AVAILABLE",

                "data_message": None,
            }


        except Exception as error:

            logger.warning(
                "Quote unavailable for %s: %s",
                normalized_symbol,
                str(error),
            )

            return MarketService.empty_quote(
                normalized_symbol
            )


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
        "symbol": "GC=F",
        "name": "GOLD",
    },
    {
        "symbol": "SI=F",
        "name": "SILVER",
    },
]

        watchlist = [
            "RELIANCE.NS",
            "TCS.NS",
            "INFY.NS",
            "HDFCBANK.NS",
            "ICICIBANK.NS",
        ]


        index_data = []

        for item in indices:

            try:
                quote = MarketService.simple_quote(
                    item["symbol"],
                    item["name"],
                )

            except Exception as error:

                logger.warning(
                    "Dashboard index unavailable for %s: %s",
                    item["symbol"],
                    str(error),
                )

                quote = (
                    MarketService.empty_simple_quote(
                        item["symbol"],
                        item["name"],
                    )
                )

            index_data.append(quote)


        watchlist_data = []

        for symbol in watchlist:

            try:
                quote = MarketService.simple_quote(
                    symbol
                )

            except Exception as error:

                logger.warning(
                    "Watchlist quote unavailable for %s: %s",
                    symbol,
                    str(error),
                )

                quote = (
                    MarketService.empty_simple_quote(
                        symbol
                    )
                )

            watchlist_data.append(quote)


        return {
            "indices": index_data,
            "watchlist": watchlist_data,
        }


    @staticmethod
    def empty_simple_quote(
        symbol: str,
        name: str | None = None,
    ):

        normalized_symbol = symbol.upper()

        return {
            "symbol": normalized_symbol,

            "name": (
                name
                or MarketService.get_stock_name(
                    normalized_symbol,
                    normalized_symbol,
                )
            ),

            "price": 0.0,

            "change": 0.0,

            "change_percent": 0.0,

            "data_status": "DEGRADED",
        }


    @staticmethod
    def simple_quote(
        symbol: str,
        name: str | None = None,
    ):

        normalized_symbol = symbol.strip().upper()

        try:

            ticker = yf.Ticker(normalized_symbol)

            history = ticker.history(period="2d")

            if history.empty:

                return MarketService.empty_simple_quote(
                    normalized_symbol,
                    name,
                )


            latest = history.iloc[-1]

            previous = (
                history.iloc[-2]
                if len(history) > 1
                else latest
            )

            latest_close = float(latest["Close"])

            previous_close = float(
                previous["Close"]
            )

            change = (
                latest_close
                - previous_close
            )

            change_percent = (
                change
                / previous_close
                * 100
                if previous_close
                else 0
            )


            return {
                "symbol": normalized_symbol,

                "name": (
                    name
                    or MarketService.get_stock_name(
                        normalized_symbol,
                        normalized_symbol,
                    )
                ),

                "price":
                    round(latest_close, 2),

                "change":
                    round(change, 2),

                "change_percent":
                    round(change_percent, 2),

                "data_status": "AVAILABLE",
            }


        except Exception as error:

            logger.warning(
                "Simple quote unavailable for %s: %s",
                normalized_symbol,
                str(error),
            )

            return MarketService.empty_simple_quote(
                normalized_symbol,
                name,
            )


    @staticmethod
    def get_top_mover_symbols():

        return [
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


    @staticmethod
    def get_top_gainers():

        data = [
            MarketService.simple_quote(symbol)
            for symbol
            in MarketService.get_top_mover_symbols()
        ]

        available_data = [
            item
            for item in data
            if item.get("data_status") == "AVAILABLE"
        ]

        available_data.sort(
            key=lambda item:
                item["change_percent"],
            reverse=True,
        )

        return available_data[:5]


    @staticmethod
    def get_top_losers():

        data = [
            MarketService.simple_quote(symbol)
            for symbol
            in MarketService.get_top_mover_symbols()
        ]

        available_data = [
            item
            for item in data
            if item.get("data_status") == "AVAILABLE"
        ]

        available_data.sort(
            key=lambda item:
                item["change_percent"]
        )

        return available_data[:5]