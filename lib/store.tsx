"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { getMaterial, formatIDR, formatKg } from "@/lib/data";

export type DealStatus = "Pending" | "Negotiating" | "Accepted" | "Rejected";

export interface Message {
  id: string;
  from: "buyer" | "supplier" | "system";
  text: string;
  offer?: number; // price per kg attached to this message
  at: number;
}

export interface Deal {
  id: string;
  materialId: string;
  quantityKg: number;
  deliveryLocation: string;
  notes: string;
  buyerOffer: number; // latest buyer price per kg
  supplierAsk: number; // latest supplier price per kg (the offer the buyer can accept)
  agreedPrice?: number;
  status: DealStatus;
  pending: "offer" | "message" | null; // waiting for the (simulated) supplier to respond
  messages: Message[];
  createdAt: number;
}

export interface NewRequest {
  materialId: string;
  quantityKg: number;
  offerPrice: number;
  deliveryLocation: string;
  notes: string;
}

interface Ctx {
  deals: Deal[];
  ready: boolean;
  createDeal: (r: NewRequest) => string;
  sendMessage: (id: string, text: string) => void;
  counterOffer: (id: string, price: number) => void;
  acceptOffer: (id: string) => void;
  rejectDeal: (id: string) => void;
}

const DealsContext = createContext<Ctx | null>(null);
const KEY = "reloop.deals.v1";
const uid = () => Math.random().toString(36).slice(2, 10);
const msg = (from: Message["from"], text: string, offer?: number): Message => ({ id: uid(), from, text, offer, at: Date.now() });
const round50 = (n: number) => Math.round(n / 50) * 50;

// Simulated supplier: replies after a short delay so the journey can be demoed end to end.
function applySupplierReply(d: Deal): Deal {
  if (!d.pending) return d;
  const m = getMaterial(d.materialId);
  if (!m) return { ...d, pending: null };

  if (d.pending === "message") {
    const last = d.messages.filter((x) => x.from === "buyer").pop()?.text.toLowerCase() ?? "";
    let text = "Thanks for the question. Material is available and can be inspected at our facility on request.";
    if (/deliver|kirim|antar|shipping/.test(last)) text = `We can deliver to ${d.deliveryLocation} within 5–7 working days after the deal is confirmed.`;
    else if (/sample|contoh/.test(last)) text = "We can send a 1 kg sample to your factory this week.";
    else if (/quality|kualitas|spec|grade/.test(last)) text = `The material matches the listed specification (Grade ${m.grade}). A lab report is available on request.`;
    return { ...d, pending: null, status: d.status === "Pending" ? "Negotiating" : d.status, messages: [...d.messages, msg("supplier", text)] };
  }

  const p = d.buyerOffer;
  if (p < m.floorPrice * 0.75) {
    return {
      ...d, pending: null, status: "Rejected",
      messages: [...d.messages, msg("supplier", `Sorry, ${formatIDR(p)}/kg is too far below our price for this material. We have to decline this request.`)],
    };
  }
  if (p >= m.floorPrice) {
    const price = Math.min(p, d.supplierAsk);
    return {
      ...d, pending: null, status: "Negotiating", supplierAsk: price,
      messages: [...d.messages, msg("supplier", `We can agree to ${formatIDR(price)}/kg for ${formatKg(d.quantityKg)}. Please accept the offer to close the deal.`, price)],
    };
  }
  const counter = Math.max(m.floorPrice, round50((p + d.supplierAsk) / 2));
  return {
    ...d, pending: null, status: "Negotiating", supplierAsk: counter,
    messages: [...d.messages, msg("supplier", `Thanks for your offer. The best we can do is ${formatIDR(counter)}/kg for this volume.`, counter)],
  };
}

export function DealsProvider({ children }: { children: ReactNode }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [ready, setReady] = useState(false);
  const scheduled = useRef(new Set<string>());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDeals(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(deals)); } catch {}
    deals.forEach((d) => {
      if (d.pending && !scheduled.current.has(d.id)) {
        scheduled.current.add(d.id);
        setTimeout(() => {
          setDeals((prev) => prev.map((x) => (x.id === d.id ? applySupplierReply(x) : x)));
          scheduled.current.delete(d.id);
        }, 1800);
      }
    });
  }, [deals, ready]);

  const update = useCallback((id: string, fn: (d: Deal) => Deal) => setDeals((prev) => prev.map((d) => (d.id === id ? fn(d) : d))), []);

  const createDeal = useCallback((r: NewRequest) => {
    const m = getMaterial(r.materialId);
    const id = uid();
    const deal: Deal = {
      id, materialId: r.materialId, quantityKg: r.quantityKg, deliveryLocation: r.deliveryLocation, notes: r.notes,
      buyerOffer: r.offerPrice, supplierAsk: m?.pricePerKg ?? r.offerPrice, status: "Pending", pending: "offer", createdAt: Date.now(),
      messages: [
        msg("buyer", `Request to buy ${formatKg(r.quantityKg)} at ${formatIDR(r.offerPrice)}/kg. Delivery to ${r.deliveryLocation}.${r.notes ? ` Notes: ${r.notes}` : ""}`, r.offerPrice),
      ],
    };
    setDeals((prev) => [deal, ...prev]);
    return id;
  }, []);

  const sendMessage = useCallback((id: string, text: string) =>
    update(id, (d) => (d.status === "Accepted" || d.status === "Rejected" || d.pending ? d : { ...d, pending: "message", messages: [...d.messages, msg("buyer", text)] })), [update]);

  const counterOffer = useCallback((id: string, price: number) =>
    update(id, (d) => (d.status === "Accepted" || d.status === "Rejected" || d.pending ? d : {
      ...d, buyerOffer: price, pending: "offer", messages: [...d.messages, msg("buyer", `Counter-offer: ${formatIDR(price)}/kg.`, price)],
    })), [update]);

  const acceptOffer = useCallback((id: string) =>
    update(id, (d) => (d.status !== "Negotiating" || d.pending ? d : {
      ...d, status: "Accepted", agreedPrice: d.supplierAsk,
      messages: [...d.messages, msg("system", `Deal accepted at ${formatIDR(d.supplierAsk)}/kg for ${formatKg(d.quantityKg)}.`)],
    })), [update]);

  const rejectDeal = useCallback((id: string) =>
    update(id, (d) => (d.status === "Accepted" || d.status === "Rejected" ? d : {
      ...d, status: "Rejected", pending: null, messages: [...d.messages, msg("system", "You declined this deal.")],
    })), [update]);

  return (
    <DealsContext.Provider value={{ deals, ready, createDeal, sendMessage, counterOffer, acceptOffer, rejectDeal }}>
      {children}
    </DealsContext.Provider>
  );
}

export function useDeals() {
  const ctx = useContext(DealsContext);
  if (!ctx) throw new Error("useDeals must be used inside DealsProvider");
  return ctx;
}
