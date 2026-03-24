"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UserCircle,
  Calendar,
  MessageCircle,
  Clock,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard/expert", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/dashboard/expert/profile", label: "Profil & CV", icon: UserCircle },
  { href: "/dashboard/expert/appointments", label: "Randevular", icon: Clock },
  { href: "/dashboard/expert/calendar", label: "Takvim", icon: Calendar },
  { href: "/dashboard/expert/messages", label: "Mesajlar", icon: MessageCircle },
];

export function ExpertDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="space-y-1 p-3">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/dashboard/expert"
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <PageLayout>
      <div className="border-b border-border/40 bg-muted/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 lg:hidden">
          <p className="text-sm font-medium text-foreground">Uzman paneli</p>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
        {mobileOpen && (
          <div className="border-t border-border bg-background lg:hidden">
            <NavLinks onNavigate={() => setMobileOpen(false)} />
          </div>
        )}
      </div>

      <div className="mx-auto flex max-w-7xl flex-1 gap-0 px-0 lg:min-h-[calc(100vh-12rem)]">
        <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-muted/10 lg:block">
          <div className="sticky top-24 p-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Menü
            </p>
            <NavLinks />
          </div>
        </aside>
        <div className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </div>
    </PageLayout>
  );
}
