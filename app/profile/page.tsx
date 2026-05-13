"use client";

import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUserStore } from "@/store/userStore";
import { useThemeStore, type FontSize } from "@/store/themeStore";
import { tc } from "@/lib/i18n";
import { MOCK_LOTS } from "@/data/mockLots";
import { Bell, Globe, LogOut, Type } from "lucide-react";

export default function ProfilePage() {
  const lang = useUserStore((s) => s.user.language);
  const user = useUserStore((s) => s.user);
  const setLanguage = useUserStore((s) => s.setLanguage);
  const notificationsOn = useUserStore((s) => s.notificationsOn);
  const setNotifications = useUserStore((s) => s.setNotifications);

  const fontSize = useThemeStore((s) => s.fontSize);
  const setFontSize = useThemeStore((s) => s.setFontSize);

  const savedLots = MOCK_LOTS.filter((l) => user.savedLotIds.includes(l.id));

  const fontSizeLabels: Record<FontSize, string> = {
    small: lang === "ar" ? "صغير" : "Small",
    medium: lang === "ar" ? "متوسط" : "Medium",
    large: lang === "ar" ? "كبير" : "Large",
  };

  const fontSizeValues: FontSize[] = ["small", "medium", "large"];

  return (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-4 pb-28 sm:px-6 lg:px-8 lg:pb-10">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <div className="relative h-20 w-20 overflow-hidden rounded-full ring-4 ring-pe-light/80 dark:ring-slate-700">
            <Image
              src={user.avatarUrl}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              {user.fullName}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {user.phone}
            </p>
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-pe-primary">
            {tc(lang, "vehicles")}
          </h2>
          <ul className="mt-3 space-y-2">
            {user.vehicles.map((v) => (
              <li
                key={v.id}
                className="rounded-xl border border-slate-100 bg-pe-surface px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/80"
              >
                <span className="font-bold text-slate-900 dark:text-white">
                  {v.plate}
                </span>{" "}
                · {v.make} {v.model}{" "}
                <span className="text-xs font-semibold uppercase text-pe-primary">
                  ({v.type})
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-pe-primary">
            {tc(lang, "savedLots")}
          </h2>
          <ul className="mt-3 space-y-2">
            {savedLots.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/lots/${l.id}`}
                  className="flex items-center gap-3 rounded-xl border border-transparent bg-pe-surface px-4 py-3 text-sm font-semibold text-pe-primary transition hover:border-pe-primary/30 dark:bg-slate-800/80"
                >
                  <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                    <Image
                      src={l.photoUrls[0]}
                      alt={l.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <span className="line-clamp-2">{l.name}</span>
                </Link>
              </li>
            ))}
            {savedLots.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {lang === "ar" ? "لا شيء بعد" : "None yet"}
              </p>
            )}
          </ul>
        </section>

        <section className="mt-4 space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
            {lang === "ar" ? "المظهر" : "Appearance"}
          </p>
          <ThemeToggle />

          {/* Font Size Slider */}
          <div className="flex items-center justify-between py-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <Type className="h-4 w-4 text-pe-primary" />
              {lang === "ar" ? "حجم الخط" : "Font Size"}
            </span>
            <div className="flex items-center gap-1 rounded-full bg-pe-surface p-1 dark:bg-slate-800">
              {fontSizeValues.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setFontSize(v)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                    fontSize === v
                      ? "bg-pe-primary text-white shadow"
                      : "text-slate-500 hover:text-pe-primary dark:text-slate-400"
                  }`}
                >
                  {fontSizeLabels[v]}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="flex w-full items-center justify-between py-2 text-sm"
            onClick={() => setLanguage(lang === "en" ? "ar" : "en")}
          >
            <span className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
              <Globe className="h-4 w-4 text-pe-primary" />
              {tc(lang, "language")}
            </span>
            <span className="rounded-full bg-pe-light px-3 py-1 text-xs font-bold text-pe-primary dark:bg-slate-800">
              {lang === "en" ? "EN" : "عربي"}
            </span>
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-between py-2 text-sm"
            onClick={() => setNotifications(!notificationsOn)}
          >
            <span className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
              <Bell className="h-4 w-4 text-pe-primary" />
              {tc(lang, "notifications")}
            </span>
            <span className="text-xs font-bold text-pe-primary">
              {notificationsOn ? "On" : "Off"}
            </span>
          </button>
        </section>

        <button
          type="button"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <LogOut className="h-4 w-4" />
          {tc(lang, "signOut")}
        </button>
      </div>
    </>
  );
}
