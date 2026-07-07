import math
import logging
from typing import Any

import yfinance as yf


logger = logging.getLogger(__name__)


class FinancialService:

    @staticmethod
    def safe_number(value: Any, default=None):
        """
        Convert external financial values safely into
        JSON-compatible numbers.
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
    def get_first_available(
        info: dict,
        keys: list[str],
    ):
        """
        Return the first valid numeric value from the
        provided financial-data fields.
        """

        for key in keys:

            value = FinancialService.safe_number(
                info.get(key)
            )

            if value is not None:
                return value

        return None


    @staticmethod
    def empty_financial_response(
        symbol: str,
        reason: str,
    ):
        """
        Return a schema-compatible degraded response.

        This allows the production scoring pipeline to continue
        when the upstream financial-data provider is temporarily
        unavailable or rate limited.
        """

        return {
            "symbol": symbol.upper(),

            "company_name": symbol.upper(),

            "currency": "INR",

            "valuation": {
                "market_cap": None,
                "pe_ratio": None,
                "price_to_book": None,
                "eps": None,
                "book_value": None,
            },

            "profitability": {
                "revenue": None,
                "net_income": None,
                "operating_margin": None,
                "profit_margin": None,
                "roe": None,
                "roa": None,
            },

            "balance_sheet": {
                "total_cash": None,
                "total_debt": None,
                "debt_to_equity": None,
                "current_ratio": None,
            },

            "cash_flow": {
                "operating_cash_flow": None,
                "free_cash_flow": None,
            },

            "data_status": "DEGRADED",

            "data_message": reason,
        }


    @staticmethod
    def get_financials(symbol: str):

        normalized_symbol = symbol.strip().upper()

        try:

            ticker = yf.Ticker(normalized_symbol)

            info = ticker.info

            if not info:

                logger.warning(
                    "No financial information returned for %s",
                    normalized_symbol,
                )

                return FinancialService.empty_financial_response(
                    normalized_symbol,
                    "Financial data is temporarily unavailable.",
                )


            # ----------------------------------
            # COMPANY INFORMATION
            # ----------------------------------

            company_name = info.get(
                "longName",
                normalized_symbol,
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
                "symbol": normalized_symbol,

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
                        round(
                            operating_margin * 100,
                            2,
                        )
                        if operating_margin is not None
                        else None
                    ),

                    "profit_margin": (
                        round(
                            profit_margin * 100,
                            2,
                        )
                        if profit_margin is not None
                        else None
                    ),

                    "roe": (
                        round(
                            roe * 100,
                            2,
                        )
                        if roe is not None
                        else None
                    ),

                    "roa": (
                        round(
                            roa * 100,
                            2,
                        )
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
                    "operating_cash_flow":
                        operating_cash_flow,

                    "free_cash_flow":
                        free_cash_flow,
                },

                "data_status": "AVAILABLE",

                "data_message": None,
            }


        except Exception as error:

            error_message = str(error)

            logger.warning(
                "Financial data unavailable for %s: %s",
                normalized_symbol,
                error_message,
            )

            if (
                "Too Many Requests" in error_message
                or "Rate limited" in error_message
                or "429" in error_message
            ):

                reason = (
                    "Financial data provider is temporarily "
                    "rate limited."
                )

            else:

                reason = (
                    "Financial data is temporarily unavailable."
                )

            return FinancialService.empty_financial_response(
                normalized_symbol,
                reason,
            )