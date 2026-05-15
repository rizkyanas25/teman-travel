"use client";
import { useTranslations } from "next-intl";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { useState, useEffect } from "react";

import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsApp() {
  const tc = useTranslations("common");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling past most of the Hero section
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Check on mount as well
    toggleVisibility();

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <a
      href={getWhatsAppUrl(tc("whatsappGenericMessage"))}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 group transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
      aria-label="Chat via WhatsApp"
    >
      {/* Tooltip */}
      <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-dark-800 text-white text-xs rounded-lg border border-white/10 shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {tc("contactUs")} 💬
      </span>

      {/* Glassmorphism Button */}
      <div className="w-14 h-14 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 shadow-2xl hover:bg-white/10 transition-all hover:scale-110 wa-pulse">
        <FaWhatsapp className="w-8 h-8 text-[#25D366]" />
      </div>
    </a>
  );
}
