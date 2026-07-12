import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StockSearch from "../common/StockSearch";

export default function Navbar() {
  const navigate = useNavigate();

  function handleStockSelect(symbol: string) {
    const normalizedSymbol =
      symbol.trim().toUpperCase();

    if (!normalizedSymbol) return;

    window.dispatchEvent(
      new CustomEvent(
        "stock-symbol-selected",
        {
          detail: {
            symbol: normalizedSymbol,
          },
        }
      )
    );

    navigate("/stocks");
  }

  return (
    <header
      style={{
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        padding: "0 28px",
        background: "#0f172a",
        borderBottom: "1px solid #1e293b",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          flex: 1,
          maxWidth: 620,
        }}
      >
        <StockSearch
          onSelect={handleStockSelect}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <button
          type="button"
          aria-label="Notifications"
          style={{
            width: 42,
            height: 42,
            display: "grid",
            placeItems: "center",
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: 10,
            color: "#94a3b8",
            cursor: "pointer",
          }}
        >
          <Bell size={20} />
        </button>

        <div
          style={{
            width: 40,
            height: 40,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg,#2563eb,#7c3aed)",
            color: "white",
            fontWeight: 700,
          }}
        >
          A
        </div>
      </div>
    </header>
  );
}