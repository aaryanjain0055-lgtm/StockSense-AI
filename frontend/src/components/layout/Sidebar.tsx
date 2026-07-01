import SidebarItem from "./SidebarItem";
import { navigation } from "../../constants/navigation";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "260px",
        background: "#0f172a",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid #1e293b",
      }}
    >
      <div>
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            📈 StockSense AI
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            Smart Investment Platform
          </p>
        </div>

        <div style={{ padding: "20px" }}>
          {navigation.map((item) => (
            <SidebarItem
              key={item.title}
              title={item.title}
              path={item.path}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #1e293b",
        }}
      >
        <div
          style={{
            background: "#1e293b",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <h4>Aaryan</h4>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "13px",
            }}
          >
            Premium User
          </p>
        </div>
      </div>
    </aside>
  );
}