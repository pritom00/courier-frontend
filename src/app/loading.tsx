import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center" role="status" aria-label="Loading">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  );
}
