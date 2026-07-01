import StatCard from "./cards/StatCard";

export default function Hero() {
  return (
    <>
      <div
        style={{
          background: "#2563eb",
          borderRadius: 16,
          padding: 30,
          color: "white",
          marginBottom: 25,
        }}
      >
        <h1
          style={{
            fontSize: 34,
            marginBottom: 10,
          }}
        >
          Welcome Back, Aaryan 👋
        </h1>

        <p
          style={{
            opacity: .9,
            fontSize: 18,
          }}
        >
          AI Market Insight
        </p>

        <p
          style={{
            marginTop: 10,
            fontSize: 15,
            opacity: .9,
          }}
        >
          NIFTY is expected to remain bullish today.
          Banking and IT sectors show strong momentum.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 20,
        }}
      >
        <StatCard
          title="NIFTY 50"
          value="25,312"
          change="+1.28%"
        />

        <StatCard
          title="SENSEX"
          value="82,145"
          change="+0.84%"
        />

        <StatCard
          title="GOLD"
          value="₹98,420"
          change="+0.52%"
        />

        <StatCard
          title="USD / INR"
          value="₹85.41"
          change="-0.18%"
          positive={false}
        />
      </div>
    </>
  );
}