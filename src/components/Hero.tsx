"use client";
import { useTranslations } from "next-intl";
import SocialSidebar from "./SocialSidebar";

export default function Hero() {
  const t = useTranslations("hero");

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
          <div className="flex flex-wrap gap-4">
            <a href="#packages" className="px-8 py-3.5 bg-gold-400 text-dark-900 rounded-full font-semibold hover:bg-gold-300 transition transform hover:scale-105">
              {t("ctaPrimary")}
            </a>
            <a href="#contact" className="px-8 py-3.5 border-2 border-white/30 text-white rounded-full font-semibold hover:border-gold-400 hover:text-gold-400 transition">
              {t("ctaSecondary")}
            </a>
          </div>
        </div>
      </div>
      <SocialSidebar />
    </section>
  );
}
