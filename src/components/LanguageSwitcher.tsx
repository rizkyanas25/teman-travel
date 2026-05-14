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

  const handleSwitch = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
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
