import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { UserRoleSelect } from "@/components/features/admin/user-role-select";
import type { PageMeta, UserRow } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function UsersTable({ users, meta, currentUserId }: { users: UserRow[]; meta: PageMeta; currentUserId: string }) {
  if (!users.length) return <EmptyState icon={Users} title="No users found" description="Try a different search or role filter." />;

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <UserRoleSelect userId={u.id} role={u.role} disabled={u.id === currentUserId} />
                </TableCell>
                <TableCell>
                  <Badge variant={u.isActive ? "success" : "muted"}>{u.isActive ? "Active" : "Inactive"}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
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
