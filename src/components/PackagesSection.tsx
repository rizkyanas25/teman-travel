"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import PackageCard from "./PackageCard";
import PackageDetailsModal from "./PackageDetailsModal";

export default function PackagesSection() {
  const t = useTranslations("packages");
  const [modalOpen, setModalOpen] = useState(false);

  const itemKeys = ["0", "1", "2"] as const;

  return (
    <section id="paket-tour" className="py-24 bg-dark-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-gold-400 font-medium tracking-widest uppercase text-sm mb-3">{t("badge")}</p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold mb-4">
            {t.rich("heading", {
              highlight: (chunks) => <span className="text-gold-400">{chunks}</span>,
            })}
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {itemKeys.map((idx) => (
            <PackageCard key={idx} index={idx} onViewDetails={() => setModalOpen(true)} />
          ))}
        </div>
      </div>
      <PackageDetailsModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
