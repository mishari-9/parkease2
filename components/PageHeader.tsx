"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  title: string;
  backHref?: string;
};

export function PageHeader({ title, backHref }: Props) {
  const router = useRouter();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 flex items-center gap-3 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95"
    >
      <button
        type="button"
        onClick={() => (backHref ? router.push(backHref) : router.back())}
        className="flex h-10 w-10 items-center justify-center rounded-full text-pe-primary transition hover:bg-pe-light dark:hover:bg-slate-800"
        aria-label="Back"
      >
        <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
      </button>
      <h1 className="min-w-0 flex-1 truncate text-lg font-semibold text-slate-900 dark:text-white">{title}</h1>
      <Link href="/" className="shrink-0 text-sm font-semibold text-pe-primary">
        ParkEase
      </Link>
    </motion.header>
  );
}
