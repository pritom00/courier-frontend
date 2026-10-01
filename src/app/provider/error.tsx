"use client";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Something went wrong"
      description={error.message || "We couldn't load this page. Please try again."}
      action={
        <Button onClick={reset}>
          <RefreshCw /> Try again
        </Button>
      }
    />
  );
}
