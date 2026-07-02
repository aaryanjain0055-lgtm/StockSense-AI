import { Send } from "lucide-react";

const messages = [
  {
    sender: "user",
    text: "Should I buy Reliance today?",
  },
  {
    sender: "ai",
    text: "Based on technical indicators, positive momentum and the latest prediction model, Reliance currently has a BUY recommendation with moderate risk. Always verify with your investment strategy before trading.",
  },
];

export default function AIChat() {
  return (
    <div
      style={{
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
        💬 AI Investment Chat
      </h2>

      <div
        style={{
          height: 320,
          overflowY: "auto",
          background: "#0f172a",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: 18,
              textAlign: msg.sender === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                maxWidth: "75%",
                padding: "14px 18px",
                borderRadius: 14,
                background:
                  msg.sender === "user"
                    ? "#2563eb"
                    : "#1e293b",
                color: "white",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
        }}
      >
        <input
          placeholder="Ask the AI about any stock..."
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 10,
            border: "1px solid #334155",
            background: "#0f172a",
            color: "white",
            outline: "none",
          }}
        />

        <button
          style={{
            background: "#2563eb",
            border: "none",
            borderRadius: 10,
            padding: "0 18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Send color="white" size={18} />
        </button>
      </div>
    </div>
  );
}