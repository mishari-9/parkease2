import { ConfirmationClient } from "@/components/ConfirmationClient";

type Props = { params: { bookingId: string } };

export default function ConfirmationPage({ params }: Props) {
  return <ConfirmationClient bookingId={params.bookingId} />;
}
