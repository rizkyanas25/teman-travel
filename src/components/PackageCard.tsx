"use client";
import { useState } from "react";
import { useTranslations, useMessages } from "next-intl";
import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FiHome, FiCoffee, FiMapPin, FiTruck, FiVideo, FiChevronRight, FiChevronDown, FiMap } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
interface PricingItem { pax: string; price: string; }
interface ItineraryDay { day: string; title: string; items: string[]; }
interface PackageItem {
  title: string;
  image: string;
  pricing: PricingItem[];
  includes: string[];
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

  return (
    <div className="package-card bg-dark-800 rounded-2xl overflow-hidden border border-white/10">
      {/* Image */}
      <div className="img-hover relative h-56">
        <Image src={pkg.image} alt={pkg.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 to-transparent" />
        <div className="absolute bottom-4 left-6">
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
        <div>
          <div className="flex flex-wrap gap-2">
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
          </div>
          <button
            onClick={onViewDetails}
            className="mt-3 text-xs text-gold-400 hover:text-gold-300 transition flex items-center gap-1 group"
          >
            {t("viewDetails")}
            <FiChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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

        {/* View Route Button */}
        {onViewRoute && (
          <button
            onClick={onViewRoute}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-gold-400/10 border border-white/10 hover:border-gold-400/30 rounded-xl text-sm font-medium transition-all text-white/80 hover:text-gold-400"
          >
            <FiMap className="w-4 h-4 shrink-0" />
            <span>{t("viewRoute")}</span>
          </button>
        )}

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
