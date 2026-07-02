type Props = {
  message: string;
};

export default function EmptyState({
  message,
}: Props) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: 40,
        color: "#94a3b8",
      }}
    >
      {message}
    </div>
  );
}