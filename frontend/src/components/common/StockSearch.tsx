import {
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import {
  Search,
  LoaderCircle,
} from "lucide-react";

type Props = {
  onSelect: (symbol: string) => void;
};

const POPULAR_STOCKS = [
  "RELIANCE.NS",
  "TCS.NS",
  "INFY.NS",
  "HDFCBANK.NS",
  "ICICIBANK.NS",
  "SBIN.NS",
  "ITC.NS",
  "LT.NS",
];

export default function StockSearch({
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] =
    useState(false);

  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const filteredStocks = POPULAR_STOCKS.filter(
    (symbol) =>
      symbol
        .toLowerCase()
        .includes(query.toLowerCase()),
  );

  const submitSymbol = (
    rawSymbol: string,
  ) => {
    let symbol = rawSymbol
      .trim()
      .toUpperCase();

    if (!symbol) {
      return;
    }

    setIsSearching(true);

    if (
      !symbol.includes(".") &&
      !symbol.startsWith("^")
    ) {
      symbol = `${symbol}.NS`;
    }

    onSelect(symbol);

    setQuery(symbol);
    setShowSuggestions(false);
    setIsSearching(false);
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    submitSymbol(query);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "#111827",
          border: "1px solid #1e293b",
          borderRadius: 12,
          padding: "10px 12px 10px 18px",
        }}
      >
        <Search
          size={20}
          color="#94a3b8"
        />

        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search stock, for example RELIANCE or TCS..."
          autoComplete="off"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#f8fafc",
            fontSize: 15,
            padding: "6px 0",
          }}
        />

        <button
          type="submit"
          disabled={
            !query.trim() ||
            isSearching
          }
          style={{
            minWidth: 100,
            border: "none",
            borderRadius: 8,
            background: "#2563eb",
            color: "white",
            fontWeight: 600,
            padding: "10px 16px",
            cursor: "pointer",
          }}
        >
          {isSearching ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <LoaderCircle size={16} />
              Loading
            </span>
          ) : (
            "Analyze"
          )}
        </button>
      </form>

      {showSuggestions &&
        query.trim() &&
        filteredStocks.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              zIndex: 50,
              background: "#111827",
              border:
                "1px solid #1e293b",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow:
                "0 16px 40px rgba(0,0,0,0.35)",
            }}
          >
            {filteredStocks.map(
              (symbol) => (
                <button
                  key={symbol}
                  type="button"
                  onClick={() =>
                    submitSymbol(symbol)
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    border: "none",
                    borderBottom:
                      "1px solid #1e293b",
                    background:
                      "transparent",
                    color: "#e2e8f0",
                    padding:
                      "13px 18px",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <Search
                    size={15}
                    color="#64748b"
                  />

                  <span
                    style={{
                      marginLeft: 10,
                      fontWeight: 600,
                    }}
                  >
                    {symbol}
                  </span>
                </button>
              ),
            )}
          </div>
        )}
    </div>
  );
}