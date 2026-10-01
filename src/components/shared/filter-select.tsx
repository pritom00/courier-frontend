"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUrlState } from "@/hooks/use-url-state";

export interface FilterOption {
  value: string;
  label: string;
}

export function FilterSelect({ param, label, allLabel, options, className }: { param: string; label: string; allLabel: string; options: readonly FilterOption[]; className?: string }) {
  const { get, setParams } = useUrlState();
  return (
    <Select value={get(param) || "all"} onValueChange={(v) => setParams({ [param]: v })}>
      <SelectTrigger aria-label={label} className={className ?? "w-full sm:w-48"}>
        <SelectValue placeholder={allLabel} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
