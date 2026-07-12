import csv
from pathlib import Path

STOCK_MASTER = []


def load_stock_master():
    global STOCK_MASTER

    csv_file = Path(__file__).parent.parent / "data" / "nse_equity.csv"

    STOCK_MASTER.clear()

    with open(csv_file, encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:

            symbol = row.get("SYMBOL")
            name = row.get("NAME OF COMPANY")

            if not symbol or not name:
                continue

            STOCK_MASTER.append(
                {
                    "symbol": f"{symbol.strip().upper()}.NS",
                    "name": name.strip(),
                }
            )

    print(f"Loaded {len(STOCK_MASTER)} NSE Stocks")