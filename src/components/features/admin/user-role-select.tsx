"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUserRole } from "@/lib/api/mutations";
import { errorMessage } from "@/lib/api/errors";
import { ROLE_LABEL } from "@/lib/constants";
import type { Role } from "@/lib/types";

export function UserRoleSelect({ userId, role, disabled }: { userId: string; role: Role; disabled?: boolean }) {
  const [value, setValue] = useState(role);
  const mutation = useMutation({
    mutationFn: (next: Role) => updateUserRole(userId, next),
    onSuccess: (_, next) => {
      setValue(next);
      toast.success("Role updated");
    },
    onError: (err) => toast.error(errorMessage(err, "Could not update role")),
  });

  return (
    <Select
      value={value}
      onValueChange={(v) => mutation.mutate(v as Role)}
      disabled={disabled || mutation.isPending}
    >
      <SelectTrigger aria-label="User role" className="h-8 w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
          <SelectItem key={r} value={r}>
            {ROLE_LABEL[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
