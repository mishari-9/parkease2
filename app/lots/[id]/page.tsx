import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LotDetailClient } from "@/components/LotDetailClient";
import { getLotById } from "@/data/mockLots";

type Props = { params: { id: string } };

export default function LotPage({ params }: Props) {
  const lot = getLotById(params.id);
  if (!lot) notFound();
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
      <LotDetailClient lot={lot} />
    </Suspense>
  );
}
