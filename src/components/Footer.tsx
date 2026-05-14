"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("footer");

  const quickLinks = [
    { key: "home", href: "#home" },
    { key: "about", href: "#about" },
    { key: "packages", href: "#packages" },
    { key: "gallery", href: "#gallery" },
    { key: "contact", href: "#contact" },
  ];

  return (
    <footer className="bg-dark-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/images/logo.png" alt="Teman Travel" width={40} height={40} className="rounded-lg" />
              <span className="font-[family-name:var(--font-display)] text-lg font-bold text-gold-400">Teman Travel</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">{t("description")}</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t("quickLinksTitle")}</h4>
            <div className="space-y-2">
              {quickLinks.map((l) => (
                <a key={l.key} href={l.href} className="block text-sm text-white/40 hover:text-gold-400 transition">
                  {t(`links.${l.key}`)}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t("packagesTitle")}</h4>
            <div className="space-y-2 text-sm text-white/40">
              <p>{t("package4d3n")}</p>
              <p>{t("package5d4n")}</p>
              <p>{t("package6d5n")}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-8 text-center">
          <p className="text-white/30 text-sm">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
