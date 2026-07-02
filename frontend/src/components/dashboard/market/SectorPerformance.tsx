import SectionCard from "../../common/SectionCard";

const sectors = [
  { name: "Information Technology", change: "+1.82%", color: "#22c55e" },
  { name: "Banking", change: "+1.12%", color: "#22c55e" },
  { name: "Energy", change: "+0.94%", color: "#22c55e" },
  { name: "Healthcare", change: "-0.42%", color: "#ef4444" },
  { name: "FMCG", change: "+0.65%", color: "#22c55e" },
];

export default function SectorPerformance() {
  return (
    <SectionCard title="📈 Sector Performance">
      {sectors.map((sector) => (
        <div
          key={sector.name}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <span style={{ color: "white" }}>{sector.name}</span>

          <span
            style={{
              color: sector.color,
              fontWeight: "bold",
            }}
          >
            {sector.change}
          </span>
        </div>
      ))}
    </SectionCard>
  );
}