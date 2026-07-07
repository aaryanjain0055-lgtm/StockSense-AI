import {
  Search,
  LoaderCircle,
} from "lucide-react";

import type {
  KeyboardEvent,
} from "react";

type Props = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: () => void;
  loading?: boolean;
};

export default function SearchBar({
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  loading = false,
}: Props) {
  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      event.key === "Enter" &&
      !loading
    ) {
      onSearch?.();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "#111827",
        border: "1px solid #1e293b",
        borderRadius: 12,
        padding: "10px 12px 10px 18px",
      }}
    >
      <Search
        size={20}
        color="#94a3b8"
      />

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={loading}
        onChange={(event) =>
          onChange?.(
            event.target.value,
          )
        }
        onKeyDown={
          handleKeyDown
        }
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          color: "#ffffff",
          fontSize: 15,
          width: "100%",
          opacity: loading
            ? 0.7
            : 1,
        }}
      />

      {onSearch && (
        <button
          type="button"
          onClick={onSearch}
          disabled={
            loading ||
            !value.trim()
          }
          style={{
            minWidth: 110,
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            gap: 8,
            border: "none",
            borderRadius: 8,
            padding: "10px 16px",
            background:
              loading ||
              !value.trim()
                ? "#334155"
                : "#2563eb",
            color: "#ffffff",
            fontWeight: 600,
            cursor:
              loading ||
              !value.trim()
                ? "not-allowed"
                : "pointer",
          }}
        >
          {loading ? (
            <>
              <LoaderCircle
                size={16}
              />

              Analyzing...
            </>
          ) : (
            <>
              <Search
                size={16}
              />

              Analyze
            </>
          )}
        </button>
      )}
    </div>
  );
}