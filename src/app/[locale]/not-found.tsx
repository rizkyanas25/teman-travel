import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

export default async function NotFound() {
  // Extract the locale from headers set by next-intl middleware
  const locale = (await headers()).get("x-next-intl-locale") || "en";
  
  // Fetch translations on the server side using the resolved locale
  const t = await getTranslations({ locale, namespace: "common.notFound" });

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[70vh] flex flex-col justify-center">
        <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] text-gold-400 mb-4">
          {t("title")}
        </h1>
        <p className="text-lg text-white/60 mb-8 max-w-xl">
          {t("description")}
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-xs font-bold tracking-wide uppercase rounded-lg text-black bg-gold-400 hover:bg-gold-300 hover:shadow-gold-500/20 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] select-none"
          >
            {t("backHome")}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
