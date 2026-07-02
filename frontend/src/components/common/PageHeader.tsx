type Props = {
  title: string;
  subtitle: string;
};

export default function PageHeader({
  title,
  subtitle,
}: Props) {
  return (
    <div>
      <h1
        style={{
          color: "white",
          fontSize: 32,
          marginBottom: 8,
        }}
      >
        {title}
      </h1>

      <p
        style={{
          color: "#94a3b8",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}