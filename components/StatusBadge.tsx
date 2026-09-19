import type { DealStatus } from "@/lib/store";

const styles: Record<DealStatus, string> = {
  Pending: "bg-amber-100 text-amber-900",
  Negotiating: "bg-sky-100 text-sky-900",
  Accepted: "bg-emerald-100 text-emerald-900",
  Rejected: "bg-red-100 text-red-900",
};

export default function StatusBadge({ status }: { status: DealStatus }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>{status}</span>;
}
