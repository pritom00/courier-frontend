import { PackageX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { ShipmentRow } from "@/components/features/shipments/shipment-row";
import type { Paginated, Shipment, ShipmentListItem } from "@/lib/types";

export function ShipmentTable({
  items,
  meta,
  baseHref,
  showParty,
  emptyTitle = "No shipments found",
  emptyDescription = "Try adjusting your filters or search.",
}: {
  items: ShipmentListItem[];
  meta: Paginated<Shipment>["meta"];
  baseHref: string;
  showParty?: "customer" | "courier";
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (!items.length) return <EmptyState icon={PackageX} title={emptyTitle} description={emptyDescription} />;

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking code</TableHead>
              {showParty && <TableHead>{showParty === "customer" ? "Customer" : "Courier"}</TableHead>}
              <TableHead>Delivery address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((s) => (
              <ShipmentRow key={s.id} shipment={s} href={`${baseHref}/${s.id}`} showParty={showParty} />
            ))}
          </TableBody>
        </Table>
        <div className="px-4 pb-4">
          <Pagination meta={meta} />
        </div>
      </CardContent>
    </Card>
  );
}
