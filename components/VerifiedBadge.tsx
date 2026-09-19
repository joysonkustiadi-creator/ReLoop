export default function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
      <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" aria-hidden><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0z" /></svg>
      Verified supplier
    </span>
  ) : (
    <span className="rounded-full bg-ink/5 px-2 py-0.5 text-xs font-medium text-ink/60">Verification pending</span>
  );
}
