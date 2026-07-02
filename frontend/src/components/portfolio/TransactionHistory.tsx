const transactions = [
  {
    id: "#TXN001",
    type: "BUY",
    stock: "RELIANCE",
    quantity: 20,
    price: "₹2,950",
    date: "28 Jun 2026",
    amount: "₹59,000",
  },
  {
    id: "#TXN002",
    type: "BUY",
    stock: "TCS",
    quantity: 10,
    price: "₹3,920",
    date: "29 Jun 2026",
    amount: "₹39,200",
  },
  {
    id: "#TXN003",
    type: "SELL",
    stock: "SBIN",
    quantity: 15,
    price: "₹872",
    date: "30 Jun 2026",
    amount: "₹13,080",
  },
];

export default function TransactionHistory() {
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
        🧾 Transaction History
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ color: "#94a3b8" }}>
            <th align="left">ID</th>
            <th align="left">Type</th>
            <th align="left">Stock</th>
            <th align="left">Qty</th>
            <th align="left">Price</th>
            <th align="left">Date</th>
            <th align="left">Amount</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((txn) => (
            <tr
              key={txn.id}
              style={{
                borderTop: "1px solid #1e293b",
              }}
            >
              <td style={{ color: "white", padding: "14px 0" }}>
                {txn.id}
              </td>

              <td
                style={{
                  color:
                    txn.type === "BUY"
                      ? "#22c55e"
                      : "#ef4444",
                  fontWeight: "bold",
                }}
              >
                {txn.type}
              </td>

              <td style={{ color: "white" }}>{txn.stock}</td>

              <td style={{ color: "white" }}>{txn.quantity}</td>

              <td style={{ color: "white" }}>{txn.price}</td>

              <td style={{ color: "#94a3b8" }}>{txn.date}</td>

              <td style={{ color: "white" }}>{txn.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}