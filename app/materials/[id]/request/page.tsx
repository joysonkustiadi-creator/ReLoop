"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getMaterial, formatIDR, formatKg } from "@/lib/data";
import { useDeals } from "@/lib/store";

export default function RequestToBuy() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { createDeal } = useDeals();
  const m = getMaterial(id);

  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [place, setPlace] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  if (!m) return <p>Material not found. <Link href="/" className="text-accent underline">Back to marketplace</Link></p>;

  const q = Number(qty), p = Number(price);
  const total = q > 0 && p > 0 ? q * p : 0;

  const submit = () => {
    if (!q || q < m.minOrderKg) return setError(`Quantity must be at least ${formatKg(m.minOrderKg)}.`);
    if (q > m.quantityKg) return setError(`Only ${formatKg(m.quantityKg)} is available.`);
    if (!p || p <= 0) return setError("Enter your offer price per kg.");
    if (!place.trim()) return setError("Enter a delivery location.");
    setError("");
    router.push(`/deals/${createDeal({ materialId: m.id, quantityKg: q, offerPrice: p, deliveryLocation: place.trim(), notes: notes.trim() })}`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link href={`/materials/${m.id}`} className="text-sm font-medium text-accent hover:underline">← Back to material</Link>
      <h1 className="mt-4 text-2xl font-bold text-primary">Request to Buy</h1>
      <p className="mt-1 text-ink/70">{m.name} · {m.supplier.name} · Listed at {formatIDR(m.pricePerKg)}/kg</p>

      <div className="card mt-6 space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="qty">Quantity (kg)</label>
            <input id="qty" className="field" type="number" min={m.minOrderKg} max={m.quantityKg} placeholder={`Min ${m.minOrderKg}`} value={qty} onChange={(e) => setQty(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="price">Offer price (Rp/kg)</label>
            <input id="price" className="field" type="number" min={0} step={50} placeholder={String(m.pricePerKg)} value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="place">Delivery location</label>
          <input id="place" className="field" placeholder="e.g. Kawasan Industri Jababeka, Cikarang" value={place} onChange={(e) => setPlace(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="notes">Notes to supplier (optional)</label>
          <textarea id="notes" className="field min-h-[90px]" placeholder="Packaging, delivery schedule, quality requirements…" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {total > 0 && <p className="rounded-md bg-canvas p-3 text-sm">Estimated total: <strong>{formatIDR(total)}</strong></p>}
        {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}

        <button className="btn-primary w-full" onClick={submit}>Send request</button>
      </div>
    </div>
  );
}
