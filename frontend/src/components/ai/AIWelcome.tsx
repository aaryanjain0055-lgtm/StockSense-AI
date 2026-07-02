export default function AIWelcome() {
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1e293b",
        borderRadius: 16,
        padding: 30,
      }}
    >
      <h1
        style={{
          color: "white",
          marginBottom: 20,
          fontSize: 34,
        }}
      >
        🤖 ATLAS AI Advisor
      </h1>

      <p
        style={{
          color: "#cbd5e1",
          lineHeight: 1.8,
          fontSize: 16,
        }}
      >
        Welcome to your intelligent investment assistant.

        This AI combines market analysis, technical indicators,
        machine learning predictions and financial news to provide
        personalized investment guidance.

        Ask questions about any stock, portfolio or market trend.
      </p>

      <div
        style={{
          marginTop: 25,
          background: "#1e293b",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h3
          style={{
            color: "white",
            marginBottom: 14,
          }}
        >
          Example Questions
        </h3>

        <ul
          style={{
            color: "#cbd5e1",
            lineHeight: 2,
            paddingLeft: 20,
          }}
        >
          <li>Should I buy Reliance today?</li>

          <li>Compare TCS and Infosys.</li>

          <li>Analyze my portfolio risk.</li>

          <li>Predict tomorrow's NIFTY movement.</li>

          <li>What are today's biggest market risks?</li>
        </ul>
      </div>
    </div>
  );
}