const gainers = [
  { symbol: "RELIANCE", price: "₹3,124", change: "+2.54%" },
  { symbol: "TCS", price: "₹4,082", change: "+1.84%" },
  { symbol: "INFY", price: "₹1,723", change: "+1.62%" },
  { symbol: "HDFCBANK", price: "₹1,945", change: "+1.41%" },
];

const losers = [
  { symbol: "ADANIENT", price: "₹2,845", change: "-1.18%" },
  { symbol: "BAJAJFINSV", price: "₹1,920", change: "-0.94%" },
  { symbol: "SBIN", price: "₹864", change: "-0.72%" },
  { symbol: "ITC", price: "₹432", change: "-0.51%" },
];

function Card({
  title,
  data,
  positive,
}: {
  title: string;
  data: typeof gainers;
  positive: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: "#111827",
        borderRadius: 16,
        border: "1px solid #1e293b",
        padding: 20,
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: 20,
        }}
      >
        {title}
      </h2>

      {data.map((stock) => (
        <div
          key={stock.symbol}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <div>
            <div
              style={{
                color: "white",
                fontWeight: 600,
              }}
            >
              {stock.symbol}
            </div>

            <div
              style={{
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              {stock.price}
            </div>
          </div>

          <div
            style={{
              color: positive ? "#22c55e" : "#ef4444",
              fontWeight: 700,
            }}
          >
            {stock.change}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TopMovers() {
  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        marginTop: 24,
      }}
    >
      <Card
        title="📈 Top Gainers"
        data={gainers}
        positive={true}
      />

      <Card
        title="📉 Top Losers"
        data={losers}
        positive={false}
      />
    </div>
  );
}