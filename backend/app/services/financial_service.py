import math

import yfinance as yf


class FinancialService:

    @staticmethod
    def safe_number(value, default=None):
        """
        Convert Yahoo Finance values safely into JSON-compatible numbers.
        """

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
    def get_first_available(info: dict, keys: list[str]):
        """
        Return the first valid value available from a list of Yahoo fields.
        """

        for key in keys:
            value = FinancialService.safe_number(
                info.get(key)
            )

            if value is not None:
                return value

        return None


    @staticmethod
    def get_financials(symbol: str):

        try:
            ticker = yf.Ticker(symbol)

            info = ticker.info

            if not info:
                raise ValueError(
                    f"No financial information found for {symbol}"
                )


            # ----------------------------------
            # COMPANY INFORMATION
            # ----------------------------------

            company_name = info.get(
                "longName",
                symbol.upper(),
            )

            currency = info.get(
                "currency",
                "INR",
            )


            # ----------------------------------
            # VALUATION
            # ----------------------------------

            market_cap = FinancialService.safe_number(
                info.get("marketCap")
            )

            pe_ratio = FinancialService.get_first_available(
                info,
                [
                    "trailingPE",
                    "forwardPE",
                ],
            )

            price_to_book = FinancialService.safe_number(
                info.get("priceToBook")
            )

            eps = FinancialService.get_first_available(
                info,
                [
                    "trailingEps",
                    "forwardEps",
                ],
            )

            book_value = FinancialService.safe_number(
                info.get("bookValue")
            )


            # ----------------------------------
            # PROFITABILITY
            # ----------------------------------

            revenue = FinancialService.safe_number(
                info.get("totalRevenue")
            )

            net_income = FinancialService.get_first_available(
                info,
                [
                    "netIncomeToCommon",
                    "netIncome",
                ],
            )

            operating_margin = FinancialService.safe_number(
                info.get("operatingMargins")
            )

            profit_margin = FinancialService.safe_number(
                info.get("profitMargins")
            )

            roe = FinancialService.safe_number(
                info.get("returnOnEquity")
            )

            roa = FinancialService.safe_number(
                info.get("returnOnAssets")
            )


            # ----------------------------------
            # BALANCE SHEET / DEBT
            # ----------------------------------

            total_cash = FinancialService.safe_number(
                info.get("totalCash")
            )

            total_debt = FinancialService.safe_number(
                info.get("totalDebt")
            )

            debt_to_equity = FinancialService.safe_number(
                info.get("debtToEquity")
            )

            current_ratio = FinancialService.safe_number(
                info.get("currentRatio")
            )


            # ----------------------------------
            # CASH FLOW
            # ----------------------------------

            operating_cash_flow = FinancialService.safe_number(
                info.get("operatingCashflow")
            )

            free_cash_flow = FinancialService.safe_number(
                info.get("freeCashflow")
            )


            # ----------------------------------
            # RESPONSE
            # ----------------------------------

            return {
                "symbol": symbol.upper(),

                "company_name": company_name,

                "currency": currency,

                "valuation": {
                    "market_cap": market_cap,
                    "pe_ratio": pe_ratio,
                    "price_to_book": price_to_book,
                    "eps": eps,
                    "book_value": book_value,
                },

                "profitability": {
                    "revenue": revenue,
                    "net_income": net_income,
                    "operating_margin": (
                        round(operating_margin * 100, 2)
                        if operating_margin is not None
                        else None
                    ),
                    "profit_margin": (
                        round(profit_margin * 100, 2)
                        if profit_margin is not None
                        else None
                    ),
                    "roe": (
                        round(roe * 100, 2)
                        if roe is not None
                        else None
                    ),
                    "roa": (
                        round(roa * 100, 2)
                        if roa is not None
                        else None
                    ),
                },

                "balance_sheet": {
                    "total_cash": total_cash,
                    "total_debt": total_debt,
                    "debt_to_equity": debt_to_equity,
                    "current_ratio": current_ratio,
                },

                "cash_flow": {
                    "operating_cash_flow": operating_cash_flow,
                    "free_cash_flow": free_cash_flow,
                },
            }

        except Exception as e:
            raise ValueError(
                f"Unable to fetch financial data for {symbol}: {str(e)}"
            )