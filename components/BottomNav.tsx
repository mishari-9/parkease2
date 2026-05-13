"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Search, CalendarDays, User } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/userStore";
import { tc } from "@/lib/i18n";

const tabs = [
  { href: "/", icon: Map, labelKey: "map" as const },
  { href: "/search", icon: Search, labelKey: "search" as const },
  { href: "/bookings", icon: CalendarDays, labelKey: "bookings" as const },
  { href: "/profile", icon: User, labelKey: "profile" as const },
];

export function BottomNav() {
  const pathname = usePathname();
  const lang = useUserStore((s) => s.user.language);

  if (
    pathname?.startsWith("/book/") ||
    pathname?.startsWith("/confirmation/")
  ) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 flex h-[60px] items-stretch border-t border-pe-primary/10 bg-white shadow-nav safe-area-pb"
      aria-label="Main"
    >
      {tabs.map(({ href, icon: Icon, labelKey }) => {
        const active =
          href === "/"
            ? pathname === "/"
            : pathname === href || pathname?.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            prefetch
            className="relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-slate-500 transition-colors hover:text-pe-primary"
          >
            {active && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-x-3 top-1 h-9 rounded-xl bg-pe-light"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex flex-col items-center gap-0.5">
              <Icon
                className={`h-5 w-5 ${active ? "text-pe-primary" : "text-slate-400"}`}
                strokeWidth={active ? 2.25 : 2}
              />
              <span className={active ? "text-pe-primary" : ""}>
                {tc(lang, labelKey)}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
