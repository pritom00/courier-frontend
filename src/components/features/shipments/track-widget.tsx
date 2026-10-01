"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Public tracking box on the marketing homepage - sends the visitor to sign in, then to their shipment. */
export function TrackWidget() {
  const [code, setCode] = useState("");
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/login?next=${encodeURIComponent(`/dashboard?q=${encodeURIComponent(code.trim())}`)}`);
      }}
      className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
    >
      <label htmlFor="track-code" className="sr-only">
        Tracking code
      </label>
      <Input id="track-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter tracking code, e.g. CRX-…" className="h-12 bg-background" />
      <Button type="submit" size="lg" className="h-12">
        <Search /> Track
      </Button>
    </form>
  );
}
