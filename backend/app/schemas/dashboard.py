from pydantic import BaseModel


class DashboardQuote(BaseModel):
    symbol: str
    price: float
    change_percent: float


class DashboardResponse(BaseModel):
    indices: list[DashboardQuote]
    watchlist: list[DashboardQuote]