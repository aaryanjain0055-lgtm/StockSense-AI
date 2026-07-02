from pydantic import BaseModel


class MarketQuote(BaseModel):
    symbol: str
    company_name: str
    current_price: float
    previous_close: float
    open_price: float
    day_high: float
    day_low: float
    volume: int
    currency: str