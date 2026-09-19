# ReLoop — Where Waste Becomes Value

B2B marketplace MVP for industrial waste and secondary materials (Next.js 14 + TypeScript + Tailwind, local mock data).

## Run
```bash
npm install
npm run dev     # http://localhost:3000
```

## Demo journey
Marketplace (search/filter) → Material detail → Request to Buy → Negotiation (chat, counter-offer) → Accept offer → Deal status.

- Data lives in `lib/data.ts`; deals are kept in browser localStorage (`lib/store.tsx`).
- The supplier is simulated: it replies about 2 seconds after each buyer action. It counters between your offer and its ask, agrees once your price reaches its floor, and rejects offers far below it.
- Statuses: Pending (waiting for first reply) → Negotiating → Accepted / Rejected.
