"use client";
import { useState } from "react";
import { useTranslations, useMessages } from "next-intl";
import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FiHome, FiCoffee, FiMapPin, FiTruck, FiVideo, FiChevronRight, FiChevronDown, FiMap, FiShare2 } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
interface PricingItem { pax: string; price: string; }
interface ItineraryDay { day: string; title: string; items: string[]; }
interface PackageItem {
  title: string;
  image: string;
  pricing: PricingItem[];
  includes: { title: string; description: string }[];
  excludes: string[];
  itinerary: ItineraryDay[];
}

const featureIcons = [
  { icon: FiHome, label: "hotel" },
  { icon: FiCoffee, label: "meals" },
  { icon: FiMapPin, label: "entrance" },
  { icon: FiTruck, label: "transfer" },
  { icon: FiVideo, label: "video" },
];

export default function PackageCard({ index, onViewDetails, onViewRoute }: { index: string; onViewDetails: () => void; onViewRoute?: () => void }) {
  const tc = useTranslations("common");
  const t = useTranslations("packages");
  const messages = useMessages();
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const packagesMessages = messages.packages as { items: PackageItem[] };
  const pkg = packagesMessages.items[parseInt(index)];

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
    // Use origin only (no locale) and index-based ID for consistency across languages
    const pureUrl = `${window.location.origin}/#pkg-${index}`;
    
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
          <p className="text-gold-400 text-sm mt-1">{tc("perPerson")}</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Pricing */}
        <div className="space-y-2">
          {pkg.pricing.map((p) => (
            <div key={p.pax} className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-sm text-white/60">{p.pax}</span>
              <span className="text-gold-400 font-semibold">{p.price}</span>
            </div>
          ))}
        </div>

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
                <div className={`itinerary-content ${openDay === i ? "open" : ""}`}>
                  <div className="px-4 py-3 space-y-2">
                    {day.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
                        <span className="text-sm text-white/50">{item}</span>
                      </div>
                    ))}
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
          href={getWhatsAppUrl(tc("whatsappBookMessage", { title: pkg.title }))}
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
