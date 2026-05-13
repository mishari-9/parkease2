import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-pe-primary">404</h1>
      <p className="text-slate-600">This page does not exist.</p>
      <Link href="/" className="rounded-xl bg-pe-primary px-6 py-3 text-sm font-semibold text-white">
        Back to map
      </Link>
    </div>
  );
}
