from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
)


# ============================================================
# PORTFOLIO HOLDING CREATE
# ============================================================


class PortfolioHoldingCreate(BaseModel):
    symbol: str

    company_name: str | None = None

    quantity: float = Field(
        gt=0,
    )

    average_buy_price: float = Field(
        gt=0,
    )

    purchase_date: datetime | None = None

    notes: str | None = Field(
        default=None,
        max_length=500,
    )


    @field_validator("symbol")
    @classmethod
    def normalize_symbol(
        cls,
        value: str,
    ) -> str:

        symbol = (
            value
            .strip()
            .upper()
        )

        if not symbol:
            raise ValueError(
                "Stock symbol cannot be empty"
            )

        return symbol


# ============================================================
# PORTFOLIO HOLDING UPDATE
# ============================================================


class PortfolioHoldingUpdate(BaseModel):
    company_name: str | None = None

    quantity: float | None = Field(
        default=None,
        gt=0,
    )

    average_buy_price: float | None = Field(
        default=None,
        gt=0,
    )

    purchase_date: datetime | None = None

    notes: str | None = Field(
        default=None,
        max_length=500,
    )


# ============================================================
# PORTFOLIO HOLDING RESPONSE
# ============================================================


class PortfolioHoldingResponse(BaseModel):
    id: int

    portfolio_id: int

    symbol: str

    company_name: str | None

    quantity: float

    average_buy_price: float

    purchase_date: datetime | None

    notes: str | None

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


# ============================================================
# PORTFOLIO CREATE
# ============================================================


class PortfolioCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )


    @field_validator("name")
    @classmethod
    def clean_name(
        cls,
        value: str,
    ) -> str:

        name = value.strip()

        if not name:
            raise ValueError(
                "Portfolio name cannot be empty"
            )

        return name


# ============================================================
# PORTFOLIO UPDATE
# ============================================================


class PortfolioUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )


# ============================================================
# PORTFOLIO RESPONSE
# ============================================================


class PortfolioResponse(BaseModel):
    id: int

    user_id: int

    name: str

    description: str | None

    created_at: datetime

    updated_at: datetime

    holdings: list[
        PortfolioHoldingResponse
    ] = Field(
        default_factory=list,
    )

    model_config = ConfigDict(
        from_attributes=True,
    )


# ============================================================
# HOLDING ANALYTICS
# ============================================================


class PortfolioHoldingAnalytics(BaseModel):
    id: int

    symbol: str

    company_name: str | None

    quantity: float

    average_buy_price: float

    current_price: float | None

    invested_value: float

    current_value: float | None

    profit_loss: float | None

    profit_loss_percent: float | None

    data_status: str


# ============================================================
# PORTFOLIO ANALYTICS RESPONSE
# ============================================================


class PortfolioAnalyticsResponse(BaseModel):
    portfolio_id: int

    portfolio_name: str

    total_invested: float

    priced_invested_value: float

    total_current_value: float

    total_profit_loss: float

    total_profit_loss_percent: float

    holdings_count: int

    priced_holdings_count: int

    unavailable_holdings_count: int

    analytics_status: str

    holdings: list[
        PortfolioHoldingAnalytics
    ] = Field(
        default_factory=list,
    )