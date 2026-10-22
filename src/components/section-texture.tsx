/** Soft brand-red light used sparingly behind dark sections. */
export function SectionTexture() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgb(var(--red-600) / 0.35) 0%, rgb(var(--red-600) / 0) 70%)' }}
      />
      <div
        className="absolute -bottom-32 -right-16 h-[380px] w-[380px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgb(var(--red-800) / 0.3) 0%, rgb(var(--red-800) / 0) 70%)' }}
      />
    </div>
  );
}
