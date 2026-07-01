import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  title: string;
  path: string;
  icon: React.ElementType;
}

export default function SidebarItem({
  title,
  path,
  icon: Icon,
}: SidebarItemProps) {
  return (
    <NavLink
      to={path}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        marginBottom: "8px",
        borderRadius: "10px",
        textDecoration: "none",
        color: "#ffffff",
        backgroundColor: isActive ? "#2563eb" : "transparent",
        transition: "0.3s",
      })}
    >
      <Icon size={20} />
      <span>{title}</span>
    </NavLink>
  );
}