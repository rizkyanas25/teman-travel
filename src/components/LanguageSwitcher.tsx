"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = {
  en: "EN",
  id: "ID",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const getActiveSectionHash = () => {
    if (typeof window === "undefined") return "";
    const sections = ["home", "about", "packages", "gallery", "testimonials", "faq"];
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
          return `#${id}`;
        }
      }
    }
    return window.location.hash || "";
  };

  const handleSwitch = (newLocale: string) => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    const hash = getActiveSectionHash();
    router.replace(`${pathname}${search}${hash}`, { locale: newLocale, scroll: false });
  };

  return (
    <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => handleSwitch(l)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
            locale === l
              ? "bg-gold-400 text-dark-900"
              : "text-white/60 hover:text-white"
          }`}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
