"use client";

import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { useUserStore } from "@/store/userStore";
import { tc } from "@/lib/i18n";
import { MOCK_LOTS } from "@/data/mockLots";
import { Bell, Globe, LogOut } from "lucide-react";

export default function ProfilePage() {
  const lang = useUserStore((s) => s.user.language);
  const user = useUserStore((s) => s.user);
  const setLanguage = useUserStore((s) => s.setLanguage);
  const notificationsOn = useUserStore((s) => s.notificationsOn);
  const setNotifications = useUserStore((s) => s.setNotifications);

  const savedLots = MOCK_LOTS.filter((l) => user.savedLotIds.includes(l.id));

  return (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-lg px-4 py-4 pb-28">
        <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card">
          <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-pe-light">
            <Image src={user.avatarUrl} alt="" fill className="object-cover" sizes="64px" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">{user.fullName}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
            <p className="text-xs text-slate-400">{user.phone}</p>
          </div>
        </div>

        <section className="mt-6 rounded-2xl bg-white p-4 shadow-card">
          <h2 className="text-sm font-bold text-pe-primary">{tc(lang, "vehicles")}</h2>
          <ul className="mt-3 space-y-2">
            {user.vehicles.map((v) => (
              <li key={v.id} className="rounded-xl bg-pe-surface px-3 py-2 text-sm">
                <span className="font-semibold">{v.plate}</span> · {v.make} {v.model}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-4 rounded-2xl bg-white p-4 shadow-card">
          <h2 className="text-sm font-bold text-pe-primary">{tc(lang, "savedLots")}</h2>
          <ul className="mt-3 space-y-2">
            {savedLots.map((l) => (
              <li key={l.id}>
                <Link href={`/lots/${l.id}`} className="block rounded-xl bg-pe-surface px-3 py-2 text-sm font-medium text-pe-primary">
                  {l.name}
                </Link>
              </li>
            ))}
            {savedLots.length === 0 && (
              <p className="text-sm text-slate-500">{lang === "ar" ? "لا شيء بعد" : "None yet"}</p>
            )}
          </ul>
        </section>

        <section className="mt-4 space-y-2 rounded-2xl bg-white p-4 shadow-card">
          <button
            type="button"
            className="flex w-full items-center justify-between py-2 text-sm"
            onClick={() => setLanguage(lang === "en" ? "ar" : "en")}
          >
            <span className="flex items-center gap-2 font-medium text-slate-800">
              <Globe className="h-4 w-4 text-pe-primary" />
              {tc(lang, "language")}
            </span>
            <span className="rounded-full bg-pe-light px-3 py-1 text-xs font-bold text-pe-primary">
              {lang === "en" ? "EN" : "عربي"}
            </span>
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-between py-2 text-sm"
            onClick={() => setNotifications(!notificationsOn)}
          >
            <span className="flex items-center gap-2 font-medium text-slate-800">
              <Bell className="h-4 w-4 text-pe-primary" />
              {tc(lang, "notifications")}
            </span>
            <span className="text-xs font-semibold text-pe-primary">{notificationsOn ? "On" : "Off"}</span>
          </button>
        </section>

        <button
          type="button"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600"
        >
          <LogOut className="h-4 w-4" />
          {tc(lang, "signOut")}
        </button>
      </div>
    </>
  );
}
