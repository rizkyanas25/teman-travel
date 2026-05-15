"use client";
import { useTranslations } from "next-intl";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import SocialSidebar from "./SocialSidebar";
import { FaWhatsapp } from "react-icons/fa";

export default function Hero() {
  const t = useTranslations("hero");
  const tc = useTranslations("common");

  return (
    <section id="home" className="hero-bg min-h-screen flex items-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
        <div className="max-w-3xl">
          <p className="text-gold-400 font-medium tracking-widest uppercase text-sm mb-4">
            {t("badge")}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {t.rich("headline", {
              bali: (chunks) => <span className="text-gold-400">{chunks}</span>,
              nusaPenida: (chunks) => <span className="text-gold-400">{chunks}</span>,
            })}
          </h1>
          <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-2xl">
            {t("subtext")}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#packages" className="px-8 py-3.5 border-2 border-transparent bg-gold-400 text-dark-900 rounded-full font-semibold hover:bg-gold-300 transition transform hover:scale-105 flex items-center justify-center">
              {t("ctaPrimary")}
            </a>
            <a
              href={getWhatsAppUrl(tc("whatsappGenericMessage"))}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 border-2 border-[#25D366]/50 text-[#25D366] rounded-full font-semibold hover:bg-[#25D366]/10 hover:border-[#25D366] transition flex items-center justify-center gap-2"
            >
              <FaWhatsapp className="w-5 h-5" />
              {t("ctaSecondary")}
            </a>
          </div>
        </div>
      </div>
      <SocialSidebar />
    </section>
  );
}
