"use client";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useUrlState } from "@/hooks/use-url-state";

export function SearchInput({ param = "q", placeholder = "Search…", label = "Search" }: { param?: string; placeholder?: string; label?: string }) {
  const { get, setParams } = useUrlState();
  const urlValue = get(param);
  const [value, setValue] = useState(urlValue);
  const debounced = useDebounce(value, 400);
  const lastPushed = useRef(urlValue);

  useEffect(() => {
    if (debounced.trim() === lastPushed.current) return;
    lastPushed.current = debounced.trim();
    setParams({ [param]: debounced.trim() });
  }, [debounced, param, setParams]);

  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input type="search" aria-label={label} value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} className="pl-9" />
    </div>
  );
}
