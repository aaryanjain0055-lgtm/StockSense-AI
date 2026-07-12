import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bot,
  Loader2,
  Send,
  Sparkles,
  User,
} from "lucide-react";

import api from "../../services/api";


type Props = {
  symbol?: string;
};


type ChatMessage = {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
};


type ChatResponse = {
  answer?: string;
  response?: string;
  message?: string;
  symbol?: string | null;
  intent?: string;
  sources?: string[];
};


const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome-message",
  sender: "ai",
  text:
    "Hello! I can help analyze stocks, market trends, technical indicators, fundamentals, sentiment, risk, and portfolio performance. Ask me a market question to begin.",
  timestamp: new Date(),
};


export default function AIChat({
  symbol = "RELIANCE.NS",
}: Props) {
  const [
    messages,
    setMessages,
  ] = useState<ChatMessage[]>([
    INITIAL_MESSAGE,
  ]);


  const [
    input,
    setInput,
  ] = useState("");


  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );


  const messagesEndRef =
    useRef<HTMLDivElement | null>(
      null,
    );


  // ====================================================
  // AUTO SCROLL
  // ====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);


  // ====================================================
  // SEND MESSAGE
  // ====================================================

  async function sendMessage(
    event?: FormEvent,
  ) {
    event?.preventDefault();


    const question = input.trim();


    if (!question || isLoading) {
      return;
    }


    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: question,
      timestamp: new Date(),
    };


    setMessages((current) => [
      ...current,
      userMessage,
    ]);


    setInput("");

    setError(null);

    setIsLoading(true);


    try {
      const response =
        await api.post<ChatResponse>(
          "/advisor/chat",
          {
            question,
            symbol,
          },
        );


      const answer =
        response.data.answer ||
        response.data.response ||
        response.data.message;


      if (!answer) {
        throw new Error(
          "The advisor returned an empty response.",
        );
      }


      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: answer,
        timestamp: new Date(),
      };


      setMessages((current) => [
        ...current,
        aiMessage,
      ]);
    } catch (requestError) {
      console.error(
        "AI advisor chat request failed:",
        requestError,
      );


      setError(
        "The AI Advisor could not complete this request. Please try again.",
      );


      const failureMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: "ai",
        text:
          "I could not retrieve enough live analytical data to answer that question reliably. Please try again in a moment.",
        timestamp: new Date(),
      };


      setMessages((current) => [
        ...current,
        failureMessage,
      ]);
    } finally {
      setIsLoading(false);
    }
  }


  // ====================================================
  // QUICK QUESTIONS
  // ====================================================

  const quickQuestions = [
    `Analyze ${symbol}`,
    `What are the risks in ${symbol}?`,
    `Explain the technical trend of ${symbol}`,
    "What is today's market outlook?",
  ];


  function selectQuickQuestion(
    question: string,
  ) {
    setInput(question);
  }


  // ====================================================
  // UI
  // ====================================================

  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1e293b",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <div
        style={{
          padding: "20px 24px",
          borderBottom:
            "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: "#172554",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bot
              size={22}
              color="#60a5fa"
            />
          </div>


          <div>
            <h2
              style={{
                color: "white",
                margin: 0,
                fontSize: 20,
              }}
            >
              AI Investment Chat
            </h2>


            <p
              style={{
                color: "#64748b",
                margin:
                  "5px 0 0 0",
                fontSize: 13,
              }}
            >
              Ask questions using live
              StockSense analytical data
            </p>
          </div>
        </div>


        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "7px 11px",
            borderRadius: 20,
            background: "#052e16",
            border:
              "1px solid #166534",
            color: "#4ade80",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <Sparkles size={14} />

          Analysis Ready
        </div>
      </div>


      {/* ============================================= */}
      {/* QUICK QUESTIONS */}
      {/* ============================================= */}

      <div
        style={{
          padding: "16px 24px",
          borderBottom:
            "1px solid #1e293b",
        }}
      >
        <p
          style={{
            color: "#64748b",
            fontSize: 12,
            margin:
              "0 0 10px 0",
          }}
        >
          Suggested questions
        </p>


        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {quickQuestions.map(
            (question) => (
              <button
                key={question}
                type="button"
                onClick={() =>
                  selectQuickQuestion(
                    question,
                  )
                }
                style={{
                  padding:
                    "8px 11px",
                  background:
                    "#0f172a",
                  border:
                    "1px solid #334155",
                  borderRadius: 8,
                  color: "#cbd5e1",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                {question}
              </button>
            ),
          )}
        </div>
      </div>


      {/* ============================================= */}
      {/* MESSAGES */}
      {/* ============================================= */}

      <div
        style={{
          height: 420,
          overflowY: "auto",
          background: "#0f172a",
          padding: 24,
        }}
      >
        {messages.map((message) => {
          const isUser =
            message.sender === "user";


          return (
            <div
              key={message.id}
              style={{
                display: "flex",
                justifyContent: isUser
                  ? "flex-end"
                  : "flex-start",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems:
                    "flex-start",
                  gap: 10,
                  flexDirection: isUser
                    ? "row-reverse"
                    : "row",
                  maxWidth: "82%",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    minWidth: 34,
                    borderRadius: 9,
                    background: isUser
                      ? "#2563eb"
                      : "#1e293b",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                  }}
                >
                  {isUser ? (
                    <User
                      size={17}
                      color="white"
                    />
                  ) : (
                    <Bot
                      size={17}
                      color="#60a5fa"
                    />
                  )}
                </div>


                <div>
                  <div
                    style={{
                      padding:
                        "13px 16px",
                      borderRadius: 12,
                      background: isUser
                        ? "#2563eb"
                        : "#1e293b",
                      border: isUser
                        ? "none"
                        : "1px solid #334155",
                      color: "#f8fafc",
                      lineHeight: 1.65,
                      fontSize: 14,
                      whiteSpace:
                        "pre-wrap",
                    }}
                  >
                    {message.text}
                  </div>


                  <p
                    style={{
                      margin:
                        "5px 4px 0",
                      color: "#475569",
                      fontSize: 10,
                      textAlign: isUser
                        ? "right"
                        : "left",
                    }}
                  >
                    {message.timestamp.toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute:
                          "2-digit",
                      },
                    )}
                  </p>
                </div>
              </div>
            </div>
          );
        })}


        {isLoading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            <Loader2
              size={18}
              style={{
                animation:
                  "spin 1s linear infinite",
              }}
            />

            StockSense AI is analyzing
            available market data...
          </div>
        )}


        <div ref={messagesEndRef} />
      </div>


      {/* ============================================= */}
      {/* ERROR */}
      {/* ============================================= */}

      {error && (
        <div
          style={{
            margin: "16px 24px 0",
            padding: "10px 12px",
            borderRadius: 8,
            background: "#450a0a",
            border:
              "1px solid #7f1d1d",
            color: "#fca5a5",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}


      {/* ============================================= */}
      {/* INPUT */}
      {/* ============================================= */}

      <form
        onSubmit={sendMessage}
        style={{
          display: "flex",
          gap: 12,
          padding: 20,
          borderTop:
            "1px solid #1e293b",
          background: "#111827",
        }}
      >
        <input
          value={input}
          onChange={(event) =>
            setInput(
              event.target.value,
            )
          }
          placeholder="Ask about a stock, index, trend, risk, sentiment or portfolio..."
          disabled={isLoading}
          style={{
            flex: 1,
            minWidth: 0,
            padding:
              "14px 16px",
            borderRadius: 10,
            border:
              "1px solid #334155",
            background: "#0f172a",
            color: "white",
            outline: "none",
            fontSize: 14,
          }}
        />


        <button
          type="submit"
          disabled={
            isLoading ||
            !input.trim()
          }
          style={{
            background:
              isLoading ||
              !input.trim()
                ? "#1e3a5f"
                : "#2563eb",
            border: "none",
            borderRadius: 10,
            padding: "0 20px",
            minHeight: 48,
            cursor:
              isLoading ||
              !input.trim()
                ? "not-allowed"
                : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            gap: 8,
            color: "white",
            fontWeight: 700,
          }}
        >
          {isLoading ? (
            <Loader2 size={18} />
          ) : (
            <Send size={18} />
          )}

          Send
        </button>
      </form>


      <div
        style={{
          padding:
            "0 24px 18px",
          color: "#475569",
          fontSize: 11,
          lineHeight: 1.5,
        }}
      >
        StockSense AI responses are
        analytical research outputs and
        are not guaranteed forecasts or
        personalized investment advice.
      </div>
    </div>
  );
}