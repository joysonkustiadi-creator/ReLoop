"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDeals } from "@/lib/store";

export default function Header() {
  const path = usePathname();
  const { deals } = useDeals();
  const link = (href: string, label: string, active: boolean) => (
    <Link href={href} className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${active ? "bg-white/15 text-white" : "text-white/75 hover:text-white"}`}>
      {label}
    </Link>
  );
  return (
    <header className="bg-primary">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="text-xl font-bold tracking-tight text-white">ReLoop</span>
          <span className="hidden text-sm text-white/70 sm:inline">Where Waste Becomes Value</span>
        </Link>
        <nav className="flex gap-1">
          {link("/", "Marketplace", path === "/" || path.startsWith("/materials"))}
          {link("/deals", deals.length ? `My deals (${deals.length})` : "My deals", path.startsWith("/deals"))}
        </nav>
      </div>
    </header>
  );
}
