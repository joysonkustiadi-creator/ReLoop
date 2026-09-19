"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDeals } from "@/lib/store";
import { getMaterial, formatIDR, formatKg } from "@/lib/data";
import StatusBadge from "@/components/StatusBadge";

export default function DealPage() {
  const { id } = useParams<{ id: string }>();
  const { deals, ready, sendMessage, counterOffer, acceptOffer, rejectDeal } = useDeals();
  const deal = deals.find((d) => d.id === id);
  const m = deal ? getMaterial(deal.materialId) : undefined;

  const [text, setText] = useState("");
  const [counter, setCounter] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [deal?.messages.length, deal?.pending]);

  if (!ready) return null;
  if (!deal || !m) {
    return (
      <div className="card p-8 text-center">
        <p className="font-medium">Deal not found.</p>
        <Link href="/deals" className="btn-primary mt-4">Go to my deals</Link>
      </div>
    );
  }

  const closed = deal.status === "Accepted" || deal.status === "Rejected";
  const busy = !!deal.pending;
  const price = deal.agreedPrice ?? deal.supplierAsk;

  const send = () => { if (text.trim()) { sendMessage(deal.id, text.trim()); setText(""); } };
  const sendCounter = () => { const p = Number(counter); if (p > 0) { counterOffer(deal.id, p); setCounter(""); } };

  return (
    <div>
      <Link href="/deals" className="text-sm font-medium text-accent hover:underline">← My deals</Link>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-primary">{m.name}</h1>
        <StatusBadge status={deal.status} />
      </div>
      <p className="mt-1 text-ink/70">{m.supplier.name} · {m.location}</p>

      {deal.status === "Accepted" && (
        <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <p className="font-semibold">Deal accepted</p>
          <p className="text-sm">{formatKg(deal.quantityKg)} at {formatIDR(price)}/kg — total {formatIDR(deal.quantityKg * price)}. Delivery to {deal.deliveryLocation}.</p>
        </div>
      )}
      {deal.status === "Rejected" && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-900">
          <p className="font-semibold">Deal rejected</p>
          <p className="text-sm">This request is closed. <Link href="/" className="font-medium underline">Find another material</Link> or send a new request.</p>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <section className="card flex flex-col">
          <div className="max-h-[420px] min-h-[260px] flex-1 space-y-3 overflow-y-auto p-4">
            {deal.messages.map((x) =>
              x.from === "system" ? (
                <p key={x.id} className="text-center text-xs font-medium text-ink/60">{x.text}</p>
              ) : (
                <div key={x.id} className={`flex ${x.from === "buyer" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${x.from === "buyer" ? "bg-primary text-white" : "bg-canvas text-ink"}`}>
                    <p className="mb-0.5 text-xs opacity-70">{x.from === "buyer" ? "You" : m.supplier.name}</p>
                    <p>{x.text}</p>
                    {x.offer && <p className="mt-1 rounded bg-black/10 px-2 py-1 text-xs font-semibold">Offer: {formatIDR(x.offer)}/kg</p>}
                  </div>
                </div>
              ),
            )}
            {busy && <p className="text-xs italic text-ink/50">{deal.status === "Pending" ? "Waiting for the supplier to respond…" : "Supplier is replying…"}</p>}
            <div ref={endRef} />
          </div>

          {!closed && (
            <div className="space-y-3 border-t border-ink/10 p-4">
              <div className="flex gap-2">
                <input className="field" placeholder="Write a message…" value={text} disabled={busy} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
                <button className="btn-outline" disabled={busy || !text.trim()} onClick={send}>Send</button>
              </div>
              <div className="flex gap-2">
                <input className="field" type="number" min={0} step={50} placeholder="Counter-offer (Rp/kg)" value={counter} disabled={busy} onChange={(e) => setCounter(e.target.value)} />
                <button className="btn-outline whitespace-nowrap" disabled={busy || !Number(counter)} onClick={sendCounter}>Send counter-offer</button>
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="card p-4 text-sm">
            <h2 className="font-semibold">Deal terms</h2>
            <dl className="mt-3 space-y-2">
              <div className="flex justify-between"><dt className="text-ink/60">Quantity</dt><dd className="font-medium">{formatKg(deal.quantityKg)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink/60">Listed price</dt><dd className="font-medium">{formatIDR(m.pricePerKg)}/kg</dd></div>
              <div className="flex justify-between"><dt className="text-ink/60">Your offer</dt><dd className="font-medium">{formatIDR(deal.buyerOffer)}/kg</dd></div>
              <div className="flex justify-between"><dt className="text-ink/60">Supplier offer</dt><dd className="font-medium">{formatIDR(price)}/kg</dd></div>
              <div className="flex justify-between border-t border-ink/10 pt-2"><dt className="text-ink/60">Total</dt><dd className="font-bold text-primary">{formatIDR(deal.quantityKg * price)}</dd></div>
            </dl>
            <p className="mt-3 text-xs text-ink/60">Delivery: {deal.deliveryLocation}</p>
          </div>

          {!closed && (
            <div className="space-y-2">
              <button className="btn-primary w-full" disabled={deal.status !== "Negotiating" || busy} onClick={() => acceptOffer(deal.id)}>
                Accept offer at {formatIDR(deal.supplierAsk)}/kg
              </button>
              <button className="btn-outline w-full text-red-700" onClick={() => rejectDeal(deal.id)}>Decline deal</button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
