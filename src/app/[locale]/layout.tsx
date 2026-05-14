import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

const SITE_URL = "https://temantravel.com";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const tAbout = await getTranslations({ locale, namespace: "about" });

  const isId = locale === "id";
  const title = isId
    ? "Teman Travel — Paket Tour Bali & Nusa Penida | Agen Wisata Terpercaya"
    : "Teman Travel — Bali & Nusa Penida Tour Packages | Trusted Travel Agency";
  const description = t("subtext");

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        en: `${SITE_URL}/en`,
        id: `${SITE_URL}/id`,
      },
    },
    keywords: isId
      ? [
          "paket tour bali", "wisata nusa penida", "agen travel bali",
          "paket liburan bali murah", "tour bali nusa penida",
          "teman travel", "private tour bali", "wisata ubud",
          "uluwatu temple", "tanah lot", "kelingking beach",
        ]
      : [
          "bali tour package", "nusa penida trip", "bali travel agent",
          "affordable bali vacation", "bali nusa penida tour",
          "teman travel", "private tour bali", "ubud tour",
          "uluwatu temple", "tanah lot", "kelingking beach",
        ],
    authors: [{ name: "Teman Travel", url: SITE_URL }],
    creator: "Teman Travel",
    publisher: "Teman Travel",
    formatDetection: {
      email: true,
      address: true,
      telephone: true,
    },
    openGraph: {
      type: "website",
      locale: isId ? "id_ID" : "en_US",
      alternateLocale: isId ? "en_US" : "id_ID",
      url: `${SITE_URL}/${locale}`,
      siteName: "Teman Travel",
      title,
      description,
      images: [
        {
          url: "/images/og-image.png",
          width: 1200,
          height: 630,
          alt: "Teman Travel — Bali & Nusa Penida Tour Packages",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-image.png"],
      creator: "@temantravel",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/icon.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon.ico", sizes: "48x48" },
      ],
      apple: [
        { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    category: "travel",
  };
}

function JsonLd({ locale }: { locale: string }) {
  const isId = locale === "id";

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Teman Travel",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    image: `${SITE_URL}/images/og-image.png`,
    description: isId
      ? "Agen perjalanan wisata terpercaya di Bali. Merancang perjalanan tak terlupakan dengan harga yang masuk akal."
      : "Your trusted Bali travel agency. Crafting unforgettable journeys at prices that make sense.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Cempaka Wangi No. 18",
      addressLocality: "Batubulan, Sukawati",
      addressRegion: "Bali",
      postalCode: "80582",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -8.6095,
      longitude: 115.2793,
    },
    telephone: "+628886662507",
    email: "info@temantravel.com",
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "21:00",
    },
    sameAs: [
      "https://www.facebook.com/temantravel",
      "https://www.instagram.com/temantravel",
      "https://www.tiktok.com/@temantravel",
    ],
    areaServed: {
      "@type": "Place",
      name: "Bali, Indonesia",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isId ? "Paket Tour Bali" : "Bali Tour Packages",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: isId ? "Paket 4 Hari 3 Malam" : "4 Days 3 Nights Package",
            description: isId
              ? "Wisata Ubud & Nusa Penida termasuk hotel, makan, dan transportasi"
              : "Ubud & Nusa Penida tour including hotel, meals, and transfers",
            touristType: "Leisure",
          },
          price: isId ? "2750000" : "175",
          priceCurrency: isId ? "IDR" : "USD",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: isId ? "Paket 5 Hari 4 Malam" : "5 Days 4 Nights Package",
            description: isId
              ? "Wisata Ubud, Uluwatu & Nusa Penida termasuk hotel, makan, dan transportasi"
              : "Ubud, Uluwatu & Nusa Penida tour including hotel, meals, and transfers",
            touristType: "Leisure",
          },
          price: isId ? "3450000" : "220",
          priceCurrency: isId ? "IDR" : "USD",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: isId ? "Paket 6 Hari 5 Malam" : "6 Days 5 Nights Package",
            description: isId
              ? "Wisata lengkap Ubud, Uluwatu, Nusa Penida, Tanah Lot & Bedugul"
              : "Complete tour: Ubud, Uluwatu, Nusa Penida, Tanah Lot & Bedugul",
            touristType: "Leisure",
          },
          price: isId ? "4600000" : "295",
          priceCurrency: isId ? "IDR" : "USD",
        },
      ],
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Teman Travel",
    url: SITE_URL,
    inLanguage: [isId ? "id-ID" : "en-US"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#D4A843" />
        <JsonLd locale={locale} />
      </head>
      <body className="bg-dark-950 text-white antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
