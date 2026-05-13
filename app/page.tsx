import { SiteHeader } from "@/components/SiteHeader";
import { HomeClient } from "@/components/HomeClient";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-3">
        <HomeClient />
      </main>
    </>
  );
}
