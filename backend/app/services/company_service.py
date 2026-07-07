import math

import yfinance as yf


class CompanyService:

    @staticmethod
    def safe_number(value, default=None):

        if value is None:
            return default

        try:
            number = float(value)

            if math.isnan(number) or math.isinf(number):
                return default

            return number

        except (TypeError, ValueError):
            return default


    @staticmethod
    def safe_integer(value, default=None):

        if value is None:
            return default

        try:
            return int(value)

        except (TypeError, ValueError):
            return default


    @staticmethod
    def calculate_52_week_position(
        current_price,
        week_low,
        week_high,
    ):

        if (
            current_price is None
            or week_low is None
            or week_high is None
        ):
            return None

        price_range = week_high - week_low

        if price_range <= 0:
            return None

        position = (
            (current_price - week_low)
            / price_range
        ) * 100

        return round(
            max(0, min(position, 100)),
            2,
        )


    @staticmethod
    def get_company_intelligence(symbol: str):

        try:
            ticker = yf.Ticker(symbol)

            info = ticker.info

            if not info:
                raise ValueError(
                    f"No company information found for {symbol}"
                )


            # ----------------------------------
            # COMPANY PROFILE
            # ----------------------------------

            company_name = info.get(
                "longName",
                symbol.upper(),
            )

            short_name = info.get(
                "shortName",
                company_name,
            )

            sector = info.get(
                "sector",
                "Unknown",
            )

            industry = info.get(
                "industry",
                "Unknown",
            )

            business_summary = info.get(
                "longBusinessSummary",
                "Business description unavailable.",
            )


            # ----------------------------------
            # LOCATION
            # ----------------------------------

            city = info.get("city")

            state = info.get("state")

            country = info.get("country")

            website = info.get("website")


            # ----------------------------------
            # COMPANY SIZE
            # ----------------------------------

            employees = CompanyService.safe_integer(
                info.get("fullTimeEmployees")
            )


            # ----------------------------------
            # MARKET DATA
            # ----------------------------------

            current_price = CompanyService.safe_number(
                info.get("currentPrice")
            )

            previous_close = CompanyService.safe_number(
                info.get("previousClose")
            )

            week_52_low = CompanyService.safe_number(
                info.get("fiftyTwoWeekLow")
            )

            week_52_high = CompanyService.safe_number(
                info.get("fiftyTwoWeekHigh")
            )

            market_cap = CompanyService.safe_number(
                info.get("marketCap")
            )


            # ----------------------------------
            # ANALYST DATA
            # ----------------------------------

            target_low = CompanyService.safe_number(
                info.get("targetLowPrice")
            )

            target_mean = CompanyService.safe_number(
                info.get("targetMeanPrice")
            )

            target_median = CompanyService.safe_number(
                info.get("targetMedianPrice")
            )

            target_high = CompanyService.safe_number(
                info.get("targetHighPrice")
            )

            recommendation_mean = (
                CompanyService.safe_number(
                    info.get("recommendationMean")
                )
            )

            recommendation_key = info.get(
                "recommendationKey"
            )

            analyst_count = CompanyService.safe_integer(
                info.get("numberOfAnalystOpinions")
            )


            # ----------------------------------
            # PRICE POSITION
            # ----------------------------------

            week_52_position = (
                CompanyService.calculate_52_week_position(
                    current_price,
                    week_52_low,
                    week_52_high,
                )
            )


            # ----------------------------------
            # UPSIDE / DOWNSIDE
            # ----------------------------------

            analyst_upside_percent = None

            if (
                current_price is not None
                and current_price > 0
                and target_mean is not None
            ):
                analyst_upside_percent = round(
                    (
                        (
                            target_mean
                            - current_price
                        )
                        / current_price
                    )
                    * 100,
                    2,
                )


            # ----------------------------------
            # RESPONSE
            # ----------------------------------

            return {
                "symbol": symbol.upper(),

                "profile": {
                    "company_name": company_name,
                    "short_name": short_name,
                    "sector": sector,
                    "industry": industry,
                    "business_summary": business_summary,
                    "employees": employees,
                    "website": website,
                },

                "location": {
                    "city": city,
                    "state": state,
                    "country": country,
                },

                "market_position": {
                    "current_price": current_price,
                    "previous_close": previous_close,
                    "market_cap": market_cap,
                    "week_52_low": week_52_low,
                    "week_52_high": week_52_high,
                    "week_52_position_percent": week_52_position,
                },

                "analyst_view": {
                    "target_low": target_low,
                    "target_mean": target_mean,
                    "target_median": target_median,
                    "target_high": target_high,
                    "analyst_upside_percent": analyst_upside_percent,
                    "recommendation_mean": recommendation_mean,
                    "recommendation_key": recommendation_key,
                    "analyst_count": analyst_count,
                },
            }

        except Exception as e:
            raise ValueError(
                f"Unable to fetch company intelligence for "
                f"{symbol}: {str(e)}"
            )