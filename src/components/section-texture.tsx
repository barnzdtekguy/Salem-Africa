/**
 * Two soft red glow blobs for a dark section background — the same
 * decorative language as thispresenthouse.org's cta-box glows, reused
 * behind any full-bleed black/near-black section.
 */
export function SectionTexture() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(184,46,44,0.35) 0%, rgba(184,46,44,0) 70%)' }}
      />
      <div
        className="absolute -bottom-32 -right-16 h-[380px] w-[380px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(138,34,33,0.3) 0%, rgba(138,34,33,0) 70%)' }}
      />
    </div>
  );
}
