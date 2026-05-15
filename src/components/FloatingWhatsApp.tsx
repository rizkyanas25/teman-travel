"use client";
import { useTranslations } from "next-intl";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsApp() {
  const tc = useTranslations("common");

  return (
    <a
      href={getWhatsAppUrl(tc("whatsappGenericMessage"))}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat via WhatsApp"
    >
      {/* Tooltip */}
      <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-dark-800 text-white text-xs rounded-lg border border-white/10 shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {tc("contactUs")} 💬
      </span>

      {/* Button */}
      <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform wa-pulse">
        <FaWhatsapp className="w-7 h-7 text-white" />
      </div>
    </a>
  );
}
