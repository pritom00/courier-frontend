"use client";
import { useEffect } from "react";
import { Menu } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useUiStore } from "@/store/ui-store";
import type { Role, SessionUser } from "@/lib/types";

export function DashboardShell({ role, profileHref, user, children }: { role: Role; profileHref: string; user: SessionUser; children: React.ReactNode }) {
  const { setUser } = useAuth();
  const open = useUiStore((s) => s.mobileNavOpen);
  const setOpen = useUiStore((s) => s.setMobileNavOpen);

  // Hydrate the client identity store from the server-rendered session once per mount.
  useEffect(() => setUser(user), [user, setUser]);

  return (
    <div className="flex min-h-dvh flex-col bg-muted/30 lg:flex-row">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-background focus:px-3 focus:py-2 focus:shadow">
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-6 border-r bg-background p-4 lg:flex">
        <Brand href={profileHref.replace("/profile", "")} />
        <SidebarNav role={role} />
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <div className="flex flex-col gap-6">
            <Brand />
            <SidebarNav role={role} onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation menu">
            <Menu />
          </Button>
          <div className="lg:hidden">
            <Brand />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <UserMenu profileHref={profileHref} />
          </div>
        </header>
        <main id="main" className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
