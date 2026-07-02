const news = [
  {
    title: "NIFTY closes higher amid strong IT buying",
    source: "Economic Times",
    time: "15 mins ago",
  },
  {
    title: "Gold prices touch new monthly high",
    source: "Moneycontrol",
    time: "30 mins ago",
  },
  {
    title: "RBI keeps repo rate unchanged",
    source: "Business Standard",
    time: "1 hour ago",
  },
  {
    title: "Reliance announces new renewable investment",
    source: "CNBC TV18",
    time: "2 hours ago",
  },
];

export default function NewsCard() {
  return (
    <div
      style={{
        marginTop: 24,
        background: "#111827",
        border: "1px solid #1e293b",
        borderRadius: 16,
        padding: 24,
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: 20,
        }}
      >
        📰 Latest Market News
      </h2>

      {news.map((item, index) => (
        <div
          key={index}
          style={{
            padding: "16px 0",
            borderBottom:
              index === news.length - 1
                ? "none"
                : "1px solid #1e293b",
          }}
        >
          <h3
            style={{
              color: "white",
              fontSize: 17,
              marginBottom: 6,
            }}
          >
            {item.title}
          </h3>

          <p
            style={{
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            {item.source} • {item.time}
          </p>
        </div>
      ))}
    </div>
  );
}