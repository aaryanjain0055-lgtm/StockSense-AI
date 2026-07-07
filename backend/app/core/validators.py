import re

from fastapi import HTTPException


# Supports examples such as:
# RELIANCE.NS
# TCS.NS
# AAPL
# BRK-B
# ^NSEI
# ^BSESN

SYMBOL_PATTERN = re.compile(
    r"^[A-Za-z0-9^][A-Za-z0-9.\-^]{0,19}$"
)


def validate_stock_symbol(
    symbol: str,
) -> str:

    cleaned_symbol = (
        symbol
        .strip()
        .upper()
    )

    if not cleaned_symbol:
        raise HTTPException(
            status_code=400,
            detail="Stock symbol cannot be empty.",
        )

    if len(cleaned_symbol) > 20:
        raise HTTPException(
            status_code=400,
            detail=(
                "Stock symbol exceeds "
                "the maximum allowed length."
            ),
        )

    if not SYMBOL_PATTERN.fullmatch(
        cleaned_symbol
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid stock symbol format."
            ),
        )

    return cleaned_symbol
