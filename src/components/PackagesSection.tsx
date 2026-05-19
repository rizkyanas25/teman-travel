"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import PackageCard from "./PackageCard";
import PackageDetailsModal from "./PackageDetailsModal";

const ItineraryMapModal = dynamic(() => import("./ItineraryMapModal"), { ssr: false });

export default function PackagesSection() {
  const t = useTranslations("packages");
  const [modalPackageIndex, setModalPackageIndex] = useState<number | null>(null);
  const [mapModalPackageIndex, setMapModalPackageIndex] = useState<number | null>(null);
  const [paxCount, setPaxCount] = useState<number>(2);

  // Hydration-safe URL query parameter initialization for 'pax'
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const p = params.get("pax");
      if (p) {
        const val = parseInt(p);
        if (!isNaN(val) && val >= 2 && val <= 20) {
          requestAnimationFrame(() => {
            setPaxCount(val);
          });
        }
      }
    }
  }, []);

  // Performant and silent URL query parameter update (no React/network reload overhead)
  const handlePaxChange = (val: number) => {
    setPaxCount(val);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("pax", val.toString());
      const hash = window.location.hash || "";
      window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}${hash}`);
    }
  };

  const itemKeys = ["0", "1", "2"] as const;

  return (
    <section id="packages" className="py-24 bg-dark-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold-400 font-medium tracking-widest uppercase text-sm mb-3">{t("badge")}</p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold mb-4">
            {t.rich("heading", {
              highlight: (chunks) => <span className="text-gold-400">{chunks}</span>,
            })}
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Global Pax Slider - Sleek Responsive Luxury Capsule - SPM-A */}
        <div className="max-w-2xl mx-auto sticky top-24 lg:relative lg:top-0 z-30 p-4 sm:py-3 sm:px-6 bg-[rgba(10,28,25,0.7)] rounded-2xl sm:rounded-full border border-white/10 backdrop-blur-xl relative overflow-hidden group flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 select-none shadow-2xl shadow-black/40 mb-12 lg:mb-16">
          {/* Subtle gold glow behind card (User loved this state!) */}
          <div className="absolute -inset-px bg-gradient-to-r from-gold-400/0 via-gold-400/10 to-gold-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          {/* Mobile Top Row / Desktop Left Side */}
          <div className="relative z-10 flex items-center justify-between sm:justify-start gap-4 shrink-0">
            {/* Label */}
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] leading-none">
              {t("numberOfGuests")}
            </span>
            
            {/* Mobile Dynamic Indicator (Only visible on mobile here) */}
            <div className="sm:hidden relative z-10 flex items-center justify-center gap-1 bg-gold-400/10 h-8 px-3 rounded-full border border-gold-400/25 shrink-0">
              <span className="text-base font-black text-gold-400 tracking-tight">
                {paxCount}
              </span>
              <span className="text-[9px] text-gold-400/80 font-bold uppercase tracking-wider">
                {t("guestLabel")}
              </span>
            </div>
          </div>
          
          {/* Mobile Bottom Row / Desktop Center: Slider Track */}
          <div className="relative z-10 flex-1 flex items-center gap-3 sm:gap-4 w-full">
            <span className="text-[10px] text-white/40 font-bold select-none shrink-0">2</span>
            <div className="flex-1 relative flex items-center">
              <input
                type="range"
                min="2"
                max="20"
                value={paxCount}
                onChange={(e) => handlePaxChange(parseInt(e.target.value))}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 transition-all touch-none"
                style={{
                  background: `linear-gradient(to right, var(--color-gold-400) 0%, var(--color-gold-400) ${((paxCount - 2) / 18) * 100}%, rgba(255, 255, 255, 0.1) ${((paxCount - 2) / 18) * 100}%, rgba(255, 255, 255, 0.1) 100%)`
                }}
              />
            </div>
            <span className="text-[10px] text-white/40 font-bold select-none shrink-0">20</span>
          </div>
          
          {/* Desktop Right Side: Dynamic Indicator (Hidden on mobile) */}
          <div className="hidden sm:flex relative z-10 items-center justify-center gap-1 bg-gold-400/10 h-9 w-24 rounded-full border border-gold-400/25 shrink-0">
            <span className="text-xl font-black text-gold-400 tracking-tight transition-transform duration-300 transform scale-100 group-hover:scale-105">
              {paxCount}
            </span>
            <span className="text-[10px] text-gold-400/80 font-bold uppercase tracking-wider">
              {t("guestLabel")}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {itemKeys.map((idx) => (
            <PackageCard 
              key={idx} 
              index={idx} 
              paxCount={paxCount}
              onViewDetails={() => setModalPackageIndex(parseInt(idx))}
              onViewRoute={() => setMapModalPackageIndex(parseInt(idx))}
            />
          ))}
        </div>
      </div>
      <PackageDetailsModal packageIndex={modalPackageIndex} onClose={() => setModalPackageIndex(null)} />
      <ItineraryMapModal packageIndex={mapModalPackageIndex} onClose={() => setMapModalPackageIndex(null)} />
    </section>
  );
}
