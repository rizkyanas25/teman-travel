"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaTripadvisor } from "react-icons/fa";

export default function Footer() {
  const t = useTranslations("footer");

  const quickLinks = [
    { key: "home", href: "/#home" },
    { key: "about", href: "/#about" },
    { key: "packages", href: "/#packages" },
    { key: "gallery", href: "/#gallery" },
    { key: "contact", href: "/#contact" },
  ];

  return (
    <footer className="bg-dark-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4 inline-flex">
              <Image src="/images/logomark-nobg.png" alt="Teman Travel Logo" width={40} height={40} className="w-8 h-8 object-contain" />
              <Image src="/images/logotype-nobg.png" alt="Teman Travel" width={160} height={40} className="w-auto h-6 object-contain mt-1" />
            </Link>
            <p className="text-white/40 text-sm leading-relaxed">{t("description")}</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t("quickLinksTitle")}</h4>
            <div className="space-y-2">
              {quickLinks.map((l) => (
                <Link key={l.key} href={l.href} className="block text-sm text-white/40 hover:text-gold-400 transition">
                  {t(`links.${l.key}`)}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t("supportTitle")}</h4>
            <div className="space-y-2 mb-8">
              <Link href="/terms" className="block text-sm text-white/40 hover:text-gold-400 transition">{t("terms")}</Link>
              <Link href="/privacy" className="block text-sm text-white/40 hover:text-gold-400 transition">{t("privacy")}</Link>
              <Link href="/cancellation" className="block text-sm text-white/40 hover:text-gold-400 transition">{t("cancellation")}</Link>
            </div>

            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">{t("paymentsTitle")}</h4>
            <div className="flex gap-4 mb-8">
              <FaCcVisa className="h-8 w-auto text-white/80 hover:text-white transition cursor-pointer" />
              <FaCcMastercard className="h-8 w-auto text-white/80 hover:text-white transition cursor-pointer" />
              <FaCcPaypal className="h-8 w-auto text-white/80 hover:text-white transition cursor-pointer" />
            </div>

            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">{t("recognizedByTitle")}</h4>
            <div className="flex items-center gap-2 opacity-90 text-sm font-medium text-white/80">
              <FaTripadvisor className="h-6 w-6 text-[#34E0A1]" />
              <span>TripAdvisor Excellence</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-8 text-center space-y-2">
          <p className="text-white/40 text-xs">{t("disclaimer")}</p>
          <p className="text-white/30 text-sm">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
