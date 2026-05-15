"use client";
import { useState } from "react";
import { useTranslations, useMessages } from "next-intl";
import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/whatsapp";

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

        {/* View Route Button */}
        {onViewRoute && (
          <button
            onClick={onViewRoute}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-gold-400/10 border border-white/10 hover:border-gold-400/30 rounded-xl text-sm font-medium transition-all text-white/80 hover:text-gold-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
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
          <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          {tc("bookNow")}
        </a>
      </div>
    </div>
  );
}
