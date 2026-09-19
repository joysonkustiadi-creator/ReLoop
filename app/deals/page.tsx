"use client";

import Link from "next/link";
import { useDeals } from "@/lib/store";
import { getMaterial, formatIDR, formatKg } from "@/lib/data";
import StatusBadge from "@/components/StatusBadge";

export default function DealsList() {
  const { deals, ready } = useDeals();
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">My deals</h1>
      {ready && deals.length === 0 ? (
        <div className="card mt-6 p-8 text-center">
          <p className="font-medium">You have no deals yet.</p>
          <p className="mt-1 text-sm text-ink/60">Find a material and send a request to start negotiating.</p>
          <Link href="/" className="btn-primary mt-4">Browse marketplace</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {deals.map((d) => {
            const m = getMaterial(d.materialId);
            return (
              <Link key={d.id} href={`/deals/${d.id}`} className="card flex items-center justify-between gap-4 p-4 transition hover:border-accent">
                <div>
                  <p className="font-semibold">{m?.name}</p>
                  <p className="text-sm text-ink/60">{m?.supplier.name} · {formatKg(d.quantityKg)} · {formatIDR(d.agreedPrice ?? d.supplierAsk)}/kg</p>
                </div>
                <StatusBadge status={d.status} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
