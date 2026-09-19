"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { materials, MATERIAL_TYPES, GRADES, CONDITIONS, LOCATIONS, formatIDR, formatKg } from "@/lib/data";
import VerifiedBadge from "@/components/VerifiedBadge";

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="label">{label}</label>
      <select className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function Marketplace() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [grade, setGrade] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return materials.filter((m) =>
      (!term || `${m.name} ${m.type} ${m.supplier.name} ${m.location}`.toLowerCase().includes(term)) &&
      (!type || m.type === type) && (!grade || m.grade === grade) &&
      (!condition || m.condition === condition) && (!location || m.location === location) &&
      (!maxPrice || m.pricePerKg <= Number(maxPrice)),
    );
  }, [q, type, grade, condition, location, maxPrice]);

  const reset = () => { setQ(""); setType(""); setGrade(""); setCondition(""); setLocation(""); setMaxPrice(""); };

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Where Waste Becomes Value</h1>
        <p className="mt-2 max-w-xl text-ink/70">Buy verified industrial waste and secondary materials directly from Indonesian suppliers.</p>
        <input
          className="field mt-5 max-w-xl py-3" type="search" placeholder="Search rubber, PET, textile, aluminum…"
          value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search materials"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="card h-fit space-y-4 p-4">
          <Select label="Material type" value={type} onChange={setType} options={MATERIAL_TYPES} />
          <Select label="Grade" value={grade} onChange={setGrade} options={GRADES} />
          <Select label="Condition" value={condition} onChange={setCondition} options={CONDITIONS} />
          <Select label="Location" value={location} onChange={setLocation} options={LOCATIONS} />
          <div>
            <label className="label">Max price (Rp/kg)</label>
            <input className="field" type="number" min={0} step={500} placeholder="e.g. 10000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </div>
          <button className="btn-outline w-full" onClick={reset}>Clear filters</button>
        </aside>

        <section>
          <p className="mb-3 text-sm text-ink/60">{results.length} material{results.length === 1 ? "" : "s"} found</p>
          {results.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="font-medium">No materials match these filters.</p>
              <p className="mt-1 text-sm text-ink/60">Widen the price limit or clear a filter to see more.</p>
              <button className="btn-primary mt-4" onClick={reset}>Clear filters</button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((m) => (
                <Link key={m.id} href={`/materials/${m.id}`} className="card block p-5 transition hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{m.type}</span>
                    <span className="text-xs font-medium text-ink/60">Grade {m.grade} · {m.condition}</span>
                  </div>
                  <h2 className="mt-3 font-semibold text-ink">{m.name}</h2>
                  <p className="mt-1 text-sm text-ink/60">{m.supplier.name} · {m.location}</p>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-lg font-bold text-primary">{formatIDR(m.pricePerKg)}<span className="text-sm font-normal text-ink/60"> /kg</span></p>
                      <p className="text-xs text-ink/60">{formatKg(m.quantityKg)} available</p>
                    </div>
                    <VerifiedBadge verified={m.supplier.verified} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
