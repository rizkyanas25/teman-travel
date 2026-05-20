import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

const SITE_URL = "https://temantravel.com";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.privacy" });
  return {
    title: `${t("title")} | Teman Travel`,
    description: t("description"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/privacy`,
      languages: {
        en: `${SITE_URL}/en/privacy`,
        id: `${SITE_URL}/id/privacy`,
      },
    },
  };
}

export default function PrivacyPage() {
  const t = useTranslations("legal.privacy");
  const sections = t.raw("sections") as Array<{ heading: string; content: string }>;

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[70vh]">
        <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] text-gold-400 mb-4">{t("title")}</h1>
        <p className="text-lg text-white/60 mb-12">{t("description")}</p>
        
        <div className="space-y-10">
          {sections.map((sec, idx) => (
            <section key={idx}>
              <h2 className="text-2xl font-bold text-white mb-4">{sec.heading}</h2>
              <div className="prose prose-invert max-w-none text-white/70 leading-relaxed whitespace-pre-line">
                {sec.content}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
