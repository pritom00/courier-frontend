import {
  LayoutDashboard,
  Package,
  Plus,
  CreditCard,
  User,
  Users,
  Warehouse,
  ScrollText,
  BarChart3,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/lib/nav";

const ICONS: Record<IconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  package: Package,
  plus: Plus,
  card: CreditCard,
  user: User,
  users: Users,
  hub: Warehouse,
  logs: ScrollText,
  chart: BarChart3,
  truck: Truck,
};

export function NavIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden />;
}
