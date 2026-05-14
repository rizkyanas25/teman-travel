"use client";
import { useState } from "react";
import { useTranslations, useMessages } from "next-intl";
import Image from "next/image";

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
  { icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "hotel" },
  { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "meals" },
  { icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l5-3 5 3zm0-10h5a2 2 0 012 2v8a2 2 0 01-2 2H6", label: "entrance" },
  { icon: "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 012 0v10", label: "transfer" },
  { icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", label: "video" },
];

export default function PackageCard({ index, onViewDetails }: { index: string; onViewDetails: () => void }) {
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
                <svg className="w-3.5 h-3.5 text-gold-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feat.icon} />
                </svg>
                <span className="text-[11px] text-white/50">{featureLabels[i]}</span>
              </div>
            ))}
          </div>
          <button
            onClick={onViewDetails}
            className="mt-3 text-xs text-gold-400 hover:text-gold-300 transition flex items-center gap-1 group"
          >
            {t("viewDetails")}
            <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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
                  <svg className={`w-4 h-4 text-white/40 transition-transform ${openDay === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
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

        {/* CTA */}
        <a href="#kontak-kami" className="block w-full text-center py-3 bg-gold-400 text-dark-900 rounded-xl font-semibold hover:bg-gold-300 transition">
          {tc("bookNow")}
        </a>
      </div>
    </div>
  );
}
