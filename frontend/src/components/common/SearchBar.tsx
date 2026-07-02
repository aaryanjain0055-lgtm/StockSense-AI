import { Search } from "lucide-react";

type Props = {
  placeholder: string;
};

export default function SearchBar({
  placeholder,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "#111827",
        border: "1px solid #1e293b",
        borderRadius: 12,
        padding: "14px 18px",
      }}
    >
      <Search
        size={20}
        color="#94a3b8"
      />

      <input
        placeholder={placeholder}
        style={{
          marginLeft: 12,
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          color: "white",
        }}
      />
    </div>
  );
}