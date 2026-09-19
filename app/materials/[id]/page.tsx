"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getMaterial, formatIDR, formatKg } from "@/lib/data";
import VerifiedBadge from "@/components/VerifiedBadge";

export default function MaterialDetail() {
  const { id } = useParams<{ id: string }>();
  const m = getMaterial(id);

  if (!m) {
    return (
      <div className="card p-8 text-center">
        <p className="font-medium">This material is no longer listed.</p>
        <Link href="/" className="btn-primary mt-4">Back to marketplace</Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/" className="text-sm font-medium text-accent hover:underline">← Marketplace</Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="card p-6">
            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{m.type}</span>
            <h1 className="mt-3 text-2xl font-bold text-primary">{m.name}</h1>
            <p className="mt-3 text-ink/75">{m.description}</p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold">Specifications</h2>
            <dl className="mt-3 divide-y divide-ink/10 text-sm">
              {[["Grade", m.grade], ["Condition", m.condition], ["Location", m.location], ...m.specs].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2">
                  <dt className="text-ink/60">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold">Supplier</h2>
            <p className="mt-2 font-medium">{m.supplier.name}</p>
            <p className="text-sm text-ink/60">{m.supplier.city} · Member since {m.supplier.since}</p>
            <div className="mt-3"><VerifiedBadge verified={m.supplier.verified} /></div>
          </section>
        </div>

        <aside className="card h-fit p-6 lg:sticky lg:top-6">
          <p className="text-sm text-ink/60">Listed price</p>
          <p className="text-3xl font-bold text-primary">{formatIDR(m.pricePerKg)}<span className="text-base font-normal text-ink/60"> /kg</span></p>
          <dl className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-ink/60">Available</dt><dd className="font-medium">{formatKg(m.quantityKg)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink/60">Minimum order</dt><dd className="font-medium">{formatKg(m.minOrderKg)}</dd></div>
          </dl>
          <Link href={`/materials/${m.id}/request`} className="btn-primary mt-5 w-full">Request to Buy</Link>
        </aside>
      </div>
    </div>
  );
}
