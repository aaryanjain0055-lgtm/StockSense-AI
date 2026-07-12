import {
  useEffect,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import {
  Search,
  LoaderCircle,
} from "lucide-react";

import { searchStocks } from "../../services/marketService";

type Props = {
  onSelect: (symbol: string) => void;
};

type StockResult = {
  symbol: string;
  name: string;
};

export default function StockSearch({
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");

  const [isSearching, setIsSearching] =
    useState(false);

  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const [filteredStocks, setFilteredStocks] =
    useState<StockResult[]>([]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setFilteredStocks([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSearching(true);

        const data = await searchStocks(query);

        setFilteredStocks(data);
      } catch (error) {
        console.error(error);
        setFilteredStocks([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const submitSymbol = (
    rawSymbol: string,
  ) => {
    let symbol = rawSymbol
      .trim()
      .toUpperCase();

    if (!symbol) return;

    if (
      !symbol.includes(".") &&
      !symbol.startsWith("^")
    ) {
      symbol = `${symbol}.NS`;
    }

    onSelect(symbol);

    setQuery(symbol);

    setShowSuggestions(false);
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
          onFocus={() =>
            setShowSuggestions(true)
          }
          onKeyDown={handleKeyDown}
          autoComplete="off"
          placeholder="Search stock, for example RELIANCE or TCS..."
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
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
              Searching
            </span>
          ) : (
            "Analyze"
          )}
        </button>
      </form>

      {showSuggestions &&
        filteredStocks.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              zIndex: 100,
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
              (stock) => (
                <button
                  key={stock.symbol}
                  type="button"
                  onClick={() =>
                    submitSymbol(
                      stock.symbol,
                    )
                  }
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding:
                      "14px 18px",
                    border: "none",
                    borderBottom:
                      "1px solid #1e293b",
                    background:
                      "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "white",
                  }}
                >
                  <Search
                    size={16}
                    color="#64748b"
                  />

                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      {stock.symbol}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "#94a3b8",
                      }}
                    >
                      {stock.name}
                    </div>
                  </div>
                </button>
              ),
            )}
          </div>
        )}
    </div>
  );
}