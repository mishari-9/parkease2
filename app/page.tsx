import { SiteHeader } from "@/components/SiteHeader";
import { HomeClient } from "@/components/HomeClient";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <HomeClient />
      </main>
    </>
  );
}
