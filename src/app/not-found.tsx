import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <p className="text-7xl font-black text-primary">404</p>
      <div className="rounded-full bg-accent p-4 text-accent-foreground">
        <Compass className="size-8" aria-hidden />
      </div>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="max-w-md text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
