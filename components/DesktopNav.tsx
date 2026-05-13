"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Search, CalendarDays, User } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/userStore";
import { tc } from "@/lib/i18n";
import { ThemeToggle } from "@/components/ThemeToggle";
import { QASSIM_COLLEGE_OF_COMPUTER } from "@/lib/qassimCampus";

const tabs = [
  { href: "/", icon: Map, labelKey: "map" as const },
  { href: "/search", icon: Search, labelKey: "search" as const },
  { href: "/bookings", icon: CalendarDays, labelKey: "bookings" as const },
  { href: "/profile", icon: User, labelKey: "profile" as const },
];

export function DesktopNav() {
  const pathname = usePathname();
  const lang = useUserStore((s) => s.user.language);

  if (
    pathname?.startsWith("/book/") ||
    pathname?.startsWith("/confirmation/")
  ) {
    return null;
  }

  return (
    <aside
      className="fixed inset-y-0 start-0 z-50 hidden w-64 flex-col border-e border-slate-200 bg-white/95 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/95 lg:flex"
      aria-label="Main navigation"
    >
      <div className="border-b border-slate-100 px-5 py-6 dark:border-slate-800">
        <Link href="/" className="block">
          <span className="text-xl font-extrabold tracking-tight text-pe-primary">
            {tc(lang, "brand")}
          </span>
          <p className="mt-1 text-[11px] font-medium leading-snug text-slate-500 dark:text-slate-400">
            {QASSIM_COLLEGE_OF_COMPUTER.nameEn}
          </p>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
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
              className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "text-pe-primary"
                  : "text-slate-600 hover:bg-pe-light hover:text-pe-primary dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="tab-pill-desk"
                  className="absolute inset-0 rounded-xl bg-pe-light dark:bg-slate-800"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <Icon className="relative z-10 h-5 w-5" strokeWidth={active ? 2.25 : 2} />
              <span className="relative z-10">{tc(lang, labelKey)}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-100 p-4 dark:border-slate-800">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Appearance
        </p>
        <ThemeToggle />
      </div>
    </aside>
  );
}
