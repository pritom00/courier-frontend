import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { CreditCard } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaymentBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/skeletons";
import { getShipments, getShipment } from "@/lib/api/queries";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Payment history" };

async function PaymentsList() {
  const { items } = await getShipments({ page: 1, limit: 20 });
  // The API exposes payments by ID, not a "list mine" endpoint, so each
  // shipment's real payment record is fetched via its detail endpoint.
  const withPayments = await Promise.all(
    items.map(async (s) => ({ shipment: s, payment: (await getShipment(s.id)).payment })),
  );

  if (!withPayments.length) return <EmptyState icon={CreditCard} title="No shipments yet" description="Payment activity for your shipments will appear here." />;

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment status</TableHead>
              <TableHead>Last updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withPayments.map(({ shipment, payment }) => (
              <TableRow key={shipment.id}>
                <TableCell>
                  <Link href={`/dashboard/shipments/${shipment.id}`} className="font-medium text-primary hover:underline">
                    {shipment.trackingCode}
                  </Link>
                </TableCell>
                <TableCell>{formatCurrency(shipment.price)}</TableCell>
                <TableCell>
                  <PaymentBadge status={payment?.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDateTime(payment?.updatedAt ?? shipment.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function PaymentsPage() {
  return (
    <div>
      <PageHeader title="Payment history" description="Real payment status for each of your shipments." />
      <Suspense fallback={<TableSkeleton />}>
        <PaymentsList />
      </Suspense>
    </div>
  );
}
