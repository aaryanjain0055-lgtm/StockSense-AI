import { Bell, Search, Sun, CircleDot } from "lucide-react";

export default function Navbar() {
  return (
    <header
      style={{
        height: 72,
        background: "#111827",
        borderBottom: "1px solid #1e293b",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
      }}
    >
      {/* Left */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#1e293b",
            padding: "10px 14px",
            borderRadius: 10,
            width: 320,
            color: "#94a3b8",
          }}
        >
          <Search size={18} />

          <input
            placeholder="Search Stocks..."
            style={{
              marginLeft: 10,
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              color: "white",
              fontSize: 14,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#22c55e",
            fontWeight: 600,
          }}
        >
          <CircleDot size={12} />

          Market Open
        </div>
      </div>

      {/* Right */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <Bell size={20} color="white" />

        <Sun size={20} color="white" />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "#2563eb",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              color: "white",
            }}
          >
            A
          </div>

          <div>
            <div
              style={{
                color: "white",
                fontWeight: 600,
              }}
            >
              Aaryan
            </div>

            <div
              style={{
                color: "#94a3b8",
                fontSize: 12,
              }}
            >
              Premium User
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}