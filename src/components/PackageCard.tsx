"use client";
import { useState } from "react";
import { useTranslations, useMessages } from "next-intl";
import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FiHome, FiCoffee, FiMapPin, FiTruck, FiVideo, FiChevronRight, FiChevronDown, FiMap, FiShare2, FiInfo } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";


const featureIcons = [
  { icon: FiHome, label: "hotel" },
  { icon: FiCoffee, label: "meals" },
  { icon: FiMapPin, label: "entrance" },
  { icon: FiTruck, label: "transfer" },
  { icon: FiVideo, label: "video" },
];

const getTierIndex = (pax: number): number => {
  if (pax >= 2 && pax <= 3) return 0;
  if (pax >= 4 && pax <= 5) return 1;
  if (pax >= 6 && pax <= 13) return 2;
  if (pax >= 14 && pax <= 20) return 3;
  return 0; // fallback
};

const parsePrice = (priceStr: string): number => {
  return parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 0;
};

const formatPrice = (value: number, originalStr: string): string => {
  if (originalStr.includes("Rp")) {
    return "Rp " + value.toLocaleString("id-ID");
  }
  if (originalStr.includes("$")) {
    return "$" + value.toLocaleString("en-US");
  }
  return value.toString();
};

export default function PackageCard({ 
  index, 
  onViewDetails, 
  onViewRoute, 
  paxCount = 2 
}: { 
  index: string; 
  onViewDetails: () => void; 
  onViewRoute?: () => void; 
  paxCount?: number 
}) {
  const tc = useTranslations("common");
  const t = useTranslations("packages");
  const messages = useMessages() as unknown as IntlMessages;
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const pkg = messages.packages.items[parseInt(index)];

  if (!pkg) return null;

  const featureLabels = [
    t("featureLabels.hotel"),
    t("featureLabels.meals"),
    t("featureLabels.entrance"),
    t("featureLabels.transfer"),
    t("featureLabels.video"),
  ];

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Capture the current query params (e.g. ?pax=10) to make guest count persistent upon sharing
    const search = typeof window !== "undefined" ? window.location.search : "";
    // Combine origin, query params, and specific card anchor ID for the perfect shareable URL
    const pureUrl = `${window.location.origin}/${search}#pkg-${index}`;
    
    navigator.clipboard.writeText(pureUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id={`pkg-${index}`}
      className="package-card group bg-dark-800 rounded-2xl overflow-hidden border border-white/10 scroll-mt-24"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden rounded-t-2xl [mask-image:linear-gradient(white,white)]">
        {/* Floating Mood Tags - STA-A */}
        {pkg.tags && (
          <div className="absolute top-4 left-6 z-20 flex flex-wrap gap-1.5 pointer-events-none animate-[fadeInUp_0.3s_ease]">
            {pkg.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-dark-950/80 backdrop-blur-md border border-white/10 text-gold-400 shadow-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image 
            src={pkg.image} 
            alt={pkg.title} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-110 transform-gpu will-change-transform" 
            sizes="(max-width: 768px) 100vw, 33vw" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/95 via-dark-900/40 to-transparent z-10 pointer-events-none translate-z-[1px] backface-hidden" />
        <div className="absolute bottom-4 left-6 z-20 pointer-events-none translate-z-[2px] backface-hidden">
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">{pkg.title}</h3>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Dynamic Pricing - Single Price Hero - STA-D / SPM-A */}
        {(() => {
          const tierIdx = getTierIndex(paxCount);
          const activePricing = pkg.pricing[tierIdx] || pkg.pricing[0];
          const currentPrice = activePricing.price;
          const currentPaxLabel = activePricing.pax;

          // Compute dynamic total group price
          const priceInt = parsePrice(currentPrice);
          const totalPriceVal = priceInt * paxCount;
          const totalPriceStr = formatPrice(totalPriceVal, currentPrice);
          const totalPriceText = t("totalForGuests", { total: totalPriceStr, pax: paxCount });

          return (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between items-center text-center select-none relative overflow-hidden group/price">
              <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                {currentPaxLabel}
              </span>
              <div className="flex items-baseline justify-center gap-1.5 mt-2 flex-nowrap whitespace-nowrap">
                <span className="text-2xl sm:text-3xl md:text-2xl lg:text-xl xl:text-3xl font-black text-gold-400 tracking-tight transition-all duration-300 transform scale-100 group-hover/price:scale-105 whitespace-nowrap">
                  {currentPrice}
                </span>
                <span className="text-[10px] sm:text-xs text-white/50 shrink-0 whitespace-nowrap">/ {tc("perPerson")}</span>
              </div>
              <span className="text-[9px] sm:text-[10px] xl:text-[11px] text-white/35 font-medium mt-3 bg-white/5 px-2 py-1 rounded-full border border-white/5 block whitespace-nowrap">
                {totalPriceText}
              </span>
            </div>
          );
        })()}

        {/* Icon Badges — at-a-glance features */}
        <div className="flex flex-wrap items-center gap-2">
          {featureIcons.map((feat, i) => (
            <div
              key={feat.label}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10"
              title={featureLabels[i]}
            >
              <feat.icon className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span className="text-[11px] text-white/50">{featureLabels[i]}</span>
            </div>
          ))}
          <button
            onClick={onViewDetails}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gold-400/10 border border-gold-400/30 hover:bg-gold-400/20 transition-colors group"
          >
            <span className="text-[11px] text-gold-400 font-medium">{t("viewDetails")}</span>
            <FiChevronRight className="w-3 h-3 text-gold-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Itinerary */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">{tc("itinerary")}:</h4>
          <div className="space-y-2">
            {pkg.itinerary.map((day, i) => (
              <div key={day.day} className="border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenDay(openDay === i ? null : i)}
                  className="w-full flex justify-between items-center px-4 py-3 bg-white/5 hover:bg-white/10 transition text-left"
                >
                  <span className="text-sm font-medium">
                    <span className="text-gold-400">{day.day}</span>
                    <span className="text-white/50 ml-2">— {day.title}</span>
                  </span>
                  <FiChevronDown className={`w-4 h-4 text-white/40 transition-transform ${openDay === i ? "rotate-180" : ""}`} />
                </button>
                <div 
                  className={`itinerary-content ${openDay === i ? "open" : ""}`}
                  aria-hidden={openDay !== i}
                >
                  <div className="px-4 py-3 space-y-2">
                    {day.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
                        <span className="text-sm text-white/50">{item}</span>
                      </div>
                    ))}
                    {/* Logistical Day Tip - STA-B.2 */}
                    {day.tip && (
                      <div className="mt-3 pt-3 border-t border-white/5 flex gap-2 items-start text-xs text-gold-400/80 leading-relaxed animate-[fadeInUp_0.15s_ease]">
                        <FiInfo className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                        <p className="italic">
                          <strong>Tip:</strong> {day.tip}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Row: View Route & Share */}
        <div className="flex gap-2 relative">
          {onViewRoute && (
            <button
              onClick={onViewRoute}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-gold-400/10 border border-white/10 hover:border-gold-400/30 rounded-xl text-sm font-medium transition-all text-white/80 hover:text-gold-400"
            >
              <FiMap className="w-4 h-4 shrink-0" />
              <span>{t("viewRoute")}</span>
            </button>
          )}
          <button
            onClick={handleShare}
            className="w-12 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-white transition-all"
            title="Share package"
          >
            <FiShare2 className="w-4 h-4" />
          </button>

          {/* Toast Notification */}
          {copied && (
            <div className="absolute -top-10 right-0 bg-gold-400 text-dark-900 text-[10px] font-bold px-3 py-1.5 rounded-lg animate-[fadeInUp_0.2s_ease] shadow-xl whitespace-nowrap z-20">
              {tc("linkCopied")}
            </div>
          )}
        </div>

        {/* CTA */}
        <a
          href={getWhatsAppUrl(tc("whatsappBookMessage", { title: `${pkg.title} (${paxCount} ${t("guestLabel")})` }))}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-[#25D366]/20"
        >
          <FaWhatsapp className="w-5 h-5 shrink-0" />
          {tc("bookNow")}
        </a>
      </div>
    </div>
  );
}
