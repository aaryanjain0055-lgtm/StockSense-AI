from sqlalchemy import select
from sqlalchemy.orm import (
    Session,
    selectinload,
)

from app.models.portfolio import (
    Portfolio,
    PortfolioHolding,
)

from app.schemas.portfolio import (
    PortfolioCreate,
    PortfolioHoldingCreate,
    PortfolioHoldingUpdate,
    PortfolioUpdate,
)

from app.services.market_service import (
    MarketService,
)


class PortfolioService:

    # ============================================================
    # INTERNAL HELPERS
    # ============================================================

    @staticmethod
    def _get_portfolio_query():
        return select(Portfolio).options(
            selectinload(
                Portfolio.holdings
            )
        )


    @staticmethod
    def get_owned_portfolio(
        db: Session,
        user_id: int,
        portfolio_id: int,
    ) -> Portfolio:

        statement = (
            PortfolioService
            ._get_portfolio_query()
            .where(
                Portfolio.id
                == portfolio_id,

                Portfolio.user_id
                == user_id,
            )
        )

        portfolio = (
            db.execute(statement)
            .scalars()
            .first()
        )

        if portfolio is None:
            raise ValueError(
                "Portfolio not found"
            )

        return portfolio


    @staticmethod
    def get_owned_holding(
        db: Session,
        user_id: int,
        portfolio_id: int,
        holding_id: int,
    ) -> PortfolioHolding:

        PortfolioService.get_owned_portfolio(
            db=db,
            user_id=user_id,
            portfolio_id=portfolio_id,
        )

        statement = (
            select(PortfolioHolding)
            .where(
                PortfolioHolding.id
                == holding_id,

                PortfolioHolding.portfolio_id
                == portfolio_id,
            )
        )

        holding = (
            db.execute(statement)
            .scalars()
            .first()
        )

        if holding is None:
            raise ValueError(
                "Portfolio holding not found"
            )

        return holding


    # ============================================================
    # CREATE PORTFOLIO
    # ============================================================

    @staticmethod
    def create_portfolio(
        db: Session,
        user_id: int,
        payload: PortfolioCreate,
    ) -> Portfolio:

        portfolio = Portfolio(
            user_id=user_id,
            name=payload.name,
            description=payload.description,
        )

        db.add(portfolio)
        db.commit()
        db.refresh(portfolio)

        return (
            PortfolioService
            .get_owned_portfolio(
                db=db,
                user_id=user_id,
                portfolio_id=portfolio.id,
            )
        )


    # ============================================================
    # LIST USER PORTFOLIOS
    # ============================================================

    @staticmethod
    def list_portfolios(
        db: Session,
        user_id: int,
    ) -> list[Portfolio]:

        statement = (
            PortfolioService
            ._get_portfolio_query()
            .where(
                Portfolio.user_id
                == user_id
            )
            .order_by(
                Portfolio.created_at.desc()
            )
        )

        return list(
            db.execute(statement)
            .scalars()
            .all()
        )


    # ============================================================
    # GET SINGLE PORTFOLIO
    # ============================================================

    @staticmethod
    def get_portfolio(
        db: Session,
        user_id: int,
        portfolio_id: int,
    ) -> Portfolio:

        return (
            PortfolioService
            .get_owned_portfolio(
                db=db,
                user_id=user_id,
                portfolio_id=portfolio_id,
            )
        )


    # ============================================================
    # UPDATE PORTFOLIO
    # ============================================================

    @staticmethod
    def update_portfolio(
        db: Session,
        user_id: int,
        portfolio_id: int,
        payload: PortfolioUpdate,
    ) -> Portfolio:

        portfolio = (
            PortfolioService
            .get_owned_portfolio(
                db=db,
                user_id=user_id,
                portfolio_id=portfolio_id,
            )
        )

        update_data = payload.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(
                portfolio,
                field,
                value,
            )

        db.commit()

        return (
            PortfolioService
            .get_owned_portfolio(
                db=db,
                user_id=user_id,
                portfolio_id=portfolio_id,
            )
        )


    # ============================================================
    # DELETE PORTFOLIO
    # ============================================================

    @staticmethod
    def delete_portfolio(
        db: Session,
        user_id: int,
        portfolio_id: int,
    ) -> None:

        portfolio = (
            PortfolioService
            .get_owned_portfolio(
                db=db,
                user_id=user_id,
                portfolio_id=portfolio_id,
            )
        )

        db.delete(portfolio)
        db.commit()


    # ============================================================
    # ADD HOLDING
    # ============================================================

    @staticmethod
    def add_holding(
        db: Session,
        user_id: int,
        portfolio_id: int,
        payload: PortfolioHoldingCreate,
    ) -> PortfolioHolding:

        PortfolioService.get_owned_portfolio(
            db=db,
            user_id=user_id,
            portfolio_id=portfolio_id,
        )

        normalized_symbol = (
            payload.symbol
            .strip()
            .upper()
        )

        duplicate_statement = (
            select(PortfolioHolding)
            .where(
                PortfolioHolding.portfolio_id
                == portfolio_id,

                PortfolioHolding.symbol
                == normalized_symbol,
            )
        )

        existing_holding = (
            db.execute(
                duplicate_statement
            )
            .scalars()
            .first()
        )

        if existing_holding is not None:
            raise ValueError(
                "This stock already exists in the portfolio"
            )

        company_name = (
            payload.company_name
            or MarketService.get_stock_name(
                normalized_symbol,
                normalized_symbol,
            )
        )

        holding = PortfolioHolding(
            portfolio_id=portfolio_id,
            symbol=normalized_symbol,
            company_name=company_name,
            quantity=payload.quantity,
            average_buy_price=(
                payload.average_buy_price
            ),
            purchase_date=(
                payload.purchase_date
            ),
            notes=payload.notes,
        )

        db.add(holding)
        db.commit()
        db.refresh(holding)

        return holding


    # ============================================================
    # UPDATE HOLDING
    # ============================================================

    @staticmethod
    def update_holding(
        db: Session,
        user_id: int,
        portfolio_id: int,
        holding_id: int,
        payload: PortfolioHoldingUpdate,
    ) -> PortfolioHolding:

        holding = (
            PortfolioService
            .get_owned_holding(
                db=db,
                user_id=user_id,
                portfolio_id=portfolio_id,
                holding_id=holding_id,
            )
        )

        update_data = payload.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(
                holding,
                field,
                value,
            )

        db.commit()
        db.refresh(holding)

        return holding


    # ============================================================
    # DELETE HOLDING
    # ============================================================

    @staticmethod
    def delete_holding(
        db: Session,
        user_id: int,
        portfolio_id: int,
        holding_id: int,
    ) -> None:

        holding = (
            PortfolioService
            .get_owned_holding(
                db=db,
                user_id=user_id,
                portfolio_id=portfolio_id,
                holding_id=holding_id,
            )
        )

        db.delete(holding)
        db.commit()


    # ============================================================
    # PORTFOLIO ANALYTICS
    # ============================================================

    @staticmethod
    def get_portfolio_analytics(
        db: Session,
        user_id: int,
        portfolio_id: int,
    ) -> dict:

        portfolio = (
            PortfolioService
            .get_owned_portfolio(
                db=db,
                user_id=user_id,
                portfolio_id=portfolio_id,
            )
        )

        analytics_holdings = []

        # Cost of every holding in the portfolio.
        total_invested = 0.0

        # Cost basis only for holdings with available live prices.
        priced_invested_value = 0.0

        # Market value only for holdings with available live prices.
        total_current_value = 0.0

        priced_holdings_count = 0
        unavailable_holdings_count = 0


        for holding in portfolio.holdings:

            quantity = float(
                holding.quantity
            )

            average_buy_price = float(
                holding.average_buy_price
            )

            invested_value = (
                quantity
                * average_buy_price
            )

            total_invested += (
                invested_value
            )


            current_price = None
            current_value = None
            profit_loss = None
            profit_loss_percent = None
            data_status = "UNAVAILABLE"


            try:
                quote = (
                    MarketService
                    .get_quote(
                        holding.symbol
                    )
                )

                quote_available = (
                    quote.get("data_status")
                    == "AVAILABLE"
                    and quote.get(
                        "current_price"
                    )
                    is not None
                )

            except Exception:
                quote_available = False


            if quote_available:

                current_price = float(
                    quote["current_price"]
                )

                current_value = (
                    quantity
                    * current_price
                )

                profit_loss = (
                    current_value
                    - invested_value
                )

                profit_loss_percent = (
                    (
                        profit_loss
                        / invested_value
                    )
                    * 100
                    if invested_value > 0
                    else 0.0
                )

                priced_invested_value += (
                    invested_value
                )

                total_current_value += (
                    current_value
                )

                priced_holdings_count += 1

                data_status = "AVAILABLE"

            else:

                unavailable_holdings_count += 1


            analytics_holdings.append(
                {
                    "id": holding.id,

                    "symbol": (
                        holding.symbol
                    ),

                    "company_name": (
                        holding.company_name
                    ),

                    "quantity": round(
                        quantity,
                        4,
                    ),

                    "average_buy_price": round(
                        average_buy_price,
                        2,
                    ),

                    "current_price": (
                        round(
                            current_price,
                            2,
                        )
                        if current_price
                        is not None
                        else None
                    ),

                    "invested_value": round(
                        invested_value,
                        2,
                    ),

                    "current_value": (
                        round(
                            current_value,
                            2,
                        )
                        if current_value
                        is not None
                        else None
                    ),

                    "profit_loss": (
                        round(
                            profit_loss,
                            2,
                        )
                        if profit_loss
                        is not None
                        else None
                    ),

                    "profit_loss_percent": (
                        round(
                            profit_loss_percent,
                            2,
                        )
                        if profit_loss_percent
                        is not None
                        else None
                    ),

                    "data_status": (
                        data_status
                    ),
                }
            )


        if priced_holdings_count > 0:

            total_profit_loss = (
                total_current_value
                - priced_invested_value
            )

            total_profit_loss_percent = (
                (
                    total_profit_loss
                    / priced_invested_value
                )
                * 100
                if priced_invested_value > 0
                else 0.0
            )

        else:

            total_profit_loss = 0.0
            total_profit_loss_percent = 0.0


        if unavailable_holdings_count == 0:
            analytics_status = "COMPLETE"

        elif priced_holdings_count == 0:
            analytics_status = "UNAVAILABLE"

        else:
            analytics_status = "PARTIAL"


        return {
            "portfolio_id": portfolio.id,

            "portfolio_name": (
                portfolio.name
            ),

            "total_invested": round(
                total_invested,
                2,
            ),

            "priced_invested_value": round(
                priced_invested_value,
                2,
            ),

            "total_current_value": round(
                total_current_value,
                2,
            ),

            "total_profit_loss": round(
                total_profit_loss,
                2,
            ),

            "total_profit_loss_percent": round(
                total_profit_loss_percent,
                2,
            ),

            "holdings_count": len(
                portfolio.holdings
            ),

            "priced_holdings_count": (
                priced_holdings_count
            ),

            "unavailable_holdings_count": (
                unavailable_holdings_count
            ),

            "analytics_status": (
                analytics_status
            ),

            "holdings": (
                analytics_holdings
            ),
        }