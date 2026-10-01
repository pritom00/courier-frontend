import { ScrollText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import type { AuditLog, PageMeta } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function AuditLogTable({ logs, meta }: { logs: AuditLog[]; meta: PageMeta }) {
  if (!logs.length) return <EmptyState icon={ScrollText} title="No audit activity yet" description="Actions like role changes and shipment updates will show up here." />;

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Performed by</TableHead>
              <TableHead>When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <Badge variant="brown">{log.action.replaceAll("_", " ")}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {log.entityType}
                  {log.entityId ? ` · ${log.entityId.slice(0, 8)}` : ""}
                </TableCell>
                <TableCell className="text-sm">{log.user?.name ?? "System"}</TableCell>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{formatDateTime(log.createdAt)}</TableCell>
              </TableRow>
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
