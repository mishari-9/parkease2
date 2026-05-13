import { BookingFlowClient } from "@/components/BookingFlowClient";

type Props = { params: { lotId: string } };

export default function BookPage({ params }: Props) {
  return <BookingFlowClient lotId={params.lotId} />;
}
