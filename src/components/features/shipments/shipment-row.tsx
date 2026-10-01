import Link from "next/link";
import { Package } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import type { ShipmentListItem } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function ShipmentRow({ shipment, href, showParty }: { shipment: ShipmentListItem; href: string; showParty?: "customer" | "courier" }) {
  const party = showParty === "customer" ? shipment.customer?.name : showParty === "courier" ? shipment.courier?.name : null;
  return (
    <TableRow>
      <TableCell>
        <Link href={href} className="flex items-center gap-2 font-medium text-primary hover:underline">
          <Package className="size-4 shrink-0" aria-hidden />
          {shipment.trackingCode}
        </Link>
      </TableCell>
      {showParty && <TableCell className="text-sm text-muted-foreground">{party ?? "—"}</TableCell>}
      <TableCell className="max-w-[220px] truncate text-sm text-muted-foreground">{shipment.deliveryAddress}</TableCell>
      <TableCell>
        <StatusBadge status={shipment.status} />
      </TableCell>
      <TableCell className="whitespace-nowrap font-medium">{formatCurrency(shipment.price)}</TableCell>
      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{formatDate(shipment.createdAt)}</TableCell>
    </TableRow>
  );
}
