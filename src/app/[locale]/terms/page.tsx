import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations("legal.terms");
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[70vh]">
        <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] text-gold-400 mb-8">{t("title")}</h1>
        <div className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-6">
          <p>{t("content")}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
