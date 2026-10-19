export function WhatsAppButton({ phoneNumber }: { phoneNumber: string }) {
  const number = phoneNumber.replace(/\D/g, '');
  const message = encodeURIComponent('Hello, Salem Africa.');
  const href = 'https://wa.me/' + number + '?text=' + message;

  return (
    <div className="group fixed bottom-[calc(16px_+_env(safe-area-inset-bottom))] right-4 z-40 sm:bottom-[calc(24px_+_env(safe-area-inset-bottom))] sm:right-6">
      <span className="pointer-events-none absolute right-[calc(100%_+_0.75rem)] top-1/2 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-lg bg-ink px-3.5 py-2 text-xs font-medium text-white opacity-0 shadow-soft transition duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100">
        Chat with us on WhatsApp
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_12px_rgba(0,0,0,0.16)] transition-[transform,box-shadow,background-color] duration-200 ease-out hover:scale-[1.04] hover:bg-[#20BD5A] hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128C7E]"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
          <path
            fill="currentColor"
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.611-.916-2.206-.241-.579-.487-.5-.669-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.074-.792.371-.272.298-1.04 1.016-1.04 2.479s1.064 2.875 1.212 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.695.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.569-.347M12.051 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.261c.002-5.45 4.436-9.884 9.89-9.884 2.64.001 5.122 1.03 6.987 2.898a9.825 9.825 0 0 1 2.892 6.992c-.003 5.45-4.436 9.883-9.885 9.887m8.413-18.297A11.815 11.815 0 0 0 12.055 0C5.495 0 .156 5.338.153 11.902c0 2.087.545 4.124 1.58 5.92L.055 24l6.321-1.659a11.9 11.9 0 0 0 5.674 1.443h.005c6.56 0 11.899-5.338 11.902-11.902a11.83 11.83 0 0 0-3.493-8.394Z"
          />
        </svg>
      </a>
    </div>
  );
}
