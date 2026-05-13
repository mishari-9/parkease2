"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export function LocaleHtml({ children }: { children: React.ReactNode }) {
  const lang = useUserStore((s) => s.user.language);

  useEffect(() => {
    document.documentElement.lang = lang === "ar" ? "ar" : "en";
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return <>{children}</>;
}
