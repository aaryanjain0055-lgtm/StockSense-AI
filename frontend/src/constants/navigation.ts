import {
  LayoutDashboard,
  TrendingUp,
  LineChart,
  BrainCircuit,
  BriefcaseBusiness,
  Bot,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Market",
    path: "/market",
    icon: TrendingUp,
  },
  {
    title: "Stocks",
    path: "/stocks",
    icon: LineChart,
  },
  {
    title: "Prediction",
    path: "/prediction",
    icon: BrainCircuit,
  },
  {
    title: "Portfolio",
    path: "/portfolio",
    icon: BriefcaseBusiness,
  },
  {
    title: "AI Advisor",
    path: "/ai-advisor",
    icon: Bot,
  },
];