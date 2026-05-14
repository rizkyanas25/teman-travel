"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function About() {
  const t = useTranslations("about");

  const stats = [
    { value: t("statYearsValue"), label: t("statYears") },
    { value: t("statCustomersValue"), label: t("statCustomers") },
    { value: t("statPackagesValue"), label: t("statPackages") },
  ];

  return (
    <section id="about" className="py-24 bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #D4A843 0%, transparent 50%)" }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-gold-400 font-medium tracking-widest uppercase text-sm mb-3">{t("badge")}</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold mb-6">
              {t.rich("heading", {
                bali: (chunks) => <span className="text-gold-400">{chunks}</span>,
              })}
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">{t("paragraph1")}</p>
            <p className="text-white/60 leading-relaxed mb-8">
              {t.rich("paragraph2", {
                brand: (chunks) => <strong className="text-gold-400">{chunks}</strong>,
              })}
            </p>
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center p-4 rounded-xl glass">
                  <p className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-gold-400">{s.value}</p>
                  <p className="text-xs text-white/50 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="img-hover rounded-2xl">
            <Image src="/images/tegalalang-rice-terrace.png" alt="Tegalalang Rice Terrace, Ubud" width={800} height={600} className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]" />
          </div>
        </div>
      </div>
    </section>
  );
}
