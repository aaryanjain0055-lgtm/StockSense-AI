from pydantic import BaseModel


class Candle(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int