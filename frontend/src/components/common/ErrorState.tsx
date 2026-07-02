type Props = {
  message: string;
};

export default function ErrorState({
  message,
}: Props) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: 40,
        color: "#ef4444",
      }}
    >
      {message}
    </div>
  );
}